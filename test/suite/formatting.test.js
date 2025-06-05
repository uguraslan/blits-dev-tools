const assert = require('assert');
const vscode = require('vscode');

suite('Template Formatting', () => {
  async function runFormatTest(language, content) {
    const document = await vscode.workspace.openTextDocument({ language, content });
    await vscode.window.showTextDocument(document);
    await document.save();
    await new Promise((r) => setTimeout(r, 500));
    const text = document.getText();
    assert.ok(text.includes('\n  <Element>'));
  }

  test('formats template in js file', async () => {
    await runFormatTest('javascript', 'const t = `\n<Element>\n</Element>`;');
  });

  test('formats template in ts file', async () => {
    await runFormatTest('typescript', 'const t = `\n<Element>\n</Element>`;');
  });

  test('formats blits file on save', async () => {
    await runFormatTest('blits', '<template>\n<Element>\n</Element>\n</template>');
  });
});
