const path = require('path');
const { runTests } = require('@vscode/test-electron');
const { execSync } = require('child_process');

async function main() {
  try {
    execSync('npm run esbuild', { stdio: 'inherit' });
    const extensionDevelopmentPath = path.resolve(__dirname, '..');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');
    const testWorkspace = path.resolve(__dirname, '../test-fixtures/test-app');

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [testWorkspace, '--disable-extensions']
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
