const { setupVSCodeMock, MockDocument, Range } = require('./test-helpers');
setupVSCodeMock();
const rewire = require('rewire');
const { expect } = require('chai');

const mod = rewire('../src/formatters/templateFormatterOnSave.js');
const modifyComments = mod.__get__('modifyComments');
const getTrailingWhiteSpace = mod.__get__('getTrailingWhiteSpace');
const formatTemplate = mod.__get__('formatTemplate');
const createEdit = mod.__get__('createEdit');

describe('template formatter helpers', () => {
  it('modifies multi line comments correctly', () => {
    const result = modifyComments('<!--a\nline\n-->');
    expect(result).to.include('line');
    expect(result.split('\n')[1].startsWith('  ')).to.be.true;
  });

  it('detects trailing newline', () => {
    expect(getTrailingWhiteSpace('abc\n')).to.equal('\n  ');
    expect(getTrailingWhiteSpace('abc')).to.equal('');
  });

  it('formats template and creates edit', () => {
    const formatted = formatTemplate('<div>1</div>', 'angular');
    expect(formatted).to.include('<div>1</div>');
    const doc = new MockDocument('abc');
    const edit = createEdit(doc, 0, 3, 'xyz');
    expect(edit.newText).to.equal('xyz');
    expect(edit.range).to.be.instanceOf(Range);
  });
});
