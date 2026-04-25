const fs = require('fs');
const multer = require('multer');
const path = require('path');

function ensureUploadDir(uploadDir) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function createUploadMiddleware(uploadDir) {
  ensureUploadDir(uploadDir);

  const storage = multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, uploadDir);
    },
    filename(_req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  return multer({ storage });
}

module.exports = {
  ensureUploadDir,
  createUploadMiddleware
};
