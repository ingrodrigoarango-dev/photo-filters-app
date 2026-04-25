const test = require('node:test');
const assert = require('node:assert/strict');

const { resolveServerConfig, startServer } = require('../index');
const { DEFAULT_HOST, DEFAULT_PORT } = require('../config/runtime');

test('resolveServerConfig uses the defaults when env vars are missing', () => {
  assert.deepEqual(resolveServerConfig({}), {
    port: DEFAULT_PORT,
    host: DEFAULT_HOST
  });
});

test('resolveServerConfig honors PORT and HOST', () => {
  assert.deepEqual(resolveServerConfig({
    PORT: '4567',
    HOST: '0.0.0.0'
  }), {
    port: 4567,
    host: '0.0.0.0'
  });
});

test('startServer wires listen with the resolved configuration', async () => {
  let listenArgs = null;
  let logMessage = null;
  const app = {
    listen(port, host, callback) {
      listenArgs = { port, host };
      callback();
      return { close() {} };
    }
  };

  const server = await startServer({
    app,
    config: { port: 8080, host: '127.0.0.1' },
    logger: {
      log(message) {
        logMessage = message;
      }
    }
  });

  assert.deepEqual(listenArgs, { port: 8080, host: '127.0.0.1' });
  assert.ok(server);
  assert.equal(logMessage, 'Backend server running on http://127.0.0.1:8080');
});
