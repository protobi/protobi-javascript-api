import { expect } from 'chai';

import {
  hasFileData,
  hasOriginalSourceFile,
  isNotFoundError
} from '../../../tools/clone-project.mjs';

describe('clone-project table data', function () {
  it('does not upload a zero-byte file', function () {
    expect(hasFileData(Buffer.alloc(0))).to.equal(false);
  });

  it('uploads a file when it contains data', function () {
    expect(hasFileData(Buffer.from('id\n1\n'))).to.equal(true);
  });

  it('does not upload missing file data', function () {
    expect(hasFileData(undefined)).to.equal(false);
  });

  it('recognizes missing downloads without hiding other errors', function () {
    expect(isNotFoundError(Object.assign(new Error('missing'), { status: 404 }))).to.equal(true);
    expect(isNotFoundError(new Error('HTTP 404: Not Found'))).to.equal(true);
    expect(isNotFoundError(new Error('HTTP 500: Failed'))).to.equal(false);
  });

  it('downloads a process result as processed CSV even when s3path exists', function () {
    expect(hasOriginalSourceFile({ type: 'process', s3path: 'raw/script.js' })).to.equal(false);
  });

  it('preserves original-file cloning for ordinary data tables', function () {
    expect(hasOriginalSourceFile({ type: 'data', s3path: 'raw/data.sav' })).to.equal(true);
  });
});
