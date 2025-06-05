const { setupVSCodeMock } = require('./test-helpers');
setupVSCodeMock();
const { expect } = require('chai');
const path = require('path');
const vdocs = require('../src/blitsFile/virtualDocuments');

describe('virtualDocuments', () => {
  it('adds and retrieves virtual files', () => {
    vdocs.addVirtualFile('/a/test.blits', 'content', 1);
    const file = vdocs.getVirtualFile('/a/test.blits');
    expect(file.content).to.equal('content');
    expect(vdocs.getAllVirtualFiles().has('/a/test.blits')).to.be.true;
    vdocs.deleteVirtualFilesByUri({ fsPath: path.dirname('/a/test.blits') });
    expect(vdocs.getVirtualFile('/a/test.blits')).to.equal(undefined);
  });
});
