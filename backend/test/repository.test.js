const test = require('node:test');
const assert = require('node:assert/strict');

const { createImageRepository } = require('../repositories/imageRepository');

function createDbStub() {
  return {
    runCalls: [],
    allCalls: [],
    run(sql, params, callback) {
      this.runCalls.push({ sql, params });
      callback.call({ lastID: 7 }, null);
    },
    all(sql, params, callback) {
      this.allCalls.push({ sql, params });
      callback(null, [
        { id: 7, filename: 'image.png', originalName: 'image.png', filterUsed: 'Vintage' }
      ]);
    }
  };
}

test('createImageRepository.createImage inserts a row and resolves the created image', async () => {
  const db = createDbStub();
  const repository = createImageRepository(db);

  const created = await repository.createImage({
    filename: '123.png',
    originalName: 'photo.png',
    filterUsed: 'Vintage'
  });

  assert.deepEqual(db.runCalls, [
    {
      sql: 'INSERT INTO images (filename, originalName, filterUsed) VALUES (?, ?, ?)',
      params: ['123.png', 'photo.png', 'Vintage']
    }
  ]);
  assert.deepEqual(created, {
    id: 7,
    filename: '123.png',
    originalName: 'photo.png',
    filterUsed: 'Vintage'
  });
});

test('createImageRepository.createImage rejects on insert error', async () => {
  const repository = createImageRepository({
    run(_sql, _params, callback) {
      callback(new Error('insert failed'));
    }
  });

  await assert.rejects(
    repository.createImage({
      filename: '123.png',
      originalName: 'photo.png',
      filterUsed: 'Vintage'
    }),
    /insert failed/
  );
});

test('createImageRepository.listImages resolves the rows returned by SQLite', async () => {
  const db = createDbStub();
  const repository = createImageRepository(db);

  const rows = await repository.listImages();

  assert.deepEqual(db.allCalls, [
    {
      sql: 'SELECT * FROM images ORDER BY createdAt DESC',
      params: []
    }
  ]);
  assert.deepEqual(rows, [
    { id: 7, filename: 'image.png', originalName: 'image.png', filterUsed: 'Vintage' }
  ]);
});

test('createImageRepository.listImages rejects on query error', async () => {
  const repository = createImageRepository({
    all(_sql, _params, callback) {
      callback(new Error('query failed'));
    }
  });

  await assert.rejects(repository.listImages(), /query failed/);
});
