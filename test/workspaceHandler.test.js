const { setupVSCodeMock } = require('./test-helpers');
const { vscode } = setupVSCodeMock();
const fs = require('fs');
const path = require('path');
const os = require('os');
const rewire = require('rewire');
const { expect } = require('chai');

const mod = rewire('../src/core/workspaceHandler.js');
const hasBlitsDependency = mod.__get__('hasBlitsDependency');

describe('workspaceHandler', () => {
  it('detects blits dependency', () => {
    expect(hasBlitsDependency({ dependencies: { '@lightningjs/blits': '1' } })).to.be.true;
    expect(hasBlitsDependency({ devDependencies: { '@lightningjs/blits': '2' } })).to.be.true;
    expect(hasBlitsDependency({})).to.be.false;
  });

  it('loads framework attributes from workspace', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'blits-'));
    const attrDir = path.join(tmp, 'node_modules', '@lightningjs', 'blits', 'vscode', 'data');
    fs.mkdirSync(attrDir, { recursive: true });
    fs.writeFileSync(path.join(attrDir, 'template-attributes.json'), '{"foo": {"usedIn": ["Element"], "attrType": "regular", "types": ["string"]}}');
    vscode.workspace.workspaceFolders = [{ uri: { fsPath: tmp } }];

    const attrs = mod.getFrameworkAttributes();
    expect(attrs).to.have.property('foo');
  });
});
