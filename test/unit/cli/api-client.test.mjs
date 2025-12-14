import { expect } from 'chai';
import sinon from 'sinon';
import {
  ProtobiAPIClient,
  createApiClient
} from '../../../lib/cli/api-client.mjs';

describe('API Client', () => {
  let fetchStub;
  let client;

  beforeEach(() => {
    client = new ProtobiAPIClient('https://app.protobi.com', 'test-api-key');
  });

  afterEach(() => {
    if (fetchStub) {
      fetchStub.restore();
    }
  });

  describe('constructor', () => {
    it('should create client with default URL', () => {
      const defaultClient = new ProtobiAPIClient(null, 'test-key');
      expect(defaultClient.apiUrl).to.equal('https://app.protobi.com');
      expect(defaultClient.apiKey).to.equal('test-key');
    });

    it('should create client with custom URL', () => {
      const customClient = new ProtobiAPIClient('https://custom.com', 'test-key');
      expect(customClient.apiUrl).to.equal('https://custom.com');
    });

    it('should remove trailing slash from URL', () => {
      const client = new ProtobiAPIClient('https://app.protobi.com/', 'test-key');
      expect(client.apiUrl).to.equal('https://app.protobi.com');
    });
  });

  describe('buildUrl', () => {
    it('should build URL with API key parameter', () => {
      const url = client.buildUrl('/api/v3/test');
      expect(url).to.include('https://app.protobi.com/api/v3/test');
      expect(url).to.include('apiKey=test-api-key');
    });

    it('should handle absolute paths', () => {
      const url = client.buildUrl('/v3/datasets/123/element');
      expect(url).to.include('/v3/datasets/123/element');
      expect(url).to.include('apiKey=test-api-key');
    });
  });

  describe('handleResponse', () => {
    it('should parse JSON response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ data: 'test' })
      };

      const result = await client.handleResponse(mockResponse);
      expect(result).to.deep.equal({ data: 'test' });
    });

    it('should return text for non-JSON response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/csv']]),
        text: async () => 'csv,data\n1,2'
      };

      const result = await client.handleResponse(mockResponse);
      expect(result).to.equal('csv,data\n1,2');
    });

    it('should throw auth error for 401', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      };

      try {
        await client.handleResponse(mockResponse);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.message).to.include('Authentication failed');
      }
    });

    it('should throw auth error for 403', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      };

      try {
        await client.handleResponse(mockResponse);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.message).to.include('Authentication failed');
      }
    });

    it('should throw not found error for 404', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };

      try {
        await client.handleResponse(mockResponse);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.message).to.include('Resource not found');
      }
    });

    it('should throw generic error for other status codes', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error'
      };

      try {
        await client.handleResponse(mockResponse);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.message).to.include('HTTP 500');
      }
    });
  });

  describe('uploadElements', () => {
    it('should POST elements to correct endpoint', async () => {
      const elements = [{ id: '1', name: 'Test' }];
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true })
      };

      fetchStub = sinon.stub(global, 'fetch').resolves(mockResponse);

      const result = await client.uploadElements(elements, 'dataset-123');

      expect(fetchStub.calledOnce).to.be.true;
      const [url, options] = fetchStub.firstCall.args;

      expect(url).to.include('/api/v3/dataset/dataset-123/element');
      expect(url).to.include('apiKey=test-api-key');
      expect(options.method).to.equal('POST');
      expect(options.headers['Content-Type']).to.equal('application/json');
      expect(JSON.parse(options.body)).to.deep.equal(elements);
      expect(result).to.deep.equal({ success: true });
    });
  });

  describe('getElements', () => {
    it('should GET elements from correct endpoint', async () => {
      const mockElements = [{ id: '1', name: 'Test' }];
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockElements
      };

      fetchStub = sinon.stub(global, 'fetch').resolves(mockResponse);

      const result = await client.getElements('dataset-123');

      expect(fetchStub.calledOnce).to.be.true;
      const [url, options] = fetchStub.firstCall.args;

      expect(url).to.include('/v3/datasets/dataset-123/element');
      expect(url).to.include('apiKey=test-api-key');
      expect(options.method).to.equal('GET');
      expect(result).to.deep.equal(mockElements);
    });
  });

  describe('uploadCsv', () => {
    it('should POST CSV as FormData', async () => {
      const csv = 'name,value\ntest,123';
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ rowsUploaded: 1 })
      };

      fetchStub = sinon.stub(global, 'fetch').resolves(mockResponse);

      const result = await client.uploadCsv(csv, 'dataset-123', 'main', 'data.csv');

      expect(fetchStub.calledOnce).to.be.true;
      const [url, options] = fetchStub.firstCall.args;

      expect(url).to.include('/api/v3/dataset/dataset-123/data/main');
      expect(url).to.include('apiKey=test-api-key');
      expect(options.method).to.equal('POST');
      expect(options.body).to.be.instanceof(FormData);
      expect(result).to.deep.equal({ rowsUploaded: 1 });
    });
  });

  describe('accumulateKeys', () => {
    it('should return all unique keys from array of objects', () => {
      const rows = [
        { a: 1, b: 2 },
        { b: 3, c: 4 },
        { a: 5, c: 6, d: 7 }
      ];

      const keys = client.accumulateKeys(rows);

      expect(keys).to.have.members(['a', 'b', 'c', 'd']);
      expect(keys).to.have.lengthOf(4);
    });

    it('should handle empty array', () => {
      const keys = client.accumulateKeys([]);
      expect(keys).to.be.an('array').that.is.empty;
    });

    it('should handle array with single object', () => {
      const keys = client.accumulateKeys([{ x: 1, y: 2 }]);
      expect(keys).to.have.members(['x', 'y']);
    });
  });

  describe('createApiClient', () => {
    it('should create client from config', () => {
      const config = {
        host: 'custom.protobi.com',
        apiKey: 'config-api-key'
      };

      const client = createApiClient(config);

      expect(client).to.be.instanceof(ProtobiAPIClient);
      expect(client.apiUrl).to.equal('https://custom.protobi.com');
      expect(client.apiKey).to.equal('config-api-key');
    });

    it('should use default host if not provided', () => {
      const config = {
        apiKey: 'test-key'
      };

      const client = createApiClient(config);

      expect(client.apiUrl).to.equal('https://app.protobi.com');
    });

    it('should throw auth error if API key missing', () => {
      const config = {};

      expect(() => {
        createApiClient(config);
      }).to.throw(/API key is required/);
    });
  });
});
