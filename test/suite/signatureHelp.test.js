const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

suite('Signature Help Provider', () => {
  test('provides signature help in blits file', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/invalid.blits');
    const document = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(document);

    const pos = new vscode.Position(8, 16); // inside notExisting(
    const help = await vscode.commands.executeCommand('vscode.executeSignatureHelpProvider', document.uri, pos, '(');
    assert.ok(help && help.signatures.length > 0);
  });
});
