const path = require('path');

const DEFAULT_PORT = 3002;
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_CORS_ORIGIN = '*';

function resolveRuntimeConfig(env = process.env) {
  const rootDir = path.resolve(__dirname, '..');
  const port = Number(env.PORT || DEFAULT_PORT);

  return {
    server: {
      port: Number.isFinite(port) ? port : DEFAULT_PORT,
      host: env.HOST || DEFAULT_HOST
    },
    paths: {
      dbPath: path.resolve(env.DB_PATH || path.join(rootDir, 'database.sqlite')),
      uploadDir: path.resolve(env.UPLOAD_DIR || path.join(rootDir, 'uploads'))
    },
    cors: {
      origin: env.CORS_ORIGIN || DEFAULT_CORS_ORIGIN
    }
  };
}

module.exports = {
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_CORS_ORIGIN,
  resolveRuntimeConfig
};
