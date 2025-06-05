const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

suite('Completion Provider', () => {
  async function runCompletionTest(file, position) {
    const document = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(document);
    const list = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      document.uri,
      position,
      '<'
    );
    const hasElement = list.items.some((item) => item.label === 'Element');
    assert.ok(hasElement);
  }

  test('suggests tags in blits file', async () => {
    const file = path.resolve(
      __dirname,
      '../test-fixtures/test-app/src/completion.blits'
    );
    await runCompletionTest(file, new vscode.Position(1, 2));
  });

  test('suggests tags in js file', async () => {
    const file = path.resolve(
      __dirname,
      '../test-fixtures/test-app/src/completion.js'
    );
    await runCompletionTest(file, new vscode.Position(3, 6));
  });

  test('suggests tags in ts file', async () => {
    const file = path.resolve(
      __dirname,
      '../test-fixtures/test-app/src/completion.ts'
    );
    await runCompletionTest(file, new vscode.Position(3, 6));
  });
});
