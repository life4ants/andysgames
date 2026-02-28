const express = require('express');
const router = express.Router();

const {
  run,
  get,
  all,
  insertGameSession,
  getUserGameSessions,
  getUserTotalPlayTime,
  upsertUser,           // optional – to make sure user exists
  getUser
} = require('../db');   // adjust path if your db.js is in a different location

// ────────────────────────────────────────────────
// POST /api/games
// ────────────────────────────────────────────────
// Called by game.postGame

router.post('/', async (req, res) => {
  const {
    userId,
    sessionId,
    status,
    level,
    game_time,
    game_name,
    isMobile,
    player_name,        // only on first sync
    createdAt    // only on first sync
  } = req.body;

  // ────────────────────────────────────────────────
  // Validation
  // ────────────────────────────────────────────────
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'userId is required and must be a string'
    });
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'sessionId is required and must be a string'
    });
  }

  if (!status || typeof status !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'status is required and must be a string'
    });
  }

  if (typeof level !== 'number' || level < 0) {
    return res.status(400).json({
      success: false,
      error: 'level must be a non-negative number'
    });
  }

  if (typeof game_time !== 'number' || game_time < 0) {
    return res.status(400).json({
      success: false,
      error: 'game_time must be a non-negative number (seconds)'
    });
  }

  const safeGameName = typeof game_name === 'string' ? game_name.trim().slice(0, 25) : null;
  const safePlayerName = typeof player_name === 'string' ? player_name.trim().slice(0, 25) : null;

  try {
    let userAction = 'existing';
    let createdUser = false;

    // ────────────────────────────────────────────────
    // First-time user creation (client sends createdAt)
    // ────────────────────────────────────────────────
    if (createdAt) {
      if (typeof createdAt !== 'string') {
        return res.status(400).json({ success: false, error: 'createdAt must be a string' });
      }
      const result = await upsertUser(userId, safePlayerName, createdAt);

      if (result.action === 'created') {
        console.log(`New user created: ${userId} (${safePlayerName})`);
      }
    } else {
      // Normal request → touch lastPlayed
      await run(
        'UPDATE users SET lastPlayed = CURRENT_TIMESTAMP WHERE userId = ?',
        [userId]
      );
    }

    // ────────────────────────────────────────────────
    // Find or create game session by sessionId
    // ────────────────────────────────────────────────
    let gameRecord = await get(
      'SELECT * FROM games WHERE sessionId = ?',
      [sessionId]
    );

    if (gameRecord) {
      // Update existing
      await run(
        `UPDATE games 
         SET game_time = ?, status = ?, played_at = CURRENT_TIMESTAMP
         WHERE sessionId = ?`,
        [game_time, status, sessionId]
      );
      console.log(`Updated game session ${sessionId} (game_name: ${safeGameName || 'none'})`);
    } else {
      // Create new
      await run(
        `INSERT INTO games (userId, sessionId, level, game_time, status, game_name, isMobile)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, sessionId, level, game_time, status, safeGameName, isMobile ? 1 : 0]
      );
      console.log(`Created game session ${sessionId} (game_name: ${safeGameName || 'none'})`);
    }

    // Response – include game_name
    res.status(gameRecord ? 200 : 201).json({
      success: true,
      message: gameRecord ? 'Session updated' : 'Session created',
      sessionId,
      game_name: safeGameName || null,
      level,
      game_time,
      status
    });

  } catch (err) {
    console.error('POST /api/games error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save game session' });
  }
});
// ────────────────────────────────────────────────
// GET /api/games/user/:userId --> not used yet
// ────────────────────────────────────────────────
// Get recent game sessions for a user (for history / profile page)
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit) || 20; // ?limit=50

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    const sessions = await getUserGameSessions(userId, limit);

    res.json({
      userId,
      sessions,
      count: sessions.length
    });
  } catch (err) {
    console.error('Error fetching game sessions:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ────────────────────────────────────────────────
// GET /api/games/user/:userId/total-time --> not used yet
// ────────────────────────────────────────────────
// Useful for showing total playtime on a profile or leaderboard
router.get('/user/:userId/total-time', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    const totalSeconds = await getUserTotalPlayTime(userId);

    res.json({
      userId,
      total_play_time_seconds: totalSeconds,
      total_play_time_readable: formatSeconds(totalSeconds)
    });
  } catch (err) {
    console.error('Error calculating total play time:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/games/all  → returns all game sessions
router.get('/all', async (req, res) => {
  try {
    const games = await all(
      `SELECT 
         g.id, g.userId, g.sessionId, g.game_name, g.level, g.game_time, g.status, g.played_at, g.isMobile,
         u.name AS player_name
       FROM games g
       LEFT JOIN users u ON g.userId = u.userId
       ORDER BY g.played_at DESC`
    );

    res.json({
      success: true,
      count: games.length,
      games
    });
    console.log("sent all games")
  } catch (err) {
    console.error('Error fetching all games:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games'
    });
  }
});

// GET /api/games/highscores
// GET /api/games/highscores?level=0
router.get('/highscores', async (req, res) => {
  // Get requested level (optional – if missing → return all levels)
  const requestedLevel = req.query.level ? parseInt(req.query.level, 10) : null;

  // Validate level (if provided)
  if (requestedLevel !== null && (isNaN(requestedLevel) || requestedLevel < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid level parameter'
    });
  }

  try {
    let query = `
      WITH ranked_games AS (
        SELECT
          g.id,
          g.userId,
          g.sessionId,
          g.level,
          g.game_time,
          g.status,
          g.played_at,
          g.isMobile,
          u.name AS player_name,
          ROW_NUMBER() OVER (
            PARTITION BY g.level
            ORDER BY g.game_time ASC, g.played_at ASC
          ) AS rank
        FROM games g
        LEFT JOIN users u ON g.userId = u.userId
        WHERE g.status = 'completed'
    `;

    const params = [];

    // If specific level requested → add filter
    if (requestedLevel !== null) {
      query += ` AND g.level = ?`;
      params.push(requestedLevel);
    }

    query += `
      )
      SELECT
        id,
        level,
        game_time,
        played_at,
        player_name,
        rank,
        isMobile
      FROM ranked_games
      WHERE rank <= 10
      ORDER BY level ASC, rank ASC
    `;

    const highScores = await all(query, params);

    // Optional: group by level in response
    const grouped = {};
    highScores.forEach(row => {
      if (!grouped[row.level]) grouped[row.level] = [];
      grouped[row.level].push(row);
    });

    res.json({
      success: true,
      requested_level: requestedLevel ?? 'all',
      total_records: highScores.length,
      highscores: grouped
    });

    console.log(`Highscores served – ${highScores.length} records`);
  } catch (err) {
    console.error('Error fetching highscores:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to load high scores'
    });
  }
});

// Simple helper to format seconds → human readable (optional)
function formatSeconds(seconds) {
  if (!seconds) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

module.exports = router;