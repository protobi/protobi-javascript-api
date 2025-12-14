import { expect } from 'chai';
import sinon from 'sinon';
import {
  EXIT_CODES,
  CLIError,
  validateRequired,
  authError,
  notFoundError,
  invalidArgumentsError
} from '../../../lib/cli/utils/errors.mjs';

describe('Error Handling', () => {
  describe('EXIT_CODES', () => {
    it('should have correct exit codes defined', () => {
      expect(EXIT_CODES.SUCCESS).to.equal(0);
      expect(EXIT_CODES.GENERAL_ERROR).to.equal(1);
      expect(EXIT_CODES.INVALID_ARGUMENTS).to.equal(2);
      expect(EXIT_CODES.AUTH_ERROR).to.equal(3);
      expect(EXIT_CODES.NOT_FOUND).to.equal(4);
    });
  });

  describe('CLIError', () => {
    it('should create error with default exit code', () => {
      const error = new CLIError('Test error');

      expect(error).to.be.instanceof(Error);
      expect(error.message).to.equal('Test error');
      expect(error.exitCode).to.equal(EXIT_CODES.GENERAL_ERROR);
      expect(error.name).to.equal('CLIError');
    });

    it('should create error with custom exit code', () => {
      const error = new CLIError('Auth failed', EXIT_CODES.AUTH_ERROR);

      expect(error.message).to.equal('Auth failed');
      expect(error.exitCode).to.equal(EXIT_CODES.AUTH_ERROR);
    });
  });

  describe('validateRequired', () => {
    it('should not throw when all required options are present', () => {
      const options = {
        apiKey: 'test-key',
        datasetId: 'test-id',
        table: 'main'
      };

      expect(() => {
        validateRequired(options, ['apiKey', 'datasetId', 'table']);
      }).to.not.throw();
    });

    it('should throw CLIError when single required option is missing', () => {
      const options = {
        datasetId: 'test-id',
        table: 'main'
      };

      expect(() => {
        validateRequired(options, ['apiKey', 'datasetId', 'table']);
      }).to.throw(CLIError)
        .with.property('message')
        .that.includes('Missing required option: --apiKey');
    });

    it('should throw CLIError when multiple required options are missing', () => {
      const options = {
        table: 'main'
      };

      expect(() => {
        validateRequired(options, ['apiKey', 'datasetId', 'table']);
      }).to.throw(CLIError)
        .with.property('message')
        .that.includes('Missing required options: --apiKey, --datasetId');
    });

    it('should throw with correct exit code', () => {
      const options = { table: 'main' };

      try {
        validateRequired(options, ['apiKey', 'datasetId']);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).to.be.instanceof(CLIError);
        expect(error.exitCode).to.equal(EXIT_CODES.INVALID_ARGUMENTS);
      }
    });

    it('should handle empty required array', () => {
      const options = { foo: 'bar' };

      expect(() => {
        validateRequired(options, []);
      }).to.not.throw();
    });

    it('should treat falsy values as missing', () => {
      const options = {
        apiKey: '',
        datasetId: null,
        table: undefined
      };

      expect(() => {
        validateRequired(options, ['apiKey', 'datasetId', 'table']);
      }).to.throw(CLIError)
        .with.property('message')
        .that.includes('Missing required options');
    });

    it('should accept zero and false as valid values', () => {
      const options = {
        count: 0,
        flag: false,
        name: 'test'
      };

      // Zero and false should be considered valid (not missing)
      expect(() => {
        validateRequired(options, ['count', 'flag', 'name']);
      }).to.not.throw();
    });
  });

  describe('authError', () => {
    it('should create auth error with default message', () => {
      const error = authError();

      expect(error).to.be.instanceof(CLIError);
      expect(error.message).to.include('Authentication failed');
      expect(error.exitCode).to.equal(EXIT_CODES.AUTH_ERROR);
    });

    it('should create auth error with custom message', () => {
      const error = authError('Invalid API key format');

      expect(error.message).to.equal('Invalid API key format');
      expect(error.exitCode).to.equal(EXIT_CODES.AUTH_ERROR);
    });
  });

  describe('notFoundError', () => {
    it('should create not found error', () => {
      const error = notFoundError('dataset/12345');

      expect(error).to.be.instanceof(CLIError);
      expect(error.message).to.equal('Not found: dataset/12345');
      expect(error.exitCode).to.equal(EXIT_CODES.NOT_FOUND);
    });
  });

  describe('invalidArgumentsError', () => {
    it('should create invalid arguments error', () => {
      const error = invalidArgumentsError('Table name contains invalid characters');

      expect(error).to.be.instanceof(CLIError);
      expect(error.message).to.equal('Table name contains invalid characters');
      expect(error.exitCode).to.equal(EXIT_CODES.INVALID_ARGUMENTS);
    });
  });
});
