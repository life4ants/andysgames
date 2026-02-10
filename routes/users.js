// routes/users.js
const express = require('express');
const router = express.Router();
const {
  all,
  upsertUser,
  getUser,
  getUserGameSessions,
  getUserTotalPlayTime
} = require('../db');   // adjust path if db.js is in a different folder

// ────────────────────────────────────────────────
// POST /api/users
// ────────────────────────────────────────────────
// Create or update a user (called on first stats send or profile update)
router.post('/', async (req, res) => {
  const { userId, name } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Optional: basic sanitization / length check
  const safeName = name && name.trim().slice(0, 50) || null;

  try {
    const result = await upsertUser(userId, safeName);

    res.status(result.action === 'created' ? 201 : 200).json({
      success: true,
      action: result.action,
      userId,
      name: safeName || 'Anonymous'
    });
  } catch (err) {
    console.error('Error upserting user:', err);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// GET /api/users/
router.get('/', async (req, res) => {
  try {
    const users = await all(`
      SELECT 
        id,
        userId,
        name,
        createdAt,
        lastPlayed
      FROM users
      ORDER BY lastPlayed DESC
    `);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    console.error('Error fetching all users:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// ────────────────────────────────────────────────
// GET /api/users/:userId --> not used yet
// ────────────────────────────────────────────────
// Get basic user info + some summary stats
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    const user = await getUser(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optional: include summary stats
    const totalPlayTime = await getUserTotalPlayTime(userId);
    // const recentSessions = await getUserGameSessions(userId, 5); // if you want last 5 games

    res.json({
      userId: user.userId,
      name: user.name || 'Anonymous',
      createdAt: user.createdAt,
      lastPlayed: user.lastPlayed,
      totalPlayTimeSeconds: totalPlayTime,
      totalPlayTimeReadable: formatSeconds(totalPlayTime)
      // recentSessions: recentSessions  ← uncomment if you want to include them
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ────────────────────────────────────────────────
// GET /api/users/:userId/exists
// ────────────────────────────────────────────────
// Lightweight check if user exists (useful for client-side before sending stats)
router.get('/:userId/exists', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await getUser(userId);
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Simple seconds → human readable formatter
function formatSeconds(seconds) {
  if (!seconds || seconds === 0) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

module.exports = router;