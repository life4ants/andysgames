// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use a dedicated folder for the database file (gitignore this folder/file)
const dbPath = path.join(__dirname, 'data', 'wemo.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err.message);
    process.exit(1); // or handle gracefully
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

// Initialize tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      userId     TEXT    UNIQUE NOT NULL,
      name       TEXT,
      createdAt  DATETIME,
      lastPlayed DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Games / sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      userId     TEXT    NOT NULL,
      sessionId  TEXT    UNIQUE,                     -- unique per session
      level      INTEGER NOT NULL,
      game_time  REAL    NOT NULL,
      game_name  TEXT,
      isMobile   INTEGER DEFAULT 0,   
      status     TEXT    NOT NULL,
      played_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
  `);

  // Indexes for faster queries
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_userId ON users(userId)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_games_userId ON games(userId)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_games_played_at ON games(played_at)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_games_sessionId ON games(sessionId)`);
});

// Promise-based helpers
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error('SQL error (run):', err.message, '\nQuery:', sql);
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('SQL error (get):', err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('SQL error (all):', err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// User helpers
async function upsertUser(userId, player_name, createdAt) {
  const existing = await get('SELECT * FROM users WHERE userId = ?', [userId]);

  if (existing) {
    await run(
      'UPDATE users SET lastPlayed = CURRENT_TIMESTAMP, name = ? WHERE userId = ?',
      [player_name || existing.name, userId]
    );
    return { action: 'updated', userId };
  } else {
    await run(
      'INSERT INTO users (userId, name, createdAt) VALUES (?, ?, ?)',
      [userId, player_name, createdAt]
    );
    return { action: 'created', userId };
  }
}

async function getUser(userId) {
  return get('SELECT * FROM users WHERE userId = ?', [userId]);
}

// Game session helpers
async function insertGameSession(userId, level, game_time) {
  const result = await run(
    'INSERT INTO games (userId, level, game_time) VALUES (?, ?, ?)',
    [userId, level, game_time]
  );

  // Also bump lastPlayed on the user
  await run(
    'UPDATE users SET lastPlayed = CURRENT_TIMESTAMP WHERE userId = ?',
    [userId]
  );

  return result;
}

async function getUserGameSessions(userId, limit = 50) {
  return all(
    `SELECT * FROM games 
     WHERE userId = ? 
     ORDER BY played_at DESC 
     LIMIT ?`,
    [userId, limit]
  );
}

async function getUserTotalPlayTime(userId) {
  const row = await get(
    'SELECT SUM(game_time) as total_time FROM games WHERE userId = ?',
    [userId]
  );
  return row?.total_time || 0;
}

// Export everything useful
module.exports = {
  run,
  get,
  all,
  upsertUser,
  getUser,
  insertGameSession,
  getUserGameSessions,
  getUserTotalPlayTime,
  // If you ever need direct access (rarely recommended)
  // db,
};