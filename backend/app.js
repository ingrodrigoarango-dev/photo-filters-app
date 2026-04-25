const express = require('express');
const cors = require('cors');

function makeApp({ imagesController, upload, uploadDir, corsOrigin = '*' }) {
  const app = express();

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());
  app.use('/uploads', express.static(uploadDir));

  app.post('/api/images', upload.single('image'), imagesController.postImage);
  app.get('/api/images', imagesController.getImages);

  return app;
}

module.exports = makeApp;
