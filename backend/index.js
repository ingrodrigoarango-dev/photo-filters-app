const makeApp = require('./app');
const { resolveRuntimeConfig } = require('./config/runtime');
const { createImagesController } = require('./http/imagesController');
const { createDb, ensureSchema } = require('./infra/db/sqlite');
const { createUploadMiddleware } = require('./infra/storage/uploads');
const { createImageRepository } = require('./repositories/imageRepository');
const { createImagesService } = require('./services/imagesService');

function resolveServerConfig(env = process.env) {
  return resolveRuntimeConfig(env).server;
}

async function createDefaultApp({ env = process.env, logger = console } = {}) {
  const config = resolveRuntimeConfig(env);
  const db = await createDb({ dbPath: config.paths.dbPath, logger });
  await ensureSchema(db);

  const repository = createImageRepository(db);
  const imagesService = createImagesService({ imageRepository: repository });
  const imagesController = createImagesController({ imagesService });
  const upload = createUploadMiddleware(config.paths.uploadDir);

  return makeApp({
    imagesController,
    upload,
    uploadDir: config.paths.uploadDir,
    corsOrigin: config.cors.origin
  });
}

async function startServer({ app, env = process.env, config = resolveServerConfig(env), logger = console } = {}) {
  const resolvedApp = app || await createDefaultApp({ env, logger });

  return resolvedApp.listen(config.port, config.host, () => {
    logger.log(`Backend server running on http://${config.host}:${config.port}`);
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start backend server:', err);
    process.exitCode = 1;
  });
}

module.exports = {
  createDefaultApp,
  resolveServerConfig,
  startServer
};
