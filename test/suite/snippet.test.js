const assert = require('assert');
const vscode = require('vscode');

suite('Snippets', () => {
  async function runSnippetTest(language, snippet) {
    const document = await vscode.workspace.openTextDocument({ language, content: '' });
    await vscode.window.showTextDocument(document);
    await vscode.commands.executeCommand('editor.action.insertSnippet', snippet);
    const text = document.getText();
    return text;
  }

  test('insert blits-file snippet', async () => {
    const text = await runSnippetTest('blits', { langId: 'blits', name: 'blits-file' });
    assert.ok(text.includes('<template>'));
  });

  test('insert js component snippet', async () => {
    const text = await runSnippetTest('javascript', { langId: 'javascript', name: 'blits-component' });
    assert.ok(text.includes('Blits.Component'));
  });

  test('insert ts component snippet', async () => {
    const text = await runSnippetTest('typescript', { langId: 'typescript', name: 'blits-component' });
    assert.ok(text.includes('Blits.Component'));
  });
});
