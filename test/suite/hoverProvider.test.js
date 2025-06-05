const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

suite('Hover Provider', () => {
  test('provides hover info in blits script', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/invalid.blits');
    const document = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(document);
    const position = new vscode.Position(7, 10); // over Blits
    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', document.uri, position);
    assert.ok(Array.isArray(hovers) && hovers.length > 0);
  });
});
