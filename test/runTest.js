const path = require('path')

const { runTests } = require('@vscode/test-electron')

async function runTestSuite(suiteName, workspacePath) {
  console.log(`\n🧪 Running ${suiteName} tests...`)
  try {
    // The folder containing the Extension Manifest package.json
    const extensionDevelopmentPath = path.resolve(__dirname, '../')

    // The path to test runner
    const extensionTestsPath = path.resolve(__dirname, './suite', suiteName)

    const launchArgs = ['--disable-extensions']
    if (workspacePath) {
      launchArgs.push(workspacePath)
    }

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs,
    })

    console.log(`✅ ${suiteName} tests completed successfully`)
  } catch (err) {
    console.error(`❌ ${suiteName} tests failed:`, err.message)
    throw err
  }
}

async function main() {
  try {
    // Run general extension tests first (no specific workspace)
    await runTestSuite('general', null)

    // Run TypeScript project tests
    const tsProjectPath = path.resolve(__dirname, 'fixtures', 'typescript-project')
    await runTestSuite('typescript', tsProjectPath)

    // Run JavaScript project tests
    const jsProjectPath = path.resolve(__dirname, 'fixtures', 'javascript-project')
    await runTestSuite('javascript', jsProjectPath)

    console.log('\n🎉 All test suites completed successfully!')
  } catch (err) {
    console.error('\n💥 Test suite failed')
    process.exit(1)
  }
}

main()
