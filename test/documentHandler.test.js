const { setupVSCodeMock, MockDocument, Position, Range } = require('./test-helpers');
setupVSCodeMock();

const documentHandler = require('../src/core/documentHandler');
const { expect } = require('chai');

describe('documentHandler', () => {
  it('extracts template and script from blits file', () => {
    const text = `<template>\n  <Element/>\n</template>\n<script>console.log(1)</script>`;
    const doc = new MockDocument(text, 'blits', '/test.blits');

    const tpl = documentHandler.getBlitsTemplate(text);
    expect(tpl.content.trim()).to.equal('<Element/>');

    const script = documentHandler.getBlitsScript(text);
    expect(script.content.trim()).to.equal('console.log(1)');
    expect(script.language).to.equal('js');

    const all = documentHandler.getAllTemplates(doc);
    expect(all).to.have.length(1);
    expect(all[0].type).to.equal('template');
  });

  it('detects template literals in JavaScript', () => {
    const js = `import Blits from '@lightningjs/blits';\nexport default Blits.Component('Comp',{ template: \`<El/>\` });`;
    const doc = new MockDocument(js, 'javascript', '/comp.js');
    const templates = documentHandler.getAllTemplates(doc);
    expect(templates).to.have.length(1);
    expect(templates[0].type).to.equal('template-literal');
  });

  it('isBlitsFile works', () => {
    const doc = new MockDocument('text', 'blits', '/a.blits');
    expect(documentHandler.isBlitsFile(doc)).to.be.true;
  });

  it('parses component templates and script content', () => {
    const js = "import Blits from '@lightningjs/blits';\nexport default Blits.Component('Comp',{ template: `<El/>` });";
    const ast = documentHandler.getASTForDocument(new MockDocument(js, 'javascript', '/c.js'));
    const temps = documentHandler.getAllComponentTemplates(ast, js);
    expect(temps.length).to.equal(1);
    const content = documentHandler.getBlitsFileContent(new MockDocument('<template><El/></template>\n<script>let a=1</script>', 'blits', '/a.blits'));
    expect(content.template.content.trim()).to.equal('<El/>');
    expect(content.script.content.trim()).to.equal('let a=1');
  });

  it('getAllComponentTemplates validates template strings', () => {
    const jsInvalid = `export default { template: 'nope' }`;
    const astInvalid = require('../src/parsers/parseAST')(jsInvalid, 'js');
    const resInvalid = documentHandler.getAllComponentTemplates(astInvalid, jsInvalid);
    expect(resInvalid.length).to.equal(0);

    const jsValid = `export default { template: '<!-- hi -->' }`;
    const astValid = require('../src/parsers/parseAST')(jsValid, 'js');
    const resValid = documentHandler.getAllComponentTemplates(astValid, jsValid);
    expect(resValid.length).to.equal(1);
  });
});
