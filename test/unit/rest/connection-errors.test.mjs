import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const clientUrl = new URL('../../../js/protobi-rest-api.js', import.meta.url);
const source = readFileSync(clientUrl, 'utf8');
const require = createRequire(clientUrl);

function clientWithFetch(fetch) {
  const sandbox = {
    module: { exports: {} }, URL, console, setTimeout,
    require: name => name === 'node-fetch' ? fetch : require(name)
  };
  vm.runInNewContext(source, sandbox);
  return new sandbox.module.exports('https://localhost:5000', 'secret-key');
}

async function rejection(promise) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('Expected rejection');
}

describe('REST client connection errors', function () {
  it('explains a refused connection even when fetch provides no reason', async function () {
    const original = Object.assign(new Error(
      'request to https://localhost:5000/api/v3/dataset/id?apiKey=secret-key failed, reason: '
    ), { type: 'system', code: 'ECONNREFUSED', errno: 'ECONNREFUSED' });
    const client = clientWithFetch(async () => { throw original; });
    const error = await rejection(client.updateDataset('id', {}));
    expect(error.message).to.include('Unable to connect to server https://localhost:5000');
    expect(error.message).to.include('[ECONNREFUSED]');
    expect(error.message).to.include('Check that the server is running');
    expect(error.stack).not.to.include('secret-key');
    expect(error.code).to.equal('ECONNREFUSED');
  });

  it('reports transport failures through the callback API too', async function () {
    const client = clientWithFetch(async () => {
      throw Object.assign(new Error(''), { type: 'system', code: 'ENOTFOUND' });
    });
    const error = await new Promise(resolve => client.getDataset('id', err => resolve(err)));
    expect(error.message).to.include('Server hostname could not be resolved');
  });

  it('provides a useful message for request timeouts without a code', async function () {
    const client = clientWithFetch(async () => {
      throw Object.assign(new Error(''), { type: 'request-timeout' });
    });
    expect((await rejection(client.getDataset('id'))).message).to.include('Connection timed out');
  });

  it('does not label HTTP failures as connection failures', async function () {
    const client = clientWithFetch(async () => ({
      ok: false, status: 403, text: async () => 'Forbidden'
    }));
    expect((await rejection(client.updateDataset('id', {}))).message).to.equal('HTTP 403: Forbidden');
  });

  it('preserves other fetch errors', async function () {
    const original = new TypeError('Invalid request');
    const client = clientWithFetch(async () => { throw original; });
    expect(await rejection(client.getDataset('id'))).to.equal(original);
  });
});
