const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildPublicUrl,
  mapImagesWithUrls,
  createImagesController
} = require('../http/imagesController');

function createResponseStub() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

function createRequestStub(overrides = {}) {
  return {
    protocol: 'http',
    body: {},
    get(header) {
      return header === 'host' ? '127.0.0.1:3002' : undefined;
    },
    ...overrides
  };
}

test('buildPublicUrl builds a public uploads URL from the request', () => {
  const req = createRequestStub();

  assert.equal(buildPublicUrl(req, 'image.png'), 'http://127.0.0.1:3002/uploads/image.png');
});

test('mapImagesWithUrls adds a public URL to every image row', () => {
  const req = createRequestStub();
  const rows = [
    { id: 1, filename: 'first.png', originalName: 'first.png', filterUsed: 'Vintage' },
    { id: 2, filename: 'second.png', originalName: 'second.png', filterUsed: 'Cool' }
  ];

  assert.deepEqual(mapImagesWithUrls(req, rows), [
    {
      id: 1,
      filename: 'first.png',
      originalName: 'first.png',
      filterUsed: 'Vintage',
      url: 'http://127.0.0.1:3002/uploads/first.png'
    },
    {
      id: 2,
      filename: 'second.png',
      originalName: 'second.png',
      filterUsed: 'Cool',
      url: 'http://127.0.0.1:3002/uploads/second.png'
    }
  ]);
});

test('postImage returns 400 when no image is sent', async () => {
  const controller = createImagesController({
    imagesService: {
      saveImage: async () => {
        throw new Error('should not be called');
      }
    }
  });
  const req = createRequestStub({ body: { filter: 'Vintage' } });
  const res = createResponseStub();

  await controller.postImage(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'No se subió ninguna imagen' });
});

test('postImage stores the image and returns the public URL', async () => {
  let receivedImage = null;
  const controller = createImagesController({
    imagesService: {
      saveImage: async (image) => {
        receivedImage = image;
        return { id: 42, ...image };
      }
    }
  });
  const req = createRequestStub({
    body: { filter: 'Vintage' },
    file: {
      filename: 'stored.png',
      originalname: 'photo.png'
    }
  });
  const res = createResponseStub();

  await controller.postImage(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(receivedImage, {
    filename: 'stored.png',
    originalName: 'photo.png',
    filterUsed: 'Vintage'
  });
  assert.deepEqual(res.body, {
    message: 'Imagen guardada correctamente',
    id: 42,
    url: 'http://127.0.0.1:3002/uploads/stored.png'
  });
});

test('postImage returns 500 when the service fails', async () => {
  const controller = createImagesController({
    imagesService: {
      saveImage: async () => {
        throw new Error('insert failed');
      }
    }
  });
  const req = createRequestStub({
    file: {
      filename: 'stored.png',
      originalname: 'photo.png'
    }
  });
  const res = createResponseStub();

  await controller.postImage(req, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { error: 'insert failed' });
});

test('getImages returns the mapped URLs', async () => {
  const controller = createImagesController({
    imagesService: {
      listImages: async () => ([
        { id: 1, filename: 'first.png', originalName: 'first.png', filterUsed: 'Vintage' },
        { id: 2, filename: 'second.png', originalName: 'second.png', filterUsed: 'Cool' }
      ])
    }
  });
  const req = createRequestStub();
  const res = createResponseStub();

  await controller.getImages(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, [
    {
      id: 1,
      filename: 'first.png',
      originalName: 'first.png',
      filterUsed: 'Vintage',
      url: 'http://127.0.0.1:3002/uploads/first.png'
    },
    {
      id: 2,
      filename: 'second.png',
      originalName: 'second.png',
      filterUsed: 'Cool',
      url: 'http://127.0.0.1:3002/uploads/second.png'
    }
  ]);
});

test('getImages returns 500 when the service fails', async () => {
  const controller = createImagesController({
    imagesService: {
      listImages: async () => {
        throw new Error('query failed');
      }
    }
  });
  const req = createRequestStub();
  const res = createResponseStub();

  await controller.getImages(req, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { error: 'query failed' });
});
