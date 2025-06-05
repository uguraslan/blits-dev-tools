const { setupVSCodeMock } = require('./test-helpers');
setupVSCodeMock();
const rewire = require('rewire');
const { expect } = require('chai');

const mod = rewire('../src/commands/commentCommand.js');
const isLineCommented = mod.__get__('isLineCommented');

describe('commentCommand helpers', () => {
  it('detects commented lines', () => {
    expect(isLineCommented('<!-- test -->')).to.be.true;
    expect(isLineCommented('not commented')).to.be.false;
  });
});
