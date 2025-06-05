const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

suite('For Loop Key Checker', () => {
  async function runWarningTest(file) {
    const document = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(document);
    await new Promise((r) => setTimeout(r, 500));
    const diags = vscode.languages.getDiagnostics(document.uri);
    const hasWarning = diags.some(
      (d) => d.message.includes('index') && d.severity === vscode.DiagnosticSeverity.Warning
    );
    assert.ok(hasWarning);
  }

  test('warns in js file', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/forloop.js');
    await runWarningTest(file);
  });

  test('warns in ts file', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/forloop.ts');
    await runWarningTest(file);
  });

  test('warns in blits file', async () => {
    const file = path.resolve(__dirname, '../test-fixtures/test-app/src/forloop.blits');
    await runWarningTest(file);
  });
});
