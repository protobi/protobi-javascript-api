import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import {
  loadConfig,
  saveDefaultConfig,
  getDefaultConfigPath,
  hasDefaultConfig
} from '../../../lib/cli/config-loader.mjs';

describe('Config Loader', () => {
  let fsStub;
  let envBackup;

  beforeEach(() => {
    // Backup environment variables
    envBackup = { ...process.env };

    // Clear relevant env vars
    delete process.env.PROTOBI_API_KEY;
    delete process.env.PROTOBI_HOST;
    delete process.env.PROTOBI_DATASET_ID;
  });

  afterEach(() => {
    // Restore environment variables
    process.env = envBackup;

    // Restore stubs
    if (fsStub) {
      fsStub.restore();
    }
  });

  describe('getDefaultConfigPath', () => {
    it('should return path to ~/.protobi.json', () => {
      const configPath = getDefaultConfigPath();
      expect(configPath).to.equal(path.join(os.homedir(), '.protobi.json'));
    });
  });

  describe('loadConfig - cascade priority', () => {
    it('should return empty config when no config exists', () => {
      fsStub = sinon.stub(fs, 'existsSync').returns(false);

      const config = loadConfig();

      expect(config).to.be.an('object');
      expect(config.apiKey).to.be.undefined;
    });

    it('should load from default config file', () => {
      const mockConfig = {
        apiKey: 'file-api-key',
        host: 'file.example.com',
        datasetId: 'file-dataset-id'
      };

      fsStub = sinon.stub(fs, 'existsSync').returns(true);
      sinon.stub(fs, 'readJsonSync').returns(mockConfig);

      const config = loadConfig();

      expect(config.apiKey).to.equal('file-api-key');
      expect(config.host).to.equal('file.example.com');
      expect(config.datasetId).to.equal('file-dataset-id');

      fs.readJsonSync.restore();
    });

    it('should override default config with environment variables', () => {
      const mockConfig = {
        apiKey: 'file-api-key',
        host: 'file.example.com'
      };

      fsStub = sinon.stub(fs, 'existsSync').returns(true);
      sinon.stub(fs, 'readJsonSync').returns(mockConfig);

      process.env.PROTOBI_API_KEY = 'env-api-key';
      process.env.PROTOBI_HOST = 'env.example.com';

      const config = loadConfig();

      expect(config.apiKey).to.equal('env-api-key'); // env overrides file
      expect(config.host).to.equal('env.example.com'); // env overrides file

      fs.readJsonSync.restore();
    });

    it('should override environment with CLI options', () => {
      const mockConfig = {
        apiKey: 'file-api-key',
        host: 'file.example.com'
      };

      fsStub = sinon.stub(fs, 'existsSync').returns(true);
      sinon.stub(fs, 'readJsonSync').returns(mockConfig);

      process.env.PROTOBI_API_KEY = 'env-api-key';
      process.env.PROTOBI_HOST = 'env.example.com';

      const cliOptions = {
        apiKey: 'cli-api-key',
        host: 'cli.example.com'
      };

      const config = loadConfig(cliOptions);

      expect(config.apiKey).to.equal('cli-api-key'); // CLI overrides env
      expect(config.host).to.equal('cli.example.com'); // CLI overrides env

      fs.readJsonSync.restore();
    });

    it('should merge all sources correctly (cascade)', () => {
      const mockConfig = {
        apiKey: 'file-api-key',
        host: 'file.example.com',
        extra: 'from-file'
      };

      fsStub = sinon.stub(fs, 'existsSync').returns(true);
      sinon.stub(fs, 'readJsonSync').returns(mockConfig);

      process.env.PROTOBI_HOST = 'env.example.com';
      process.env.PROTOBI_DATASET_ID = 'env-dataset-id';

      const cliOptions = {
        datasetId: 'cli-dataset-id',
        table: 'cli-table'
      };

      const config = loadConfig(cliOptions);

      expect(config.apiKey).to.equal('file-api-key'); // from file (not overridden)
      expect(config.host).to.equal('env.example.com'); // from env (overrides file)
      expect(config.datasetId).to.equal('cli-dataset-id'); // from CLI (overrides env)
      expect(config.table).to.equal('cli-table'); // from CLI (only source)
      expect(config.extra).to.equal('from-file'); // from file (not overridden)

      fs.readJsonSync.restore();
    });

    it('should remove undefined values', () => {
      fsStub = sinon.stub(fs, 'existsSync').returns(false);

      const cliOptions = {
        apiKey: 'test-key',
        host: undefined,
        datasetId: null
      };

      const config = loadConfig(cliOptions);

      expect(config.apiKey).to.equal('test-key');
      expect(config).to.not.have.property('host');
      expect(config.datasetId).to.equal(null); // null is kept, undefined is removed
    });

    it('should load custom config file when specified', () => {
      const mockDefaultConfig = { apiKey: 'default-key' };
      const mockCustomConfig = { apiKey: 'custom-key', host: 'custom.com' };

      fsStub = sinon.stub(fs, 'existsSync').returns(true);
      const readStub = sinon.stub(fs, 'readJsonSync');
      readStub.onFirstCall().returns(mockDefaultConfig); // default config
      readStub.onSecondCall().returns(mockCustomConfig); // custom config

      const config = loadConfig({ config: '/path/to/custom.json' });

      expect(config.apiKey).to.equal('custom-key'); // custom overrides default
      expect(config.host).to.equal('custom.com');

      fs.readJsonSync.restore();
    });
  });

  describe('saveDefaultConfig', () => {
    it('should save config to default path', () => {
      const writeStub = sinon.stub(fs, 'writeJsonSync');

      const config = { apiKey: 'test-key', host: 'test.com' };
      const result = saveDefaultConfig(config);

      expect(result).to.be.true;
      expect(writeStub.calledOnce).to.be.true;
      expect(writeStub.firstCall.args[0]).to.equal(getDefaultConfigPath());
      expect(writeStub.firstCall.args[1]).to.deep.equal(config);

      writeStub.restore();
    });

    it('should return false on error', () => {
      const writeStub = sinon.stub(fs, 'writeJsonSync').throws(new Error('Write failed'));

      const config = { apiKey: 'test-key' };
      const result = saveDefaultConfig(config);

      expect(result).to.be.false;

      writeStub.restore();
    });
  });

  describe('hasDefaultConfig', () => {
    it('should return true when config file exists', () => {
      fsStub = sinon.stub(fs, 'existsSync').returns(true);

      expect(hasDefaultConfig()).to.be.true;
    });

    it('should return false when config file does not exist', () => {
      fsStub = sinon.stub(fs, 'existsSync').returns(false);

      expect(hasDefaultConfig()).to.be.false;
    });
  });
});
