function createImagesService({ imageRepository }) {
  return {
    async saveImage({ filename, originalName, filterUsed = 'Ninguno' }) {
      return imageRepository.createImage({
        filename,
        originalName,
        filterUsed
      });
    },

    async listImages() {
      return imageRepository.listImages();
    }
  };
}

module.exports = {
  createImagesService
};
