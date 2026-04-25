function buildPublicUrl(req, filename) {
  const host = req.get('host');
  return `${req.protocol}://${host}/uploads/${filename}`;
}

function mapImagesWithUrls(req, rows) {
  return rows.map((img) => ({
    ...img,
    url: buildPublicUrl(req, img.filename)
  }));
}

function createImagesController({ imagesService, publicUrlBuilder = buildPublicUrl }) {
  return {
    postImage: async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
      }

      try {
        const createdImage = await imagesService.saveImage({
          filename: req.file.filename,
          originalName: req.file.originalname,
          filterUsed: req.body.filter || 'Ninguno'
        });

        return res.json({
          message: 'Imagen guardada correctamente',
          id: createdImage.id,
          url: publicUrlBuilder(req, createdImage.filename)
        });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    getImages: async (req, res) => {
      try {
        const rows = await imagesService.listImages();
        return res.json(mapImagesWithUrls(req, rows));
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  };
}

module.exports = {
  buildPublicUrl,
  mapImagesWithUrls,
  createImagesController
};
