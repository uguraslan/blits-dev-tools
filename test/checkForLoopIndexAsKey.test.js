const { setupVSCodeMock, MockDocument } = require('./test-helpers');
setupVSCodeMock();
const rewire = require('rewire');
const { expect } = require('chai');

const mod = rewire('../src/errorChecking/checkForLoopIndexAsKey.js');
const keyUsesIndex = mod.__get__('keyUsesIndex');
const findForLoops = mod.__get__('findForLoops');

describe('checkForLoopIndexAsKey helpers', () => {
  it('detects index usage', () => {
    expect(keyUsesIndex('$i', 'i')).to.be.true;
    expect(keyUsesIndex('$j', 'i')).to.be.false;
  });

  it('finds loops and key attributes', () => {
    const text = '<Element :for="(item,i) in list" key="$i">';
    const doc = new MockDocument(text);
    const loops = findForLoops({ content: text, start: 0 }, doc);
    expect(loops[0].keyAttribute).to.equal('$i');
  });
});
