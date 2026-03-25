# Lightning Blits VSCode Extension — Manual Testing Guide

This guide is for manually verifying every feature of the extension in a live debug session.
Work through each section in order or jump to a specific area using the table of contents.

---

## Table of Contents

| # | Feature Area | Test Cases |
|---|---|---|
| 1 | [Extension Activation](#1-extension-activation) | TC-001–TC-003 |
| 2 | [Language Support & File Icons](#2-language-support--file-icons) | TC-004–TC-007 |
| 3 | [Syntax Highlighting — `.blits` Files](#3-syntax-highlighting--blits-files) | TC-008–TC-012 |
| 4 | [Syntax Highlighting — JS/TS Template Strings](#4-syntax-highlighting--jsts-template-strings) | TC-013–TC-015 |
| 5 | [Syntax Highlighting — Markdown Code Blocks](#5-syntax-highlighting--markdown-code-blocks) | TC-016 |
| 6 | [Template Completions — Component Names](#6-template-completions--component-names) | TC-017–TC-019 |
| 7 | [Template Completions — Element Attributes](#7-template-completions--element-attributes) | TC-020–TC-025 |
| 8 | [Template Completions — Reactive Attributes](#8-template-completions--reactive-attributes) | TC-026–TC-027 |
| 9 | [Template Completions — Event Handlers](#9-template-completions--event-handlers) | TC-028–TC-029 |
| 10 | [Template Completions — Custom Component Props](#10-template-completions--custom-component-props) | TC-030–TC-031 |
| 11 | [Template Completions — v1 vs v2 Attribute Sets](#11-template-completions--v1-vs-v2-attribute-sets) | TC-032–TC-035 |
| 12 | [Completion Documentation Popups](#12-completion-documentation-popups) | TC-036–TC-037 |
| 13 | [Script Completions](#13-script-completions) | TC-038–TC-042 |
| 14 | [Hover Provider](#14-hover-provider) | TC-043–TC-047 |
| 15 | [Diagnostics](#15-diagnostics) | TC-048–TC-053 |
| 16 | [Signature Help](#16-signature-help) | TC-054–TC-055 |
| 17 | [Advanced Language Features](#17-advanced-language-features) | TC-056–TC-059 |
| 18 | [Comment Command](#18-comment-command-cmd--ctrl) | TC-060–TC-066 |
| 19 | [Auto-format on Save](#19-auto-format-on-save) | TC-067–TC-072 |
| 20 | [Format Settings](#20-format-settings) | TC-073–TC-077 |
| 21 | [File Template Provider](#21-file-template-provider) | TC-078–TC-080 |
| 22 | [Snippets — `.blits` Files](#22-snippets--blits-files) | TC-081–TC-082 |
| 23 | [Snippets — JS/TS Files](#23-snippets--jsts-files) | TC-083–TC-088 |
| 24 | [Language Configuration — `.blits` Files](#24-language-configuration--blits-files) | TC-089–TC-093 |
| 25 | [Workspace Detection](#25-workspace-detection) | TC-094–TC-097 |

---

## Setup

### Apps Required

Open the extension project in VS Code and press **F5** (or **Run > Start Debugging**) to launch a new Extension Development Host window. In that window, open:

- **JS App** — a Blits project whose `package.json` contains `"@lightningjs/blits": "^1.x.x"` in `dependencies`. Good candidates: `blits-example-app` or `blits-sample-app-ts` temporarily switched to JS. At minimum the project needs a `.js` file using `Blits.Component(...)` with a `template` string.
- **TS App** — a Blits project with TypeScript (`tsconfig.json` + `.ts` entry, `"@lightningjs/blits": "^1.x.x"`). `blits-sample-app-ts` is ideal.
- **`.blits` files** — at least one `.blits` component file in each app.

For **v2 tests** (Section 11), you can temporarily edit the version in `package.json` of either app to `"@lightningjs/blits": "^2.0.0"` and reload the Extension Host window.

### Notation

- `⌘/` = Cmd+/ on macOS, Ctrl+/ on Windows/Linux
- `⌘S` = Cmd+S (Save)
- `⌘P` = Command Palette
- **Trigger IntelliSense** = press `Ctrl+Space` to force the completion list open
- **Hover** = move the mouse cursor over the token and wait ~1 second

---

## 1. Extension Activation

### TC-001: Status bar item visible

**Steps:**
1. Open any file from a Blits project.

**Expected:** In the bottom-right status bar a `⚡ Lightning Blits v1.x.x` item is visible.

**Pass if:** The status bar item is present and shows the correct version number.

---

### TC-002: No activation errors

**Steps:**
1. Open the **Output** panel (View → Output) and select the **Extension Host** channel.
2. Look for any `[ERROR]` or `Error activating Lightning Blits` lines.

**Expected:** No error lines. The log should contain `Lightning Blits has been activated.`

**Pass if:** Activation log line is present and no error lines.

---

### TC-003: Project discovery log

**Steps:**
1. Still in the **Output → Extension Host** log.
2. Look for a line like `Found N Lightning Blits project(s) in workspace.`

**Expected:** N matches the number of Blits projects in the open workspace (1 or 2).

**Pass if:** The discovery line appears and count is correct.

---

## 2. Language Support & File Icons

### TC-004: `.blits` file has `blits` language ID

**Steps:**
1. Open any `.blits` file.
2. Check the language mode indicator in the bottom-right status bar (shows e.g. "JavaScript").

**Expected:** The language mode shows **Blits** (or `blits`).

**Pass if:** Status bar reads `Blits`.

---

### TC-005: `.js` file has `javascript` language ID

**Steps:**
1. Open a `.js` file from the Blits app.
2. Check the language mode indicator.

**Expected:** Status bar reads `JavaScript`.

**Pass if:** Status bar reads `JavaScript`.

---

### TC-006: `.ts` file has `typescript` language ID

**Steps:**
1. Open a `.ts` file from the TS Blits app.
2. Check the language mode indicator.

**Expected:** Status bar reads `TypeScript`.

**Pass if:** Status bar reads `TypeScript`.

---

### TC-007: `.blits` file has a custom icon in the Explorer

**Steps:**
1. Open the Explorer sidebar.
2. Find any `.blits` file.

**Expected:** The file has the Lightning Blits icon (a bolt/lightning symbol, not a generic file icon).

**Pass if:** Custom icon is visible instead of the default file icon.

---

## 3. Syntax Highlighting — `.blits` Files

### TC-008: Template section — element tags colored

**Steps:**
1. Open a `.blits` file that contains a `<template>` block with at least `<Element>`, `<Text>`, and `<Layout>`.
2. Visually inspect the colors.

**Expected:**
- `Element`, `Text`, `Layout`, `RouterView` tag names are colored (typically blue or similar, distinct from plain text).
- `<`, `>`, `/` brackets are colored distinctly.

**Pass if:** Tag names are a different color than surrounding attribute values or text.

---

### TC-009: Template section — attribute syntax coloring

**Steps:**
1. In a `.blits` template, look at a tag like:
   ```
   <Element w="1920" :color="$bgColor" @loaded="$onLoad" />
   ```
2. Compare the colors of `w`, `:color`, `@loaded`, `"1920"`, `"$bgColor"`, `"$onLoad"`.

**Expected:**
- Static attribute names (`w`, `x`, `color`) are one color.
- Reactive attribute names (`:color`, `:w`) have a prefix (`:`) visually distinct.
- Event handler names (`@loaded`) have `@` visually distinct.
- Attribute values in quotes are a different color from names.
- `$bgColor`, `$onLoad` inside quotes may have special highlighting.

**Pass if:** Static attribute names, reactive attribute names, event names, and attribute values are each visually distinguishable.

---

### TC-010: Template section — valid vs invalid event names

**Steps:**
1. In a `.blits` template, write the following (or open the fixture `test-component.blits`):
   ```xml
   <Element @loaded="$handler" @click="$handler" @error="$handler" @focus="$handler" />
   ```
2. Observe the syntax coloring of each event name.

**Expected:**
- `@loaded`, `@error`, `@updated`, `@longpress` are highlighted normally (valid).
- `@click`, `@focus`, `@keypress`, `@mouseenter` are highlighted as **invalid** — typically in a red or error color (the grammar marks them `invalid.illegal`).

**Pass if:** `@click` and `@focus` appear in a red/error color; `@loaded` and `@error` appear in a normal/valid color.

---

### TC-011: Script section — JS/TS code colored correctly

**Steps:**
1. Open a `.blits` file with a `<script>` section containing:
   ```js
   const x = 'hello'
   const y = 42
   // this is a comment
   function greet(name) {
     return `Hello, ${name}`
   }
   ```
2. Inspect the colors.

**Expected:**
- `const`, `function`, `return` are keyword colors.
- `'hello'` and the template literal are string colors.
- `// this is a comment` is comment color.
- `42` is a number color.

**Pass if:** Keywords, strings, numbers, and comments each appear in distinct, correct colors.

---

### TC-012: `.blits` script section with `lang="ts"` typed as TypeScript

**Steps:**
1. Open or create a `.blits` file whose `<script>` tag reads `<script lang="ts">`.
2. Add TypeScript-specific content:
   ```ts
   interface Point {
     x: number
     y: number
   }
   const p: Point = { x: 10, y: 20 }
   ```
3. Inspect the color of `interface`, `Point`, `number`, and `: Point`.

**Expected:** TypeScript-specific tokens (`interface`, type annotations) are colored with TypeScript syntax highlighting — `interface` as a keyword, `number` as a type, etc.

**Pass if:** TypeScript keywords and type annotations are colored, not shown as plain text.

---

## 4. Syntax Highlighting — JS/TS Template Strings

### TC-013: Template string in `.js` file — element/attribute highlighting

**Steps:**
1. Open a `.js` file containing:
   ```js
   template: `
     <Element w="1920" h="1080" :color="$bgColor">
       <Text content="Hello" />
     </Element>
   `
   ```
2. Inspect colors inside the backtick template string.

**Expected:** Same coloring as in TC-008 and TC-009 — `Element`, `Text` colored as tag names; `w`, `h` as attribute names; `"1920"` as a value; `:color` with reactive prefix styling.

**Pass if:** The template string content is colored the same way as a `.blits` template section (not plain string color).

---

### TC-014: Template string in `.ts` file — same as JS

**Steps:**
1. Repeat TC-013 using a `.ts` file instead of `.js`.

**Pass if:** Same result — Blits syntax coloring is applied inside the template string.

---

### TC-015: Template string invalid event name highlighted in error color

**Steps:**
1. In a `.js` or `.ts` template string, write:
   ```js
   template: `<Element @click="$handler" @loaded="$handler" />`
   ```

**Expected:** `@click` appears in red/error color; `@loaded` appears normally.

**Pass if:** Same behavior as TC-010 but inside a JS/TS template string.

---

## 5. Syntax Highlighting — Markdown Code Blocks

### TC-016: `blits` fenced code block in Markdown

**Steps:**
1. Open or create a `.md` file.
2. Add a fenced code block:
   ````md
   ```blits
   <template>
     <Element w="1920" :color="$bg">
       <Text content="Hello" />
     </Element>
   </template>
   
   <script>
   export default {
     state() {
       return { bg: '#ff0000' }
     }
   }
   </script>
   ```
   ````
3. Inspect the content inside the code block.

**Expected:** The Blits template content inside the ` ```blits ` fence is syntax-highlighted (tag names colored, attribute names colored, etc.) rather than shown as plain text.

**Pass if:** Syntax highlighting is active inside the code block (compare to a ` ```text ` block which shows plain text).

---

## 6. Template Completions — Component Names

### TC-017: Built-in component names in `.blits` template

**Steps:**
1. Open a `.blits` file.
2. Go into the `<template>` block.
3. On an empty line, type `<` (angle bracket).
4. Wait for the completion list, or press Ctrl+Space to trigger it.

**Expected:** The completion list includes:
- `Element` — with detail "Built-in Component: `<Element>`"
- `Text` — with detail "Built-in Component: `<Text>`"
- `Layout` — with detail "Built-in Component: `<Layout>`"
- `RouterView` — with detail "Built-in Component: RouterView"

**Pass if:** All four built-in components appear in the list.

---

### TC-018: Built-in component names in JS template string

**Steps:**
1. Open a `.js` file with a `Blits.Component(...)` definition.
2. Inside the `template: \`...\`` backtick string, position the cursor on an empty line.
3. Type `<` and wait for completions.

**Expected:** Same four built-in components appear.

**Pass if:** `Element`, `Text`, `Layout`, `RouterView` all appear.

---

### TC-019: Custom component appears in list when registered

**Steps:**
1. In a `.js` or `.blits` file, ensure a custom component is:
   - Imported: `import MyButton from './MyButton.blits'`
   - Registered: `components: { MyButton }`
2. In the template, type `<` and trigger completions.

**Expected:** `MyButton` appears in the completion list under a **Custom Components** separator (below the Built-in Components section).

**Pass if:** `MyButton` (or whatever your component is named) appears with a "Custom component: `<MyButton>`" detail.

---

## 7. Template Completions — Element Attributes

### TC-020: Static attribute completions triggered by space in `.blits` template

**Steps:**
1. In a `.blits` `<template>`, write `<Element ` (with a trailing space) and leave the cursor after the space.
2. Trigger IntelliSense (Ctrl+Space).

**Expected:** A list of `Element` attributes appears, including at minimum: `x`, `y`, `w`, `h`, `color`, `alpha`, `scale`, `rotation`, `mount`, `pivot`, `visible`, `src`.

**Pass if:** At least 10 Element attributes appear.

---

### TC-021: Static attribute completions in JS template string

**Steps:**
1. In a `.js` template string, position the cursor inside an `<Element ` tag (cursor right after the space).
2. Trigger IntelliSense.

**Expected:** Same attribute list as TC-020.

**Pass if:** Element attributes appear in the JS template string context.

---

### TC-022: `Text`-specific attributes appear for `<Text>` tag

**Steps:**
1. In a `.blits` template, write `<Text ` and trigger completions.

**Expected:** Attributes specific to `Text` appear: `content`, `wordwrap` (v1), `size`, `font`, `color`, `textOverflow`, `maxLines`, `lineHeight`.

**Pass if:** `content` and at least one Text-specific attribute (`wordwrap`, `size`, `font`) appear.

---

### TC-023: `wordwrap` does NOT appear in `<Element>` completions

**Steps:**
1. Write `<Element ` and trigger completions.
2. Look for `wordwrap` in the list.

**Expected:** `wordwrap` is NOT in the list (it is a `Text`-only attribute).

**Pass if:** `wordwrap` is absent from `<Element>` attribute completions.

---

### TC-024: `Layout`-specific attributes appear for `<Layout>` tag

**Steps:**
1. In a `.blits` template, write `<Layout ` and trigger completions.

**Expected:** Layout-specific attributes appear: `direction`, `gap`, `align-items`.

**Pass if:** `direction` and `gap` appear in the list.

---

### TC-025: Already-set attributes are excluded from completions

**Steps:**
1. In a `.blits` template, write `<Element w="1920" ` (with `w` already set) and trigger completions after the space.

**Expected:** `w` does NOT appear in the completion list (it is already used in this tag).

**Pass if:** `w` is absent; other attributes like `h`, `x`, `color` are still present.

---

## 8. Template Completions — Reactive Attributes

### TC-026: Reactive attribute completions triggered by `:` in `.blits` template

**Steps:**
1. In a `.blits` template, write `<Element ` and then type `:` (colon).
2. The completion list should appear automatically (`:` is a trigger character).

**Expected:** Reactive variants appear with `:` prefix: `:x`, `:y`, `:w`, `:h`, `:color`, `:alpha`, etc. Each item's detail line includes `(Reactive)`.

**Pass if:** At least 5 reactive attribute variants appear with `:` prefix and `(Reactive)` label.

---

### TC-027: Reactive completions in JS template string

**Steps:**
1. In a `.js` template string, inside `<Element `, type `:` and wait for completions.

**Expected:** Same reactive attribute list as TC-026.

**Pass if:** Reactive attributes appear in the JS template context.

---

## 9. Template Completions — Event Handlers

### TC-028: Event handler completions triggered by `@` in `.blits` template

**Steps:**
1. In a `.blits` template, write `<Element ` and type `@`.
2. The completion list should appear (``@`` is a trigger character).

**Expected:** Event handler completions appear: `@loaded`, `@error`, `@updated`, `@longpress`.

**Pass if:** `@loaded`, `@error`, `@updated` all appear.

---

### TC-029: Selecting `@loaded` inserts a snippet with placeholder

**Steps:**
1. Trigger event completions as in TC-028.
2. Select `@loaded` from the list.

**Expected:** `@loaded="$methodName"` is inserted, with `$methodName` selected as a tab stop.

**Pass if:** The inserted text contains `@loaded="` followed by a placeholder.

---

## 10. Template Completions — Custom Component Props

### TC-030: Custom component props appear as completions

**Steps:**
1. In your JS or TS app, create (or open) a custom component that declares props. Example `MyButton.blits`:
   ```xml
   <template>
     <Element><Text :content="$label" /></Element>
   </template>
   <script>
   export default Blits.Component('MyButton', {
     props: [
       { key: 'label', cast: String, default: 'Click me' },
       { key: 'disabled', cast: Boolean, default: false },
     ]
   })
   </script>
   ```
2. In `main.js` or `App.blits`, import and register the component:
   ```js
   import MyButton from './MyButton.blits'
   // ...
   components: { MyButton }
   ```
3. In the template, write `<MyButton ` and trigger completions.

**Expected:** `label` and `disabled` appear in the completion list with detail showing `MyButton | label` and `MyButton | disabled`.

**Pass if:** At least one custom prop appears in the completion list.

---

### TC-031: Custom component documentation popup shows prop type and default

**Steps:**
1. Trigger completions as in TC-030.
2. Hover over the `label` completion item (do not select — just hover over it in the list).

**Expected:** A documentation popup appears showing:
- Type: `string` (or `String`)
- Default value: `'Click me'`
- Context: `Defined in component: MyButton`

**Pass if:** Type and default value are visible in the popup.

---

## 11. Template Completions — v1 vs v2 Attribute Sets

> For these tests, you need a v1 project (any existing app with `"@lightningjs/blits": "^1.x"`) and a v2 project (temporarily edit `package.json` to `"^2.0.0"` and reload the Extension Host).

### TC-032: v1 project — `effects` and `wordwrap` present

**Steps:**
1. In a v1 project `.blits` file, trigger `<Element ` completions.
2. Search the list for `effects`.
3. Trigger `<Text ` completions and search for `wordwrap`.

**Expected:** `effects` appears in `<Element>` completions; `wordwrap` appears in `<Text>` completions.

**Pass if:** Both attributes are found.

---

### TC-033: v1 project — `border`, `shadow`, `rounded`, `shader` absent

**Steps:**
1. In a v1 project, trigger `<Element ` completions.
2. Look for `border`, `shadow`, `rounded`, `shader` in the list.

**Expected:** None of these v2-only attributes appear.

**Pass if:** `border` is absent from the list.

---

### TC-034: v2 project — `border`, `shadow`, `rounded`, `shader` present

**Steps:**
1. Edit `package.json` of an app to `"@lightningjs/blits": "^2.0.0"`, save, and reload the Extension Host (or close and reopen the workspace).
2. In a `.blits` template, trigger `<Element ` completions.

**Expected:** `border`, `shadow`, `rounded`, `shader` appear in the completion list.

**Pass if:** At least `border` appears.

---

### TC-035: v2 project — `effects` absent

**Steps:**
1. Still in the v2 project from TC-034, trigger `<Element ` completions.
2. Look for `effects`.

**Expected:** `effects` does NOT appear (it was removed in v2).

**Pass if:** `effects` is absent from the list.

---

## 12. Completion Documentation Popups

### TC-036: Element attribute popup shows type, default value, and description

**Steps:**
1. In a `.blits` template, trigger `<Element ` completions.
2. Hover over `w` (or `x`) in the completion list — hold the cursor still on the item without pressing Enter.
3. Wait for the documentation side-panel or popup to appear.

**Expected:** A documentation popup shows:
- A TypeScript-style type block: `w: number | string = 0`
- A description like "The width of the Element in pixels (or percentage)..."
- A detail line like `Element | w`

**Pass if:** Type and description text are visible.

---

### TC-037: Built-in component popup shows rich documentation

**Steps:**
1. In a `.blits` template, type `<` to trigger component name completions.
2. Hover over `Layout` in the list.

**Expected:** A rich documentation popup appears showing:
- Description of Layout
- Key features list
- Example code block
- Attributes summary
- Events summary

**Pass if:** Example code and attribute descriptions are visible in the popup.

---

## 13. Script Completions

> All tests in this section require a `.blits` file with a `<script>` section open in a Blits project.

### TC-038: `Math.` completions in `.blits` script section

**Steps:**
1. Open a `.blits` file.
2. In the `<script>` section, add a new line:
   ```js
   const result = Math.
   ```
3. Position the cursor right after the dot and press Ctrl+Space.

**Expected:** Completions for `Math` methods and properties appear: `floor`, `ceil`, `round`, `random`, `abs`, `PI`, `max`, `min`, `sqrt`, etc.

**Pass if:** At least 5 Math methods appear.

---

### TC-039: `JSON.` completions in `.blits` script section

**Steps:**
1. In the `<script>` section, type `JSON.` and trigger completions.

**Expected:** `stringify`, `parse` appear.

**Pass if:** `stringify` and `parse` are present.

---

### TC-040: Array method completions in `.blits` script section

**Steps:**
1. In the `<script>` section, write:
   ```js
   const arr = []
   arr.
   ```
2. Position cursor after the dot and trigger completions.

**Expected:** Array instance methods appear: `filter`, `map`, `reduce`, `forEach`, `push`, `pop`, `find`, `includes`, etc.

**Pass if:** `filter`, `map`, `reduce` all appear.

---

### TC-041: Imported module completions in `.blits` script section

**Steps:**
1. In the `<script>` section of a `.blits` file that has a real import (e.g. the fixture `Button.blits` imports from `@/utils/math`), write:
   ```js
   import { MathUtils } from '@/utils/math'
   // then on a new line:
   MathUtils.
   ```
2. Trigger completions after the dot.

**Expected:** Methods from `MathUtils` appear (e.g. `distance`, `calculateAsync`, `createPoint`).

**Pass if:** At least one method from the imported module is visible.

---

### TC-042: Standard library completions in `.blits` `lang="ts"` script

**Steps:**
1. Open a `.blits` file with `<script lang="ts">`.
2. In the script section, type:
   ```ts
   const p = new Promise<string>((resolve) => {
     resolve.
   ```
3. Trigger completions after the dot.

**Expected:** `Promise` methods appear (`then`, `catch`, `finally`). TypeScript-aware completions are active.

**Pass if:** `then` and `catch` appear in the list.

---

## 14. Hover Provider

### TC-043: Hover over a symbol in `.blits` script section shows TypeScript info

**Steps:**
1. Open a `.blits` file with a `<script>` section.
2. In the script, write or ensure there is a variable with an inferred type:
   ```js
   const greeting = 'Hello, World'
   ```
3. Hover over `greeting`.

**Expected:** A hover popup appears with type information, e.g. `const greeting: string`.

**Pass if:** Hover popup shows the type of the variable.

---

### TC-044: Hover over imported function shows its signature

**Steps:**
1. In a `.blits` script section that imports a function with JSDoc or TypeScript types, hover over the function name in a call expression:
   ```js
   import { Helpers } from '@/utils/helpers'
   // ...
   const result = Helpers.calculateArea(10, 20)
   //                      ^^^^^^^^^^^^ hover here
   ```

**Expected:** A hover popup shows the function signature — name, parameters, return type.

**Pass if:** Function name and at least one parameter are visible in the popup.

---

### TC-045: Hover over `Math` shows built-in object info

**Steps:**
1. In a `.blits` script section, type `Math` and hover over it.

**Expected:** A hover popup appears describing the `Math` built-in object.

**Pass if:** Popup is non-empty and contains "Math" related content.

---

### TC-046: Hover works in `lang="ts"` script — TypeScript interface shown

**Steps:**
1. In a `.blits` file with `<script lang="ts">`, write:
   ```ts
   interface Config {
     width: number
     height: number
   }
   const c: Config = { width: 100, height: 200 }
   ```
2. Hover over `c`.

**Expected:** Popup shows `const c: Config`.

**Pass if:** The TypeScript-inferred type `Config` is shown.

---

### TC-047: No hover in `.blits` template section (template hover is not provided for attributes)

**Steps:**
1. In the `<template>` section of a `.blits` file, hover over the attribute `w` in `<Element w="1920" ...>`.

**Expected:** Either no popup appears, or a generic popup from the VS Code language feature (not extension-specific template attribute info — this is not currently implemented for the template hover, only script hover).

**Note:** This is a known gap, not a failure. Template attribute hover is not currently provided by the extension for `.blits` files (only for `.js`/`.ts` completion popups).

**Pass if:** No crash. Absence of popup is expected.

---

## 15. Diagnostics

### TC-048: Type error in `.blits` script section shows red squiggle

**Steps:**
1. Open a `.blits` file with `<script lang="ts">`.
2. Add an intentional type error:
   ```ts
   const x: number = 'this is not a number'
   ```
3. Wait 1–2 seconds.

**Expected:** `'this is not a number'` is underlined in red (or the line shows an error squiggle). The Problems panel (View → Problems) shows the TypeScript error.

**Pass if:** Red squiggle is visible on the erroneous line.

---

### TC-049: Undeclared variable shows error

**Steps:**
1. In a `.blits` `<script>` section, write:
   ```js
   console.log(undeclaredVariable)
   ```
2. Wait 1–2 seconds.

**Expected:** `undeclaredVariable` is underlined with an error diagnostic.

**Pass if:** Error squiggle appears.

---

### TC-050: Diagnostic updates in real-time when error is fixed

**Steps:**
1. Starting from TC-048 or TC-049 with an error visible.
2. Fix the error (e.g. change `'this is not a number'` to `42`).
3. Wait 1–2 seconds.

**Expected:** The red squiggle disappears after fixing the error.

**Pass if:** Squiggle is gone after correction. Problems panel clears the entry.

---

### TC-051: Valid `.blits` file has no error squiggles in script section

**Steps:**
1. Open a `.blits` file that has a clean, valid `<script>` section (no intentional errors).
2. Open the Problems panel and filter to the current file.

**Expected:** No error-level diagnostics from the Blits extension for this file.

**Pass if:** Problems panel shows 0 errors for the `.blits` file.

---

### TC-052: Closing a `.blits` file clears its diagnostics

**Steps:**
1. Open a `.blits` file with an error (from TC-048).
2. Confirm the error is visible in the Problems panel.
3. Close the file (`⌘W`).
4. Check the Problems panel.

**Expected:** The diagnostic for the closed file disappears from the Problems panel.

**Pass if:** Problems panel no longer lists errors for the closed file.

---

### TC-053: Script section without errors in a JS `.blits` file

**Steps:**
1. Open a `.blits` file with a plain `<script>` (no `lang="ts"`).
2. Write valid JavaScript:
   ```js
   export default {
     state() {
       return { count: 0 }
     }
   }
   ```
3. Wait for diagnostics.

**Expected:** No error squiggles in the script section.

**Pass if:** No diagnostics appear for valid JS in the script section.

---

## 16. Signature Help

### TC-054: Signature popup appears when typing inside a function call

**Steps:**
1. Open a `.blits` file with a `<script>` section.
2. Write a function call:
   ```js
   Math.max(
   ```
3. The cursor should be right after `(`. Do not press anything else.

**Expected:** A signature help popup appears showing `max(value1: number, value2: number, ...values: number[]): number` (or similar TypeScript signature for `Math.max`).

**Pass if:** Popup appears showing parameter names.

---

### TC-055: Active parameter highlight advances on `,`

**Steps:**
1. Continue from TC-054.
2. Type `10, ` (number, comma, space).

**Expected:** The second parameter is now highlighted/active in the signature popup.

**Pass if:** Active parameter indicator has moved to the second parameter.

---

## 17. Advanced Language Features

### TC-056: Go to Definition works in `.blits` script section

**Steps:**
1. In a `.blits` script section with an import:
   ```js
   import { Helpers } from '@/utils/helpers'
   ```
2. Hold Ctrl (or Cmd on Mac) and click on `Helpers`.

**Expected:** VS Code navigates to the definition of `Helpers` in the `helpers.js` file.

**Pass if:** Editor jumps to the declaration of `Helpers`.

---

### TC-057: Find All References works in `.blits` script

**Steps:**
1. In a `.blits` script section, define a simple function:
   ```js
   function greet() { return 'hi' }
   greet()
   ```
2. Right-click on `greet` (the definition) → **Find All References**.

**Expected:** A references panel appears showing at least 2 references: the definition and the call site.

**Pass if:** At least 2 references are shown.

---

### TC-058: Rename Symbol works in `.blits` script

**Steps:**
1. In a `.blits` script section with:
   ```js
   const myVar = 42
   console.log(myVar)
   ```
2. Right-click on `myVar` → **Rename Symbol**.
3. Type `renamedVar` and press Enter.

**Expected:** Both occurrences of `myVar` are renamed to `renamedVar`.

**Pass if:** Both the declaration and the usage are renamed.

---

### TC-059: Document Symbols available for `.blits` file

**Steps:**
1. Open a `.blits` file.
2. Press `⌘P`, then type `@` (Go to Symbol in File).

**Expected:** A list of symbols from the script section appears (functions, variables, exported names).

**Pass if:** At least one symbol from the script section is listed.

---

## 18. Comment Command (`⌘/` / `Ctrl+/`)

### TC-060: `.blits` template section — adds HTML comment

**Steps:**
1. Open a `.blits` file.
2. Place the cursor on a line inside `<template>` that contains an element, e.g.:
   ```
       <Element w="1920" h="1080" />
   ```
3. Press `⌘/`.

**Expected:** The line becomes:
```
    <!-- <Element w="1920" h="1080" /> -->
```
The original content is wrapped in `<!-- ... -->`.

**Pass if:** Line is wrapped in `<!-- ... -->` (HTML comment style, not `//`).

---

### TC-061: `.blits` template section — toggle removes HTML comment

**Steps:**
1. Continue from TC-060 (line is now commented with `<!-- ... -->`).
2. Keep the cursor on the same line and press `⌘/` again.

**Expected:** The comment is removed and the original line is restored.

**Pass if:** Line returns to `<Element w="1920" h="1080" />` (unwrapped).

---

### TC-062: `.blits` script section — adds JS-style comment

**Steps:**
1. Place the cursor on a line inside `<script>` that contains code, e.g.:
   ```
     const x = 1
   ```
2. Press `⌘/`.

**Expected:** The line becomes:
```
    // const x = 1
```
(JS-style line comment, not HTML comment)

**Pass if:** Line starts with `//`.

---

### TC-063: `.blits` script section — toggle removes JS comment

**Steps:**
1. Continue from TC-062 (line starts with `//`).
2. Press `⌘/` again.

**Expected:** The `//` is removed, restoring `const x = 1`.

**Pass if:** `//` prefix is gone.

---

### TC-064: `.js` file inside template string — uses HTML comment

**Steps:**
1. Open a `.js` file. Position cursor inside a `template: \`...\`` backtick string on a line with a Blits element.
2. Press `⌘/`.

**Expected:** Line is wrapped with `<!-- ... -->` (HTML comment, because cursor is in a Blits template context).

**Pass if:** HTML comment style is used.

---

### TC-065: `.js` file outside template string — uses JS comment

**Steps:**
1. Open a `.js` file. Position cursor on a line of regular JavaScript code (outside any template string).
2. Press `⌘/`.

**Expected:** Line is commented with `//` (standard JS comment).

**Pass if:** `//` style is used.

---

### TC-066: Multi-line selection — all lines commented

**Steps:**
1. In a `.blits` template section, select 3 consecutive lines containing elements.
2. Press `⌘/`.

**Expected:** All 3 lines are each individually wrapped in `<!-- ... -->`.

**Pass if:** 3 separate `<!-- ... -->` comments are visible.

---

## 19. Auto-format on Save

> For these tests, ensure `"blits.autoFormat": true` is set in VS Code settings (this is the default). The extension must format `.js`, `.ts`, and `.blits` files that belong to a detected Blits project.

### TC-067: Template block in `.blits` file formatted on save

**Steps:**
1. Open a `.blits` file and write a deliberately messy template (inconsistent indentation, attributes bunched together):
   ```xml
   <template>
   <Element w="1920" h="1080"    color="#000000"     x="0"  y="0">
   <Text content="Hello"    x="100"    y="50"   color="#fff" />
   </Element>
   </template>
   ```
2. Press `⌘S` to save.

**Expected:** The template is reformatted — consistent indentation (2 spaces), attributes normalized, extra whitespace removed.

**Pass if:** Template is visibly reformatted on save.

---

### TC-068: Script section in `.blits` file formatted on save

**Steps:**
1. In the `<script>` section of a `.blits` file, write messy JS:
   ```js
   export default {state(){return{count:0,name:   'test'}},methods:{doThing(){return this.count+1}}}
   ```
2. Press `⌘S`.

**Expected:** The script section is reformatted with proper indentation and line breaks.

**Pass if:** Script section is readable and properly indented after save.

---

### TC-069: Template string in `.js` file formatted on save

**Steps:**
1. Open a `.js` file in a Blits project. Write a messy template string:
   ```js
   template: `<Element w="1920"    h="1080" color="#000000"    x="0"   y="0"><Text content="Hello"  /></Element>`,
   ```
2. Press `⌘S`.

**Expected:** The template string content is reformatted — elements properly indented, one attribute per line if needed.

**Pass if:** Template string content is reformatted.

---

### TC-070: `blits.autoFormat: false` — formatting does NOT run on save

**Steps:**
1. Open VS Code Settings (⌘,).
2. Search for `blits.autoFormat` and set it to `false`.
3. Open a `.blits` file with messy template (as in TC-067).
4. Press `⌘S`.

**Expected:** The file is saved but NOT reformatted. The messy content remains exactly as typed.

**Pass if:** No formatting occurs on save.

5. Reset `blits.autoFormat` back to `true` when done.

---

### TC-071: Format skipped when `prettier-plugin-blits` is in `package.json`

**Steps:**
1. Temporarily add the following to your project's `package.json` devDependencies:
   ```json
   "@lightningjs/prettier-plugin-blits": "^0.1.0"
   ```
2. Save the `package.json` (this triggers the extension's project watcher).
3. Wait 1 second, then open a `.blits` file with a messy template.
4. Press `⌘S`.

**Expected:** The extension's built-in formatter does NOT run (it defers to the Prettier plugin). The file is saved without reformatting. Check the Output → Extension Host log for `Skipping template formatting as @lightningjs/prettier-plugin-blits is detected`.

**Pass if:** Log message appears and file is not reformatted by the extension.

5. Remove the `prettier-plugin-blits` entry from `package.json` when done.

---

### TC-072: Format error shown as diagnostic when template is unparseable

**Steps:**
1. In a `.js` file inside the template string, write malformed HTML that cannot be parsed by Prettier:
   ```js
   template: `<Element w="1920" <invalid> />`,
   ```
2. Press `⌘S`.

**Expected:** A red diagnostic marker appears on the malformed template range in the Problems panel or inline. The document is NOT partially formatted.

**Pass if:** An error diagnostic is produced for the template formatting failure.

---

## 20. Format Settings

> Each test in this section requires changing a setting, saving a `.blits` file, and checking the result. Reset settings to defaults after each test.

### TC-073: `blits.format.tabWidth: 4` — template uses 4-space indentation

**Steps:**
1. Set `blits.format.tabWidth` to `4`.
2. Open a `.blits` file with a nested template and save it.

**Expected:** Template content is indented with 4 spaces per level.

**Pass if:** Indentation is 4 spaces, not 2.

---

### TC-074: `blits.format.useTabs: true` — template uses tabs

**Steps:**
1. Set `blits.format.useTabs` to `true`.
2. Save a `.blits` file.

**Expected:** Template is indented with tab characters (visible as wider indentation).

**Pass if:** Indentation uses tab characters (check with View → Render Whitespace if needed).

---

### TC-075: `blits.format.singleAttributePerLine: true` — each attribute on its own line

**Steps:**
1. Set `blits.format.singleAttributePerLine` to `true`.
2. Open a `.blits` file with an element that has multiple attributes on one line:
   ```xml
   <Element w="1920" h="1080" color="#000" />
   ```
3. Save.

**Expected:** Each attribute is placed on its own line:
```xml
<Element
  w="1920"
  h="1080"
  color="#000"
/>
```

**Pass if:** Attributes are on separate lines.

---

### TC-076: `blits.format.bracketSameLine: true` — closing `>` stays on last attribute line

**Steps:**
1. Set `blits.format.bracketSameLine` to `true` and `singleAttributePerLine` to `true`.
2. Save a `.blits` file with a multi-attribute element.

**Expected:** The closing `>` or `/>` is placed on the same line as the last attribute, not on its own line.

**Pass if:** No standalone `>` line — closing bracket is on the last attribute line.

---

### TC-077: `blits.format.semi: true` — script section statements end with `;`

**Steps:**
1. Set `blits.format.semi` to `true`.
2. Save a `.blits` file with script content (no semicolons).

**Expected:** Script section statements end with `;` after save.

**Pass if:** Semicolons appear at end of statements in the script section.

---

## 21. File Template Provider

### TC-078: New empty `.blits` file auto-inserts boilerplate

**Steps:**
1. In a Blits project, create a new file named `MyWidget.blits` (e.g. via right-click → New File in the Explorer).
2. The file opens automatically (or open it manually).

**Expected:** The file is NOT empty. It contains the boilerplate template:
```xml
<template>
  <!-- component template here -->
</template>

<script>

import Blits from '@lightningjs/blits'

export default Blits.Component('MyWidget', {
  state() {
    return {
      // state variables
    }
  },
  hooks: {
    ready() {

      // Component is ready for interaction
    }
  },
})
</script>
```

**Pass if:** Boilerplate is present and the component name `MyWidget` is correctly derived from the filename (PascalCase).

---

### TC-079: Component name is correctly derived from filename

**Steps:**
1. Create `my-cool-widget.blits`.

**Expected:** The inserted template uses `Blits.Component('MyCoolWidget', ...)` — kebab-case filename converted to PascalCase.

**Pass if:** Component name is `MyCoolWidget`.

---

### TC-080: Non-empty `.blits` file is NOT overwritten

**Steps:**
1. Create a `.blits` file with some existing content (e.g. using the snippet or typing manually).
2. Close and reopen the file.

**Expected:** The existing content is preserved — the file template auto-insert only runs on empty files.

**Pass if:** Existing content remains unchanged.

---

## 22. Snippets — `.blits` Files

> Snippets are triggered by typing the prefix and pressing Tab (or selecting from the completion list).

### TC-081: `blits-file` snippet inserts full `.blits` component skeleton

**Steps:**
1. Open an empty `.blits` file (or create one that already has the boilerplate and clear it).
2. Type `blits-file` and press Tab (or select from the completion dropdown).

**Expected:** The full component skeleton is inserted with:
- `<template>` and `</template>` sections
- `<script>` section with `import Blits from '@lightningjs/blits'`
- `Blits.Component('ComponentName', { state(), hooks: { ready() {} } })`
- Cursor positioned at the template placeholder (first tab stop)

**Pass if:** Full skeleton is inserted and the component name tab stop is active for editing.

---

### TC-082: `blits-attribute-transition` snippet in `.blits` template

**Steps:**
1. In a `.blits` template, inside a tag, type `blits-attribute-transition` and press Tab.

**Expected:** A transition snippet is inserted with:
- An attribute choice list (x, y, alpha, rotation, scale, color, w, h)
- Duration, easing, and delay tab stops

Example output after choosing `:color`:
```
:color.transition="{value: $colorValue, duration: 300, easing: 'ease-in', delay: 0}"
```

**Pass if:** Snippet is inserted with tab stops for each field.

---

## 23. Snippets — JS/TS Files

### TC-083: `blits-component` snippet in `.js` file

**Steps:**
1. Open an empty `.js` file.
2. Type `blits-component` and press Tab.

**Expected:** Full Blits component skeleton inserted:
```js
import Blits from '@lightningjs/blits'

export default Blits.Component('ComponentName', {
  template: `
    <Element> </Element>
  `,
  state() {
    return {
      // state variables
    }
  },
  hooks: {
    ready() {
      // Component is ready for interaction
    },
  },
})
```
First tab stop should be at the component name.

**Pass if:** Full skeleton inserted with active tab stop at component name.

---

### TC-084: `blits-input` snippet — input handler with key choice list

**Steps:**
1. Inside a `Blits.Component({})` body in a `.js` file, type `blits-input` and press Tab.

**Expected:** Input handler inserted with:
- A choice list for the key: `left`, `right`, `up`, `down`, `enter`, `back`, `space`, `any`
- An event parameter `e`
- Two handlers with choice lists (allowing you to select a second key)

**Pass if:** Snippet inserts with a dropdown choice list for the key name.

---

### TC-085: `blits-input-block` snippet — full input block

**Steps:**
1. Type `blits-input-block` and press Tab.

**Expected:** Full `input: { up(), down(), left(), right(), enter(), back(), any() }` block inserted with tab stops for each handler body.

**Pass if:** All common key handlers are present.

---

### TC-086: `blits-hooks` snippet — single lifecycle hook with choice list

**Steps:**
1. Type `blits-hooks` and press Tab.

**Expected:** `hooks: { hookName() {} }` inserted with a choice list for the hook: `init`, `ready`, `focus`, `unfocus`, `destroy`.

**Pass if:** Choice list is active for selecting the hook name.

---

### TC-087: `blits-hooks-block` snippet — all lifecycle hooks

**Steps:**
1. Type `blits-hooks-block` and press Tab.

**Expected:** Full `hooks: { init(), ready(), focus(), unfocus(), destroy() }` block inserted with tab stops for each body.

**Pass if:** All 5 lifecycle hooks are present.

---

### TC-088: `blits-attribute-transition` snippet in `.js`/`.ts` file

**Steps:**
1. Inside a template string in a `.js` file, type `blits-attribute-transition` and press Tab.

**Expected:** Same transition snippet as TC-082 — attribute choice list, duration, easing, delay tab stops.

**Pass if:** Snippet inserts correctly inside a JS template string context.

---

## 24. Language Configuration — `.blits` Files

> These tests verify VS Code editor behavior for `.blits` files configured via `blits-language-configuration.json`.

### TC-089: Auto-closing pairs — `<` closes to `>`

**Steps:**
1. Open a `.blits` file.
2. In the `<template>` section, on a new line, type `<` (angle bracket).

**Expected:** VS Code auto-inserts the closing `>`, resulting in `<>` with the cursor between them.

**Pass if:** `>` is auto-inserted.

---

### TC-090: Auto-closing pairs — `<!--` closes to ` -->`

**Steps:**
1. In the `<template>` section of a `.blits` file, type `<!--`.

**Expected:** VS Code auto-completes to `<!--  -->` with the cursor positioned inside.

**Pass if:** ` -->` is auto-inserted after typing `<!--`.

---

### TC-091: Auto-closing pairs — `{` closes in script section

**Steps:**
1. In the `<script>` section of a `.blits` file, type `{`.

**Expected:** `}` is automatically inserted.

**Pass if:** `}` appears.

---

### TC-092: Code folding — `<template>` block can be collapsed

**Steps:**
1. Open a `.blits` file with multiple lines in `<template>`.
2. Click the fold/collapse arrow (▼) in the gutter next to the `<template>` line.

**Expected:** The entire `<template>...</template>` block collapses to a single line showing `<template>...</template>` or similar.

**Pass if:** Block collapses and an expand arrow (▶) appears.

---

### TC-093: Code folding — `<script>` block can be collapsed

**Steps:**
1. Click the fold arrow next to `<script>`.

**Expected:** The `<script>...</script>` block collapses.

**Pass if:** Block collapses.

---

## 25. Workspace Detection

### TC-094: Extension features are active in a detected Blits project

**Steps:**
1. Open a `.js` or `.blits` file in a project with `"@lightningjs/blits"` in `package.json`.
2. Open a `.js` file and inside a `Blits.Component()` template string, type `<` and trigger completions.

**Expected:** Blits completions (Element, Text, Layout, RouterView) appear.

**Pass if:** Completions appear — extension recognized the project.

---

### TC-095: Extension features are NOT active in a non-Blits project

**Steps:**
1. Open a plain JavaScript project that does NOT have `@lightningjs/blits` in `package.json`.
2. In any `.js` file, type `<` inside a template literal and trigger completions.

**Expected:** No Blits-specific completions appear (Element, Text, Layout are absent). Standard VS Code completions (HTML snippets, etc.) may appear, but not Blits elements.

**Pass if:** Blits component names are absent from the list.

---

### TC-096: Project watcher — adding Blits dependency activates the extension

**Steps:**
1. Open a non-Blits project (no `@lightningjs/blits` in `package.json`).
2. Confirm Blits completions are absent (TC-095).
3. Add `"@lightningjs/blits": "^1.48.0"` to the `dependencies` in `package.json` and save the file.
4. Wait 1 second, then try triggering Blits completions in a `.js` template string.

**Expected:** After saving `package.json`, the extension detects the new Blits project and Blits completions become available without reloading VS Code.

**Pass if:** Blits completions appear after adding the dependency and waiting.

---

### TC-097: Version detection — v1 and v2 use different attribute sets

**Steps:**
1. In a project with `"@lightningjs/blits": "^1.48.0"`, trigger `<Element ` completions. Confirm `effects` is present (v1).
2. Change the version in `package.json` to `"^2.0.0"` and save.
3. Reload the Extension Host window (`⌘R` in the debug host, or close and re-open the workspace folder).
4. Trigger `<Element ` completions again.

**Expected:** After switching to v2, `border` appears and `effects` is absent.

**Pass if:** Attribute set changes reflect the version declared in `package.json`.

---

## Quick Reference: Extension Settings

| Setting | Type | Default | What it controls |
|---|---|---|---|
| `blits.autoFormat` | boolean | `true` | Enable/disable template formatting on save |
| `blits.format.printWidth` | number | `120` | Line wrap column |
| `blits.format.tabWidth` | number | `2` | Indentation size |
| `blits.format.useTabs` | boolean | `false` | Tabs vs spaces |
| `blits.format.semi` | boolean | `false` | Semicolons at end of statements |
| `blits.format.singleQuote` | boolean | `true` | Single vs double quotes |
| `blits.format.quoteProps` | enum | `as-needed` | When to quote object keys |
| `blits.format.trailingComma` | enum | `all` | Trailing commas |
| `blits.format.bracketSpacing` | boolean | `true` | Spaces in `{ key: val }` |
| `blits.format.bracketSameLine` | boolean | `false` | `>` on same line as last attr |
| `blits.format.arrowParens` | enum | `always` | Parens around arrow params |
| `blits.format.singleAttributePerLine` | boolean | `false` | One attribute per line |

---

## Quick Reference: Snippets

| Prefix | File type | Description |
|---|---|---|
| `blits-file` | `.blits` | Full `<template>` + `<script>` skeleton |
| `blits-attribute-transition` | `.blits` | Attribute transition with easing |
| `blits-component` | `.js` / `.ts` | Full `Blits.Component(...)` skeleton |
| `blits-input` | `.js` / `.ts` | Single input handler with key choice |
| `blits-input-block` | `.js` / `.ts` | Full input block (all keys) |
| `blits-hooks` | `.js` / `.ts` | Single lifecycle hook with choice |
| `blits-hooks-block` | `.js` / `.ts` | All 5 lifecycle hooks |
| `blits-attribute-transition` | `.js` / `.ts` | Attribute transition with easing |

---

## Quick Reference: Valid Event Names

Only these event names are valid for `@event` handlers in Blits templates:

| Event | Applicable to |
|---|---|
| `@loaded` | Element, Text, Layout |
| `@error` | Element |
| `@updated` | Layout |
| `@longpress` | Element |

All other event names (`@click`, `@focus`, `@keypress`, `@mouseenter`, etc.) are **invalid** in Blits templates and will appear highlighted in red by the grammar.

---

*Last updated: 2026-03-25*
*Task: V-026*
