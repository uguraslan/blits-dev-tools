const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

suite('Diagnostics', () => {
  test('reports script errors', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/invalid.blits');
    const document = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(document);

    // Wait for diagnostics to populate
    await new Promise((r) => setTimeout(r, 1000));
    const diags = vscode.languages.getDiagnostics(document.uri);
    assert.ok(diags.length > 0);
  });
});
