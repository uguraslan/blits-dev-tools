const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

suite('Comment Command', () => {
  async function runToggleTest(file) {
    const document = await vscode.workspace.openTextDocument(file);
    const editor = await vscode.window.showTextDocument(document);
    const line = 2;
    await editor.edit((edit) => {
      edit.insert(new vscode.Position(line, 4), '<Element w="10" h="10" />\n');
    });
    const pos = new vscode.Position(line, 6);
    editor.selection = new vscode.Selection(pos, pos);
    await vscode.commands.executeCommand('blits-vscode.commentCommand');
    assert.ok(document.lineAt(line).text.trim().startsWith('<!--'));
    await vscode.commands.executeCommand('blits-vscode.commentCommand');
    assert.ok(!document.lineAt(line).text.trim().startsWith('<!--'));
  }

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('toggle comment in JS file', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/App.js');
    await runToggleTest(file);
  });

  test('toggle comment in TS file', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/App.ts');
    await runToggleTest(file);
  });

  test('toggle comment in Blits file', async () => {
    const file = path.resolve(
      __dirname,
      '../test-fixtures/test-app/src/comment.blits'
    );
    await runToggleTest(file);
  });
});
