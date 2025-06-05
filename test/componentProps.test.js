const { setupVSCodeMock, MockDocument } = require('./test-helpers');
setupVSCodeMock();
const rewire = require('rewire');
const { expect } = require('chai');

const mod = rewire('../src/completionItems/componentProps.js');

mod.__set__('elementProps', { suggest: async () => [{ label: 'elem' }] });
mod.__set__('componentHandler', {
  analyzeComponentsInDocument: async () => ({
    importedComponents: [
      { name: 'MyComp', props: [{ key: 'prop', default: '1' }] }
    ]
  })
});

describe('componentProps', () => {
  it('returns component and element suggestions', async () => {
    const res = await mod.suggest('MyComp', [], new MockDocument(''));
    const labels = res.map(r => r.label);
    expect(labels).to.include('prop');
    expect(labels).to.include('elem');
  });

  it('filters existing attributes', async () => {
    const res = await mod.suggest('MyComp', ['prop'], new MockDocument(''));
    const labels = res.map(r => r.label);
    expect(labels).to.not.include('prop');
    expect(labels).to.include('elem');
  });
});
