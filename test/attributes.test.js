const { setupVSCodeMock } = require('./test-helpers');
setupVSCodeMock();

const { getAttributesForComponent, getAttributeDefinition, isBuiltInComponent, getCompletionDetails } = require('../src/core/framework/attributes');
const { expect } = require('chai');

describe('framework attributes', () => {
  it('exposes attribute helpers', () => {
    const attrs = getAttributesForComponent('Element');
    expect(attrs).to.be.an('object');
    expect(attrs).to.have.property('x');

    const def = getAttributeDefinition('x');
    expect(def).to.be.an('object');
    expect(def.usedIn).to.include('Element');

    expect(isBuiltInComponent('Element')).to.be.true;
    const details = getCompletionDetails('x');
    expect(details).to.have.property('types');
  });
});
