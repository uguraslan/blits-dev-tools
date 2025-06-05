const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

suite('Code Actions Provider', () => {
  test('offers quick fix for unreachable code', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/unreachable.blits');
    const document = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(document);
    // wait diagnostics
    await new Promise(r => setTimeout(r, 1000));
    const range = new vscode.Range(new vscode.Position(6, 2), new vscode.Position(7, 13));
    const actions = await vscode.commands.executeCommand('vscode.executeCodeActionProvider', document.uri, range);
    const hasFix = actions.some(a => a.title.includes('Remove unreachable code'));
    assert.ok(hasFix);
  });
});
