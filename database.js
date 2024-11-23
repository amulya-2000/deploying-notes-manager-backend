const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'notes.db'), (err) => {
  if (err) {
    console.error("Could not connect to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the notes table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT DEFAULT 'Others',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
