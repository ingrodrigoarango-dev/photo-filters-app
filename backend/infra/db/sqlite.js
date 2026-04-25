const sqlite3 = require('sqlite3').verbose();

function createDb({ dbPath, logger = console } = {}) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error?.('Error al conectar con SQLite:', err.message);
        reject(err);
        return;
      }

      resolve(db);
    });
  });
}

function ensureSchema(db) {
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      originalName TEXT NOT NULL,
      filterUsed TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  return new Promise((resolve, reject) => {
    db.run(schemaSql, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports = {
  createDb,
  ensureSchema
};
