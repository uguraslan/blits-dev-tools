const assert = require('assert');
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

suite('File Template Provider', () => {
  const workspaceDir = path.resolve(__dirname, '../test-fixtures/test-app');
  const newFile = path.join(workspaceDir, 'src/NewComp.blits');

  teardown(() => {
    if (fs.existsSync(newFile)) {
      fs.unlinkSync(newFile);
    }
  });

  test('creates template on new file', async () => {
    fs.writeFileSync(newFile, '');
    const document = await vscode.workspace.openTextDocument(newFile);
    await vscode.window.showTextDocument(document);
    await new Promise((r) => setTimeout(r, 500));
    const text = document.getText();
    assert.ok(text.includes('<template>'));
  });
});
