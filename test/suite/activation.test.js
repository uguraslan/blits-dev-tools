const assert = require('assert');
const vscode = require('vscode');

suite('Extension Activation', () => {
  test('activate extension', async () => {
    const ext = vscode.extensions.getExtension('lightningjs.lightning-blits');
    await ext.activate();
    assert.strictEqual(ext.isActive, true);
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('blits-vscode.commentCommand'));
  });
});
