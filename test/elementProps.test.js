const { setupVSCodeMock } = require('./test-helpers');
const { MockDocument } = setupVSCodeMock();
const rewire = require('rewire');
const { expect } = require('chai');

const mod = rewire('../src/completionItems/elementProps.js');

mod.__set__('getAttributesForComponent', (tag, onlyEvent, onlyReactive) => {
  const base = {
    test: { attrType: 'regular', types: ['string'], defaultValue: 'a', reactive: false },
    ':event': { attrType: 'event', types: ['Function'], defaultValue: null, reactive: false },
    reactive: { attrType: 'regular', types: ['number'], defaultValue: 0, reactive: true },
  };
  if (onlyEvent) return { ':event': base[':event'] };
  if (onlyReactive) return { reactive: base.reactive };
  return { test: base.test };
});
mod.__set__('getCompletionDetails', () => ({ description: 'd', defaultValue: 'a', types: ['string'] }));

describe('elementProps', () => {
  it('suggest creates completion items', async () => {
    const res = await mod.suggest('Element', [], false, false);
    expect(res).to.have.length(1);
    const item = res[0];
    expect(item.label).to.equal('test');
    expect(item.insertText.value).to.include('test="');
  });

  it('filters by reactive and event props', async () => {
    const ev = await mod.suggest('Element', [], true, false);
    expect(ev[0].label).to.equal(':event');

    const reactive = await mod.suggest('Element', [], false, true);
    expect(reactive[0].label).to.equal(':reactive');
  });
});
