import { expect } from 'chai';
import {
  isValidApiKey,
  isValidDatasetId,
  isValidHost,
  isValidEmail,
  isValidTableName,
  sanitizeFilename
} from '../../../lib/cli/utils/validators.mjs';

describe('Validators', () => {
  describe('isValidApiKey', () => {
    it('should return true for valid API keys (>10 chars)', () => {
      expect(isValidApiKey('abc123def456')).to.be.true;
      expect(isValidApiKey('a'.repeat(11))).to.be.true;
    });

    it('should return false for short API keys', () => {
      expect(isValidApiKey('short')).to.be.false;
      expect(isValidApiKey('a'.repeat(10))).to.be.false;
    });

    it('should return false for non-strings', () => {
      expect(isValidApiKey(null)).to.be.false;
      expect(isValidApiKey(undefined)).to.be.false;
      expect(isValidApiKey(123456789012)).to.be.false;
    });
  });

  describe('isValidDatasetId', () => {
    it('should return true for valid MongoDB ObjectId (24 hex chars)', () => {
      expect(isValidDatasetId('507f1f77bcf86cd799439011')).to.be.true;
      expect(isValidDatasetId('6744814e48513c0002f3d9d3')).to.be.true;
      expect(isValidDatasetId('ABCDEF1234567890abcdef12')).to.be.true;
    });

    it('should return false for invalid dataset IDs', () => {
      expect(isValidDatasetId('too-short')).to.be.false;
      expect(isValidDatasetId('way-too-long-not-24-characters')).to.be.false;
      expect(isValidDatasetId('not-hex-chars-!!!!!!!!!')).to.be.false;
    });

    it('should return false for non-strings', () => {
      expect(isValidDatasetId(null)).to.be.false;
      expect(isValidDatasetId(undefined)).to.be.false;
    });
  });

  describe('isValidHost', () => {
    it('should return true for valid hostnames', () => {
      expect(isValidHost('app.protobi.com')).to.be.true;
      expect(isValidHost('localhost')).to.be.true;
      expect(isValidHost('example.com')).to.be.true;
    });

    it('should return false for hosts with protocol', () => {
      expect(isValidHost('https://app.protobi.com')).to.be.false;
      expect(isValidHost('http://localhost')).to.be.false;
    });

    it('should return false for empty strings', () => {
      expect(isValidHost('')).to.be.false;
    });

    it('should return false for non-strings', () => {
      expect(isValidHost(null)).to.be.false;
      expect(isValidHost(undefined)).to.be.false;
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('user@example.com')).to.be.true;
      expect(isValidEmail('test.user@domain.co.uk')).to.be.true;
      expect(isValidEmail('name+tag@company.com')).to.be.true;
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('not-an-email')).to.be.false;
      expect(isValidEmail('@example.com')).to.be.false;
      expect(isValidEmail('user@')).to.be.false;
      expect(isValidEmail('user@domain')).to.be.false;
    });

    it('should return false for non-strings', () => {
      expect(isValidEmail(null)).to.be.false;
      expect(isValidEmail(undefined)).to.be.false;
    });
  });

  describe('isValidTableName', () => {
    it('should return true for valid table names', () => {
      expect(isValidTableName('main')).to.be.true;
      expect(isValidTableName('table_name')).to.be.true;
      expect(isValidTableName('table-name')).to.be.true;
      expect(isValidTableName('Table123')).to.be.true;
    });

    it('should return false for invalid table names', () => {
      expect(isValidTableName('')).to.be.false;
      expect(isValidTableName('table name')).to.be.false; // spaces
      expect(isValidTableName('table/name')).to.be.false; // slash
      expect(isValidTableName('table@name')).to.be.false; // special chars
    });

    it('should return false for non-strings', () => {
      expect(isValidTableName(null)).to.be.false;
      expect(isValidTableName(undefined)).to.be.false;
    });
  });

  describe('sanitizeFilename', () => {
    it('should keep valid filename characters', () => {
      expect(sanitizeFilename('file.csv')).to.equal('file.csv');
      expect(sanitizeFilename('data-2024.json')).to.equal('data-2024.json');
      expect(sanitizeFilename('file_name_123.txt')).to.equal('file_name_123.txt');
    });

    it('should replace invalid characters with underscores', () => {
      expect(sanitizeFilename('file/name.csv')).to.equal('file_name.csv');
      expect(sanitizeFilename('file:name.csv')).to.equal('file_name.csv');
      expect(sanitizeFilename('file<>name.csv')).to.equal('file__name.csv');
      expect(sanitizeFilename('file*?name.csv')).to.equal('file__name.csv');
    });

    it('should handle multiple invalid characters', () => {
      expect(sanitizeFilename('bad/file\\name:here*.csv')).to.equal('bad_file_name_here_.csv');
    });
  });
});
