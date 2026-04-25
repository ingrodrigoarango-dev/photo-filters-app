function createImageRepository(db) {
  return {
    createImage({ filename, originalName, filterUsed }) {
      const sql = 'INSERT INTO images (filename, originalName, filterUsed) VALUES (?, ?, ?)';

      return new Promise((resolve, reject) => {
        db.run(sql, [filename, originalName, filterUsed], function(err) {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            id: this.lastID,
            filename,
            originalName,
            filterUsed
          });
        });
      });
    },

    listImages() {
      const sql = 'SELECT * FROM images ORDER BY createdAt DESC';

      return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(rows);
        });
      });
    }
  };
}

module.exports = { createImageRepository };
