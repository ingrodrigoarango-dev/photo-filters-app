const test = require('node:test');
const assert = require('node:assert/strict');

const { createImagesService } = require('../services/imagesService');

test('saveImage delegates to the repository and defaults the filter', async () => {
  let receivedPayload = null;
  const service = createImagesService({
    imageRepository: {
      async createImage(payload) {
        receivedPayload = payload;
        return { id: 9, ...payload };
      }
    }
  });

  const created = await service.saveImage({
    filename: 'stored.png',
    originalName: 'photo.png'
  });

  assert.deepEqual(receivedPayload, {
    filename: 'stored.png',
    originalName: 'photo.png',
    filterUsed: 'Ninguno'
  });
  assert.deepEqual(created, {
    id: 9,
    filename: 'stored.png',
    originalName: 'photo.png',
    filterUsed: 'Ninguno'
  });
});

test('listImages delegates to the repository', async () => {
  const expectedRows = [
    { id: 1, filename: 'one.png', originalName: 'one.png', filterUsed: 'Vintage' }
  ];
  const service = createImagesService({
    imageRepository: {
      async listImages() {
        return expectedRows;
      }
    }
  });

  const rows = await service.listImages();

  assert.deepEqual(rows, expectedRows);
});
