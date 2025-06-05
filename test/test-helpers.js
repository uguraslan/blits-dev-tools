const mock = require('mock-require');

class Position {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
}

class Range {
  constructor(startLine, startChar, endLine, endChar) {
    if (startLine instanceof Position) {
      this.start = startLine;
      this.end = startChar; // if passed Position objects
    } else {
      this.start = new Position(startLine, startChar);
      this.end = new Position(endLine, endChar);
    }
  }
}

class TextEdit {
  constructor(range, newText) {
    this.range = range;
    this.newText = newText;
  }
}

class Diagnostic {
  constructor(range, message, severity) {
    this.range = range;
    this.message = message;
    this.severity = severity;
    this.source = undefined;
  }
}

const DiagnosticSeverity = { Error: 0, Warning: 1, Information: 2 };

class CompletionItem {
  constructor(label, kind) {
    this.label = label;
    this.kind = kind;
    this.insertText = undefined;
    this.sortText = undefined;
    this.detail = undefined;
    this.documentation = undefined;
  }
}

class SnippetString {
  constructor(value) {
    this.value = value;
  }
}

class MarkdownString {
  constructor(value = '') {
    this.value = value;
    this.isTrusted = false;
  }

  appendMarkdown(text) {
    this.value += text;
  }

  appendCodeblock(text, _lang) {
    this.value += text;
  }
}

const CompletionItemKind = { Property: 0 };

class MockDocument {
  constructor(text, languageId = 'javascript', uri = '/file.js') {
    this._text = text;
    this.languageId = languageId;
    this.uri = { fsPath: uri, path: uri };
  }

  getText(range) {
    if (!range) return this._text;
    const start = this.offsetAt(range.start);
    const end = this.offsetAt(range.end);
    return this._text.slice(start, end);
  }

  lineAt(lineOrPos) {
    const line = typeof lineOrPos === 'number' ? lineOrPos : lineOrPos.line;
    const textLine = this._text.split('\n')[line] || '';
    return { text: textLine };
  }

  offsetAt(position) {
    const lines = this._text.split('\n');
    let offset = 0;
    for (let i = 0; i < position.line; i++) {
      offset += lines[i].length + 1; // plus newline
    }
    return offset + position.character;
  }

  positionAt(offset) {
    const lines = this._text.split('\n');
    let running = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length + 1;
      if (offset < running + lineLen) {
        return new Position(i, offset - running);
      }
      running += lineLen;
    }
    return new Position(lines.length - 1, lines[lines.length - 1].length);
  }
}

function setupVSCodeMock() {
  const vscode = {
    Range,
    Position,
    TextEdit,
    CompletionItem,
    CompletionItemKind,
    SnippetString,
    MarkdownString,
    Diagnostic,
    DiagnosticSeverity,
    workspace: {
      getConfiguration: () => ({ get: () => undefined }),
      workspaceFolders: null,
      createFileSystemWatcher: () => ({
        onDidChange: () => {},
        onDidCreate: () => {},
        onDidDelete: () => {},
        dispose: () => {},
      }),
      onDidChangeTextDocument: () => {},
      onDidOpenTextDocument: () => {},
      onWillSaveTextDocument: () => ({ dispose: () => {} }),
    },
    window: {
      activeTextEditor: null,
      showInformationMessage: () => {},
      showErrorMessage: () => {},
    },
    languages: {
      registerCompletionItemProvider: () => ({}),
      createDiagnosticCollection: () => ({ set: () => {}, delete: () => {} })
    },
    commands: {
      registerCommand: () => ({}),
      executeCommand: () => Promise.resolve(),
    },
  };
  mock('vscode', vscode);
  return {
    vscode,
    Position,
    Range,
    MockDocument,
    CompletionItem,
    SnippetString,
    MarkdownString,
    CompletionItemKind,
  };
}

module.exports = {
  setupVSCodeMock,
  Position,
  Range,
  TextEdit,
  Diagnostic,
  DiagnosticSeverity,
  MockDocument,
  CompletionItem,
  SnippetString,
  MarkdownString,
  CompletionItemKind,
};
