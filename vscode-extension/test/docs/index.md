# Test Coverage

This document maps extension features to the tests that cover them, and identifies what is not currently tested.

---

## Coverage at a Glance

| Feature | Status | Test files |
|---|---|---|
| [Language Support](#language-support) | ✅ Covered | `extension.test.js` |
| [Template Completions](#template-completions) | ✅ Covered | `extension.test.js`, `template-detection.test.js`, `virtual-files.test.js`, integration files |
| [Script Completions (TypeScript service)](#script-completions) | ✅ Covered | `extension.test.js`, integration files |
| [Hover Provider](#hover-provider) | ✅ Covered | `hover.test.js`, `virtual-files.test.js`, integration files |
| [Diagnostics](#diagnostics) | ⚠️ Partial | `diagnostics.test.js`, integration files |
| [Signature Help](#signature-help) | ✅ Covered | `javascript-integration.test.js`, `advanced-features.test.js` |
| [Formatting](#formatting) | ⚠️ Partial | `formatting.test.js` |
| [Comment Command](#comment-command) | ✅ Covered | `commands.test.js` |
| [Syntax Grammar — Event Attributes](#syntax-grammar) | ✅ Covered | `event-attributes.test.js` |
| [Syntax Grammar — General](#syntax-grammar) | ❌ Not tested | — |
| [Workspace Detection](#workspace-detection) | ✅ Covered | `workspaceHandler.test.js` |
| [Virtual Files (.blits script)](#virtual-files) | ✅ Covered | `virtual-files.test.js` |
| [Path Alias Resolution](#path-alias-resolution) | ✅ Covered | `javascript-integration.test.js`, `typescript-integration.test.js` |
| [v1 vs v2 Attribute Sets](#v1-vs-v2-attribute-sets) | ✅ Covered | `typescript-integration.test.js`, `javascript-v2-integration.test.js`, `typescript-v2-integration.test.js` |
| [Advanced Language Features](#advanced-language-features) | ⚠️ Partial | `advanced-features.test.js` |
| [Fixture Health](#fixture-health) | ✅ Covered | `fixture-validation.test.js` |
| [Snippets](#snippets) | ❌ Not tested | — |
| [File Template (new .blits file)](#file-template) | ❌ Not tested | — |
| [Markdown Syntax Highlighting](#markdown-syntax-highlighting) | ❌ Not tested | — |
| [Configuration / Settings](#configuration--settings) | ❌ Not tested | — |

---

## Language Support

**What it is:** The extension registers `.blits` as a custom language. `.js` and `.ts` files are recognized via VSCode's built-in language detection. The extension activates on `onLanguage:javascript` and `onLanguage:typescript`.

**What is tested:**
- `.js` files → `languageId === 'javascript'` (`extension.test.js`)
- `.ts` files → `languageId === 'typescript'` (`extension.test.js`)
- `.blits` files → `languageId === 'blits'` (`extension.test.js`)
- Extension is present and activates without error (`extension.test.js`)

**Notes:** Language detection is declarative (package.json), so these tests are mostly confirming the extension loads correctly rather than testing logic.

---

## Template Completions

**What it is:** Context-aware completions inside Blits template strings in `.js`/`.ts` files and inside the `<template>` block of `.blits` files. Triggered on space (attributes), `:` (reactive bindings), and `@` (event handlers). Provides component names, element attributes, reactive variants, and event handler names.

**What is tested:**
- Element attribute completions in JS template (`extension.test.js`)
- Built-in component name completions (`Element`, `Text`, `Layout`, `RouterView`) in JS template (`extension.test.js`)
- Attribute completions in TS template and `.blits` template section (`extension.test.js`)
- Template string detection — cursor inside vs. outside template (`template-detection.test.js`)
- Reactive attribute trigger (`:`) in template (`template-detection.test.js`)
- Event attribute trigger (`@`) in template (`template-detection.test.js`)
- Completions in `.blits` template section via virtual file system (`virtual-files.test.js`)
- v1 Element attributes (e.g. `effects`, `wordwrap`) present; v2 attributes absent (`typescript-integration.test.js`)
- v2 Element attributes (e.g. `border`) present; v1 attributes absent (`javascript-v2-integration.test.js`, `typescript-v2-integration.test.js`)

**Gaps:** No test verifies that completions correctly exclude attributes not applicable to the current tag (e.g. `wordwrap` only for `Text`). No test for custom component prop completions extracted from component definitions.

---

## Script Completions

**What it is:** TypeScript language service completions inside the `<script>` section of `.blits` files. Provides standard JS/TS completions (methods, properties, standard library, etc.).

**What is tested:**
- Standard library completions (`Math.`, `JSON.`, `Array.`) in `.blits` script section (`javascript-integration.test.js`, `typescript-integration.test.js`)
- Array method completions (`filter`, `map`, `reduce`) (`javascript-integration.test.js`)
- Promise completions in TypeScript (`typescript-integration.test.js`)
- Script section completions in `.blits` file via fixture (`extension.test.js`)

**Gaps:** No test for completions derived from imports or project-local types (beyond what the integration fixtures cover).

---

## Hover Provider

**What it is:** Hover information for symbols in `.blits` files — component names in the template section (type info) and JS/TS symbols in the script section (TypeScript language service hover).

**What is tested:**
- Hover responds for `Element`, `Text`, `Layout` components in JS template (`hover.test.js`)
- Hover responds for component attributes (e.g. `w="1920"`) (`hover.test.js`)
- Hover responds in TypeScript template and `.blits` template section (`hover.test.js`)
- Hover responds in `.blits` script section (`hover.test.js`)
- Hover via virtual file — `.blits` template section (`virtual-files.test.js`)
- Hover for custom JS/TS functions in `.blits` script (e.g. `Helpers.calculateArea`) (`javascript-integration.test.js`)
- Hover for TypeScript types in `.blits` script (e.g. `Point` interface) (`typescript-integration.test.js`)
- Hover for `Math` and `Promise` objects (`javascript-integration.test.js`, `typescript-integration.test.js`)

**Notes:** Many hover tests use a soft assertion (`if (hovers.length > 0)`) because hover availability depends on language service initialization timing. Content assertions are present but guarded.

---

## Diagnostics

**What it is:** Error and warning markers in `.blits` file script sections, powered by the TypeScript language service via a virtual file system.

**What is tested:**
- Files with intentional errors produce at least one diagnostic (`diagnostics.test.js`)
- Diagnostics have valid structure (message, range, severity) (`diagnostics.test.js`)
- Severity values are valid `DiagnosticSeverity` enum values (`diagnostics.test.js`)
- Valid `.blits` files produce no error-level diagnostics (`diagnostics.test.js`)
- No unexpected errors in JS/TS fixture files (`fixture-validation.test.js`)
- No TypeScript errors in `.blits` script sections of fixture components (`fixture-validation.test.js`, `typescript-integration.test.js`, `advanced-features.test.js`)
- No `.blits` import resolution errors from TS main files (`advanced-features.test.js`)

**Gaps:** The original test for a specific Blits rule diagnostic (loop `$index` as `:key`) was removed during refactoring. There is no test that asserts a specific diagnostic *message* from the Blits extension itself (as opposed to the TypeScript language service). No test for diagnostic *clearing* when a document is fixed or closed.

---

## Signature Help

**What it is:** Function/method signature popups inside `.blits` script sections when typing function call arguments. Powered by the TypeScript language service.

**What is tested:**
- Signature help for a custom TypeScript function (`MathUtils.distance`) in `.blits` TS script — shows parameter count and name (`advanced-features.test.js`)
- Signature help for a JSDoc-annotated JavaScript function (`Helpers.calculateArea`) in `.blits` JS script (`javascript-integration.test.js`)

**Gaps:** No test for built-in function signature help (e.g. `Math.max()`). No test for overloaded function signatures.

---

## Formatting

**What it is:** Auto-format on save using Prettier with Blits-aware rules. Applies to `.blits` files (template and script) and to template strings in `.js`/`.ts` files. Controlled by `blits.autoFormat` and `blits.format.*` settings.

**What is tested:**
- Document formatting commands are available and execute without error for `.js`, `.ts`, and `.blits` files (`formatting.test.js`)

**Gaps:** No test verifies that formatting actually changes content or produces a specific output. No test for any of the 11 `blits.format.*` configuration options. No test that `blits.autoFormat: false` disables formatting.

---

## Comment Command

**What it is:** `blits-vscode.commentCommand` (bound to `Ctrl+/` / `Cmd+/`) toggles comments with context awareness — HTML-style `<!-- -->` inside template sections, JS-style `//` inside script sections.

**What is tested:**
- Command is registered (`commands.test.js`)
- Command executes without error in JS template section (`commands.test.js`)
- Command executes without error in `.blits` template section (`commands.test.js`)
- Command executes without error in `.blits` script section (`commands.test.js`)
- Keybinding is declared with correct keys (`Ctrl+/`, `Cmd+/`) (`commands.test.js`)

**Gaps:** No test verifies the actual comment *output* — i.e. that `<!-- -->` is used in templates and `//` in scripts. Command execution is asserted to not throw, but result content is not checked.

---

## Syntax Grammar

**What it is:** TextMate grammars that power syntax highlighting. Three grammars: `inline.custom-blits-html` (injected into JS/TS for template strings), `source.blits` (`.blits` files), and `markdown.blits.codeblock` (`.blits` code blocks in Markdown).

Within the event attribute grammar specifically: `@loaded`, `@error`, `@updated` accept `$handlerName` references or `(args) => $fn(args)` arrow functions. Anything else is marked as `invalid.illegal`.

**What is tested — event attributes grammar:**
- `blits.json` has exactly 4 event attribute patterns in the correct order (`event-attributes.test.js`)
- `embedded-html.json` has the same 4-pattern structure (`event-attributes.test.js`)
- Pattern 0: matches `$handler` references (`event-attributes.test.js`)
- Pattern 1: matches arrow function syntax with `=>` lookahead (`event-attributes.test.js`)
- Pattern 2: marks invalid handler values as `invalid.illegal` (`event-attributes.test.js`)
- Pattern 3: marks invalid event names (`@click`, `@focus`, etc.) as `invalid.illegal` (`event-attributes.test.js`)
- Arrow function body has correct inner token scopes (`variable.parameter`, `storage.type.function.arrow`, `variable.other`, `meta.brace.round`) (`event-attributes.test.js`)
- Valid handler values match patterns 0 and 1; invalid values match pattern 2; invalid names match pattern 3 (`event-attributes.test.js`)

**What is not tested:**
- The `source.blits` grammar structure (template/script section boundaries, embedded JS/TS scoping)
- The `inline.custom-blits-html` grammar injection into JS/TS files
- The Markdown code block grammar
- Reactive attribute syntax (`:attr="$value"`) highlighting
- General template element/attribute token scopes

---

## Workspace Detection

**What it is:** On activation, the extension scans workspace `package.json` files to find Blits projects, extract the Blits version, and detect whether `prettier-plugin-blits` and `eslint-plugin-blits` are installed. The detected version determines which attribute set (v1 vs v2) is served to completion providers.

**What is tested:**
- Blits version extraction from `package.json` dependencies (e.g. `"@lightningjs/blits": "^1.0.0"` → `"1.0.0"`) (`workspaceHandler.test.js`)
- Version extraction from various semver range formats (`~`, `^`, exact) (`workspaceHandler.test.js`)
- `prettier-plugin-blits` detection in devDependencies (`workspaceHandler.test.js`)
- `eslint-plugin-blits` detection in devDependencies (`workspaceHandler.test.js`)
- v1 attribute bundle is returned for v1 projects (includes `effects`, `wordwrap`; excludes `border`) (`workspaceHandler.test.js`)

**Gaps:** No test for what happens when `package.json` has no Blits dependency. No test for multi-root workspaces with mixed v1/v2 projects. No test that version detection triggers a refresh of completions.

---

## Virtual Files

**What it is:** The diagnostics and language service providers create in-memory TypeScript source files mirroring the script content of `.blits` files. Position mapping translates between the `.blits` file coordinates and the virtual file coordinates.

**What is tested:**
- Opening a `.blits` file as a virtual document provides completions in the template section (`virtual-files.test.js`)
- Hover works in the template section of a virtual `.blits` file (`virtual-files.test.js`)
- Position mapping — cursor positions in the `.blits` file map to correct locations in the virtual file (`virtual-files.test.js`)
- Virtual file content matches the script section of the `.blits` source (`virtual-files.test.js`)

**Gaps:** No test for the case where a `.blits` file has `lang="ts"` — position mapping with TypeScript-specific syntax. No test for multi-line script changes (document edits updating the virtual file).

---

## Path Alias Resolution

**What it is:** Import resolution for `@/` and `@utils/` path aliases configured in `jsconfig.json` / `tsconfig.json` fixture projects. Tests that the TypeScript language service resolves these to actual files.

**What is tested:**
- `@utils/helpers` import in `.blits` JS script resolves to `helpers.js` (`javascript-integration.test.js`)
- `@/utils/math` import in `.blits` TS script resolves to `math.ts` (`typescript-integration.test.js`)
- `.blits` component import in `main.js` / `main.ts` — definition provider responds (`javascript-integration.test.js`, `typescript-integration.test.js`)

---

## v1 vs v2 Attribute Sets

**What it is:** The extension serves different attribute completion sets depending on the detected Blits version. v1 projects get attributes like `effects`, `wordwrap`; v2 projects get `border`, `rounded`, `shadow`, `shader`. Reactive (`:attr`) variants follow the same split.

**What is tested:**
- v1 project: `effects` present, `border`/`rounded`/`shadow`/`shader` absent in Element completions (`typescript-integration.test.js`)
- v1 project: `wordwrap` present in Text completions (`typescript-integration.test.js`)
- v2 JS project: `border` present, `effects` absent in Element completions — `.blits` file and inline template string (`javascript-v2-integration.test.js`)
- v2 JS project: reactive `:border` present, `:effects` absent (`javascript-v2-integration.test.js`)
- v2 TS project: `border` present, `effects`/`wordwrap` absent in `.blits` and `.ts` template strings (`typescript-v2-integration.test.js`)

**Notes:** These tests use a polling loop (up to 12s) because completion content depends on workspace scan completing after extension activation.

---

## Advanced Language Features

**What it is:** TypeScript language service features beyond basic completions and hover: find all references, rename symbol, code actions, workspace/document symbol search.

**What is tested:**
- Signature help for TypeScript function with parameters (`advanced-features.test.js`)
- Find all references for a TypeScript interface (`Point`) across files (`advanced-features.test.js`)
- Rename symbol — provider responds and returns a `WorkspaceEdit` object (`advanced-features.test.js`)
- `.blits` import errors absent in `main.ts` (`advanced-features.test.js`)
- Code actions provider responds for a `.blits` file position (`advanced-features.test.js`)
- Workspace symbol search for `MathUtils` (`advanced-features.test.js`)
- Document symbol provider executes without error on a `.blits` file (`advanced-features.test.js`)

**Gaps:** Rename test only checks that an edit object is returned — not that the rename was actually applied to the correct symbols. Document symbol test only asserts the command doesn't throw, not that specific symbols are found. Code actions test asserts the response is an array but not what actions are available.

---

## Fixture Health

**What it is:** Sanity checks that the test fixture projects themselves are in a clean state — no unexpected errors introduced by the extension or language services.

**What is tested:**
- JavaScript fixture `main.js` — no Error-severity diagnostics beyond expected module resolution errors (`fixture-validation.test.js`)
- TypeScript fixture `main.ts` — same (`fixture-validation.test.js`)
- TypeScript fixture `Button.blits` — no major language service errors in script section (`fixture-validation.test.js`)

**Notes:** These are infrastructure tests, not feature tests. They guard against regressions caused by fixture file changes or language service upgrades.

---

## Coverage Gaps

Features implemented in the extension but with no test coverage:

### Snippets
The extension contributes 7 snippets: `blits-file`, `blits-component`, `blits-input`, `blits-input-block`, `blits-hooks`, `blits-hooks-block`, `blits-attribute-transition`. None are tested. Testing snippets programmatically in VS Code integration tests requires triggering snippet insertion via `editor.insertSnippet` and asserting the resulting text.

### File Template (new .blits file)옵
When a new `.blits` file is created, `blits.insertComponentTemplate` auto-inserts a boilerplate template with `<template>`, `<script>`, `Blits.Component()`, `state()`, and `hooks.ready()`. Not tested.

### Markdown Syntax Highlighting
The `markdown.blits.codeblock` grammar injects Blits syntax highlighting into Markdown code blocks fenced with ` ```blits `. Not tested — grammar injection in Markdown is difficult to test via the VSCode test API.

### Configuration / Settings
The `blits.autoFormat` toggle and all 11 `blits.format.*` settings (printWidth, tabWidth, useTabs, semi, singleQuote, quoteProps, trailingComma, bracketSpacing, bracketSameLine, arrowParens, singleAttributePerLine) have no behavioral tests. The formatting test only verifies the command executes — not that settings affect output.

### Comment Output Content
`commands.test.js` verifies the comment command is registered and executes without error. It does not verify that the output text actually contains `<!-- comment -->` in templates or `// comment` in scripts.

### Formatting Output Content
`formatting.test.js` verifies formatting commands execute. It does not assert that the formatted document matches expected output for any input.

### Diagnostic Specificity
`diagnostics.test.js` checks that error files produce at least one diagnostic and that diagnostics are structurally valid. It does not assert that a specific Blits rule violation (e.g. using `$index` as `:key` in a `:for` loop) produces the expected diagnostic message.

### Multi-root Workspace
No test covers a workspace with multiple Blits projects open simultaneously (different versions, different root paths).

---

## Test Files Reference

| File | Suite runner | Workspace context |
|---|---|---|
| `extension.test.js` | General | Any |
| `workspaceHandler.test.js` | General | Any |
| `formatting.test.js` | General | Any |
| `template-detection.test.js` | General | Any |
| `virtual-files.test.js` | General | Any |
| `commands.test.js` | General | Any |
| `diagnostics.test.js` | General | Any |
| `hover.test.js` | General | Any |
| `event-attributes.test.js` | General | Any (no VSCode API) |
| `fixture-validation.test.js` | General | Any |
| `javascript-integration.test.js` | JS workspace | Requires JS project workspace |
| `typescript-integration.test.js` | TS workspace | Requires TS project workspace |
| `javascript-v2-integration.test.js` | JS v2 workspace | Requires JS v2 project workspace |
| `typescript-v2-integration.test.js` | TS v2 workspace | Requires TS v2 project workspace |
| `advanced-features.test.js` | Advanced workspace | Requires TS project workspace |

The general suite runner (`test/suite/general/index.js`) runs all non-integration tests. Integration and advanced tests run in dedicated workspace contexts that mount the fixture projects as VS Code workspace folders.
