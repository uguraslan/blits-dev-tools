const { setupVSCodeMock } = require('./test-helpers');
setupVSCodeMock();

const parseAST = require('../src/parsers/parseAST');
const { expect } = require('chai');

describe('parseAST', () => {
  it('parses valid JavaScript', () => {
    const ast = parseAST('const a = 1;', 'js');
    expect(ast).to.be.an('object');
    expect(ast.program.body.length).to.equal(1);
  });

  it('parses TypeScript', () => {
    const ast = parseAST('let x: number = 42;', 'ts');
    expect(ast).to.be.an('object');
  });

  it('returns null for invalid code', () => {
    const ast = parseAST('function {', 'js');
    expect(ast).to.equal(null);
  });
});
