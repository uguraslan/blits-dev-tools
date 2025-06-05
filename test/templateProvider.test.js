const { setupVSCodeMock, Position, MockDocument } = require('./test-helpers');
const { vscode } = setupVSCodeMock();
const rewire = require('rewire');
const { expect } = require('chai');

let capturedProvider;
vscode.languages.registerCompletionItemProvider = function(langs, provider) {
  capturedProvider = provider;
  return provider;
};

const templateMod = rewire('../src/completionProviders/template.js');
templateMod.__set__({
  templateHandler: {
    isCursorInTemplate: () => true,
    shouldSuggestTags: () => true,
    getTagContext: () => ({ isInTag: true, tagName: 'Element', attributes: [] })
  },
  componentHandler: { analyzeComponentsInDocument: async () => ({ importedComponents: [] }) },
  workspaceHandler: { isBlitsApp: () => true },
  componentNames: { suggest: async () => [ new vscode.CompletionItem('Element', vscode.CompletionItemKind.Class) ] },
  elementProps: { suggest: async () => [ new vscode.CompletionItem('x', vscode.CompletionItemKind.Property) ] },
  componentProps: { suggest: async () => [ new vscode.CompletionItem('y', vscode.CompletionItemKind.Property) ] },
  isBuiltInComponent: () => true
});

describe('template completion provider', () => {
  it('provides completion items', async () => {
    const doc = new MockDocument('<Element/>');
    const res = await capturedProvider.provideCompletionItems(doc, new Position(0, 1));
    expect(res.length).to.be.greaterThan(0);
  });
});
