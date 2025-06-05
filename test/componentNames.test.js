const { setupVSCodeMock } = require('./test-helpers');
setupVSCodeMock();
const rewire = require('rewire');
const { expect } = require('chai');

const mod = rewire('../src/completionItems/componentNames.js');
const createSeparator = mod.__get__('createSeparator');

describe('componentNames', () => {
  it('creates separators and suggestions', async () => {
    const sep = createSeparator('Built-in Components');
    expect(sep.label).to.include('Built-in');

    const data = { importedComponents: [{ name: 'MyComp', props: [], isUsedInComponents: true }] };
    const items = await mod.suggest(data);
    const labels = items.map(i => i.label);
    expect(labels).to.include('MyComp');
  });
});
