const { setupVSCodeMock, MockDocument, Position } = require('./test-helpers');
setupVSCodeMock();

const templateHandler = require('../src/core/templateHandler');
const { expect } = require('chai');

describe('templateHandler', () => {
  it('identifies cursor inside template for blits file', () => {
    const text = `<template>\n  <Element/>\n</template>\n<script></script>`;
    const doc = new MockDocument(text, 'blits', '/f.blits');
    const posInside = new Position(1, 2);
    const posOutside = new Position(3, 1);
    expect(templateHandler.isCursorInTemplate(doc, posInside)).to.be.true;
    expect(templateHandler.isCursorInTemplate(doc, posOutside)).to.be.false;
  });

  it('getTagAndAttributes extracts tag data', () => {
    const lineDoc = new MockDocument('<Element w="10" h="20">', 'javascript');
    const info = templateHandler.getTagAndAttributes(lineDoc, new Position(0, 15));
    expect(info.tagName).to.equal('Element');
    expect(info.attributes).to.deep.equal(['w', 'h']);
  });

  it('getTagContext finds opening tag', () => {
    const text = '<Element w="5">\n  <Child />\n</Element>';
    const doc = new MockDocument(text, 'javascript');
    const pos = new Position(1, 3);
    const ctx = templateHandler.getTagContext(doc, pos);
    expect(ctx.isInTag).to.be.true;
    expect(ctx.tagName).to.be.null;
  });

  it('shouldSuggestTags returns true outside comments', () => {
    const doc = new MockDocument('<Element></Element>\n<', 'javascript');
    const pos = new Position(1, 1); // after '<'
    expect(templateHandler.shouldSuggestTags(doc, pos)).to.be.true;
  });

  it('shouldSuggestTags returns false inside comment', () => {
    const doc = new MockDocument('<!-- < -->\n<', 'javascript');
    const pos = new Position(0, 6); // inside comment after '<'
    expect(templateHandler.shouldSuggestTags(doc, pos)).to.be.false;
  });
});
