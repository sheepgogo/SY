/* =====================================================================
 * python-transpiler.js
 * A small educational subset Python -> JavaScript transpiler.
 *
 * Supports:
 *  - imports (stripped)
 *  - assignments (chained), augmented assigns (+=, -=, *=, /=)
 *  - method calls on objects (t.forward(100))
 *  - function calls (range, print, abs, int, round, len, min, max, sum)
 *  - for / while loops
 *  - if / elif / else
 *  - print() with comma -> space-separated output
 *  - turtle-aliased names (any var with .forward/.left/.right/.goto etc)
 *
 * Output: a transpiled JS string ready to be eval()'d or Function()'d
 *         inside a closure that receives the user's variables as locals.
 * ===================================================================== */
(function (global) {
  'use strict';

  // ----- Tokenizer -----
  const KEYWORDS = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
    'self', 'int', 'float', 'str', 'list', 'dict', 'tuple', 'set', 'len',
    'range', 'print', 'round', 'abs', 'min', 'max', 'sum', 'sorted'
  ]);

  function tokenize(code) {
    const tokens = [];
    let i = 0;
    const n = code.length;
    const lineStarts = [0];
    while (i < n) {
      const c = code[i];
      // Newline
      if (c === '\n') {
        tokens.push({ type: 'NEWLINE', value: '\n', line: tokens.length });
        i++;
        continue;
      }
      // Whitespace
      if (/\s/.test(c)) { i++; continue; }
      // Comments
      if (c === '#') {
        while (i < n && code[i] !== '\n') i++;
        continue;
      }
      // Numbers (int / float, optional sign)
      if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(code[i + 1] || ''))) {
        let start = i;
        if (c === '-') i++;
        while (i < n && /[0-9.]/.test(code[i])) i++;
        tokens.push({ type: 'NUMBER', value: code.slice(start, i) });
        continue;
      }
      // Strings
      if (c === '"' || c === '\'') {
        const quote = c;
        let start = i; i++;
        while (i < n && code[i] !== quote) {
          if (code[i] === '\\' && i + 1 < n) i += 2;
          else i++;
        }
        i++; // closing
        tokens.push({ type: 'STRING', value: code.slice(start, i) });
        continue;
      }
      // Identifiers / keywords
      if (/[A-Za-z_]/.test(c)) {
        let start = i;
        while (i < n && /[A-Za-z0-9_]/.test(code[i])) i++;
        const value = code.slice(start, i);
        tokens.push({
          type: KEYWORDS.has(value) ? 'KEYWORD' : 'NAME',
          value
        });
        continue;
      }
      // Operators / punctuation
      const three = code.slice(i, i + 3);
      if (three === '...' ) { tokens.push({ type: 'OP', value: '...' }); i += 3; continue; }
      const two = code.slice(i, i + 2);
      if (['==', '!=', '<=', '>=', '**', '//', '+=', '-=', '*=', '/='].includes(two)) {
        tokens.push({ type: 'OP', value: two }); i += 2; continue;
      }
      if ('+-*/%<>=()[]{}:,.@'.indexOf(c) !== -1) {
        tokens.push({ type: 'OP', value: c }); i++; continue;
      }
      // Skip unknown
      i++;
    }
    tokens.push({ type: 'END', value: '' });
    return tokens;
  }

  // ----- Indentation-aware chunker -----
  // Splits tokens into blocks honoring indentation (INDENT/DEDENT).
  function groupByIndent(tokens) {
    const out = [];
    let pos = 0;

    function readStatement() {
      const start = pos;
      while (pos < tokens.length && tokens[pos].type !== 'NEWLINE' && tokens[pos].type !== 'END') pos++;
      const stmt = tokens.slice(start, pos);
      // Consume newline
      while (pos < tokens.length && tokens[pos].type === 'NEWLINE') pos++;
      return stmt;
    }

    function indentOf(tokens) {
      // Compute visual indent of token list (count leading SPACE / TAB)
      let n = 0;
      while (n < tokens.length) {
        const t = tokens[n];
        if (t.type === 'NEWLINE') { n++; continue; }
        return t.value;
      }
      return '';
    }

    function isCommentLine(stmt) { return stmt.length === 0; }

    function leadingIndent() {
      // Find first non-newline token's raw distance from last newline.
      let n = pos;
      while (n < tokens.length && tokens[n].type === 'NEWLINE') n++;
      if (n >= tokens.length) return null;
      const tok = tokens[n];
      return tok.value;
    }

    function blockOf(indentLevel) {
      const block = [];
      while (pos < tokens.length) {
        // skip blank lines at block start
        while (pos < tokens.length && (tokens[pos].type === 'NEWLINE')) pos++;
        if (pos >= tokens.length) break;
        const lead = leadingIndent();
        if (lead == null) break;
        if (lead.length < indentLevel) break;
        // Capture stmt
        const stmtPos = pos;
        const stmtStart = pos + lead.length;
        // Reset pos to skip leading whitespace marker (we lose indent textual info)
        pos = stmtStart;
        const stmt = readStatement();
        if (stmt.length === 0) {
          // blank line — skip
          continue;
        }
        // For compound statements, expect a colon and read following indented block.
        const last = stmt[stmt.length - 1];
        if (last && last.type === 'OP' && last.value === ':') {
          const subIndent = stmtStart + 1; // sub-block indent is one more space ideally — we model it as next-block
          // We use relative indentation: next block must have strictly more leading whitespace.
          // For simplicity: sub-block indent = leadingIndent() of next stmt
          const bl = [];
          while (pos < tokens.length) {
            while (pos < tokens.length && tokens[pos].type === 'NEWLINE') pos++;
            if (pos >= tokens.length) break;
            const subLead = leadingIndent();
            if (subLead == null) break;
            if (subLead.length <= lead.length) break;
            bl.push(blockOf(subLead.length));
          }
          block.push({ type: 'compound', head: stmt, body: bl });
        } else {
          block.push({ type: 'simple', tokens: stmt });
        }
      }
      return block;
    }

    return blockOf(0);
  }

  // Alternative simpler parser: produces lines + nested blocks.
  // To keep complexity manageable, we'll use a 2-pass approach:
  // pass 1: compute indentation levels using a stack
  // pass 2: walk an indentation tree to emit JS

  // ----- Simple line-oriented parser -----
  function linesToBlocks(code) {
    const lines = code.split('\n');
    const items = [];
    for (const raw of lines) {
      if (raw.trim() === '' || raw.trim().startsWith('#')) {
        // blank or comment -> skipped at top level
        continue;
      }
      const m = raw.match(/^(\s*)(.*)$/);
      items.push({ indent: m[1].replace(/\t/g, '    ').length, text: m[2] });
    }
    return buildBlocks(items, 0);
  }

  function buildBlocks(items, baseIndent) {
    const out = [];
    let i = 0;
    while (i < items.length) {
      const it = items[i];
      if (it.indent < baseIndent) return out;
      if (it.indent > baseIndent) return out; // should not happen if baseIndent matched

      const head = it.text;
      const tokens = tokenize(head);
      // tokenize always appends an END sentinel — peek just before it.
      let lastNonEnd = tokens.length - 1;
      while (lastNonEnd >= 0 && tokens[lastNonEnd].type === 'END') lastNonEnd--;
      const lastTok = lastNonEnd >= 0 ? tokens[lastNonEnd] : null;
      if (lastTok && lastTok.type === 'OP' && lastTok.value === ':') {
        // Compound statement
        const compound = { type: 'compound', head, body: [] };
        i++;
        // Find first sub-item with indent > baseIndent
        if (i < items.length) {
          const subIndent = items[i].indent;
          // skip blank/outer blocks
          while (i < items.length && items[i].indent === baseIndent) i++; // shouldn't happen
          const sub = [];
          while (i < items.length && items[i].indent > baseIndent) {
            sub.push(items[i]);
            i++;
          }
          compound.body = buildBlocks(sub, subIndent);
        }
        out.push(compound);
      } else {
        out.push({ type: 'simple', text: head });
        i++;
      }
    }
    return out;
  }

  // ----- Code generator -----
  // We generate JS by walking the block tree.
  // Variables are kept in scope with `vars` registry.

  // Replace `turtle.X(...)` etc with `Turtle.X(...)`
  // Strip a Python trailing comment (# ...), but only when it appears
  // OUTSIDE of a string literal — otherwise we'd corrupt strings that
  // legitimately contain '#'.
  function stripComment(s) {
    let out = '';
    let inStr = null;
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (inStr) {
        out += c;
        if (c === '\\') { out += s[i + 1] || ''; i += 2; continue; }
        if (c === inStr) inStr = null;
        i++;
      } else {
        if (c === '#') break;
        if (c === '"' || c === "'") { inStr = c; out += c; i++; }
        else { out += c; i++; }
      }
    }
    return out.trim();
  }

  function emitExpression(expr) {
    let s = stripComment(expr);
    s = s.trim();

    // strip python f-strings (basic) — treat as regular string
    s = s.replace(/f(["'])(.*?)\1/g, '$1$2$1');

    // turtle.Turtle() -> __mkTurtle()
    s = s.replace(/turtle\s*\.\s*Turtle\s*\(\s*\)/g, '__mkTurtle()');

    // turtle.<module>.<method>() like turtle.bgcolor => Turtle.bgcolor
    s = s.replace(/turtle\s*\.\s*([a-zA-Z_]\w*)/g, '__turtle.$1');

    // range(...) -> __range(...)
    s = s.replace(/\brange\s*\(/g, '__range(');

    // print(...) -> __print(...)
    s = s.replace(/\bprint\s*\(/g, '__print(');

    // Built-in functions
    s = s.replace(/\bint\s*\(/g, '__int(');
    s = s.replace(/\bfloat\s*\(/g, '__float(');
    s = s.replace(/\bstr\s*\(/g, '__str(');
    s = s.replace(/\blen\s*\(/g, '__len(');
    s = s.replace(/\bround\s*\(/g, '__round(');
    s = s.replace(/\babs\s*\(/g, '__abs(');
    s = s.replace(/\bmin\s*\(/g, '__min(');
    s = s.replace(/\bmax\s*\(/g, '__max(');
    s = s.replace(/\bsum\s*\(/g, '__sum(');
    s = s.replace(/\bsorted\s*\(/g, '__sorted(');

    // True / False / None
    s = s.replace(/\bTrue\b/g, 'true');
    s = s.replace(/\bFalse\b/g, 'false');
    s = s.replace(/\bNone\b/g, 'null');

    // 'and' / 'or' / 'not'
    s = s.replace(/\bnot\b/g, '!');
    s = s.replace(/\band\b/g, '&&');
    s = s.replace(/\bor\b/g, '||');

    return s;
  }

  function emitStatement(line) {
    // Augmented assignment: a += b, a -= b, etc.
    const augMatch = line.match(/^([A-Za-z_]\w*)\s*(\+=|-=|\*=|\/=|%=)\s*(.+)$/);
    if (augMatch) {
      return `${augMatch[1]} ${augMatch[2]} ${emitExpression(augMatch[3])};`;
    }
    // Assignment: a = b  (allow multiple via commas)
    const assignMatch = line.match(/^([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)\s*=\s*(.+)$/);
    if (assignMatch && !/^(==|!=|<=|>=)/.test(line)) {
      // Disambiguate: must not be == comparison
      const rhs = assignMatch[1];
      const expr = assignMatch[2];
      const targets = rhs.split(',').map(s => s.trim());
      // Use `var` so re-declaration across branches is legal; `new Function` is
      // strict by default, so undeclared assignment would throw.
      return `var ${targets.join(' = ')} = ${emitExpression(expr)};`;
    }
    // Expression statement
    return `${emitExpression(line).replace(/;$/, '')};`;
  }

  function emitBlock(blocks, indent) {
    const pad = '    '.repeat(indent);
    const out = [];
    for (const b of blocks) {
      if (b.type === 'simple') {
        out.push(pad + emitStatement(b.text));
      } else if (b.type === 'compound') {
        const head = b.head;
        if (/^def\s/.test(head)) {
          // def name(...):
          const m = head.match(/^def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:\s*$/);
          if (m) {
            const params = m[2].split(',').map(s => s.trim()).filter(Boolean);
            out.push(`${pad}function ${m[1]}(${params.join(', ')}) {`);
            out.push(...emitBlock(b.body, indent + 1));
            out.push(`${pad}}`);
            continue;
          }
        }
        if (/^for\s/.test(head)) {
          // for var in range(...):
          const m = head.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\s*\(([^)]*)\)\s*:\s*$/);
          if (m) {
            const loopVar = m[1];
            const args = m[2].split(',').map(s => s.trim());
            let startCode, stopCode, stepCode;
            if (args.length === 1) { startCode = '0'; stopCode = __evalExpr(args[0]); stepCode = '1'; }
            else if (args.length === 2) { startCode = __evalExpr(args[0]); stopCode = __evalExpr(args[1]); stepCode = '1'; }
            else { startCode = __evalExpr(args[0]); stopCode = __evalExpr(args[1]); stepCode = __evalExpr(args[2]); }
            out.push(`${pad}for (let ${loopVar} = ${startCode}; ${loopVar} < ${stopCode}; ${loopVar} += ${stepCode}) {`);
            out.push(...emitBlock(b.body, indent + 1));
            out.push(`${pad}}`);
            continue;
          }
          // for var in iterable:  (list literal or other var)
          const m2 = head.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+)\s*:\s*$/);
          if (m2) {
            out.push(`${pad}for (const ${m2[1]} of ${emitExpression(m2[2])}) {`);
            out.push(...emitBlock(b.body, indent + 1));
            out.push(`${pad}}`);
            continue;
          }
        }
        if (/^while\s/.test(head)) {
          const m = head.match(/^while\s+(.+)\s*:\s*$/);
          if (m) {
            out.push(`${pad}while (${emitExpression(m[1])}) {`);
            out.push(...emitBlock(b.body, indent + 1));
            out.push(`${pad}}`);
            continue;
          }
        }
        if (/^if\s/.test(head)) {
          const m = head.match(/^if\s+(.+)\s*:\s*$/);
          if (m) {
            out.push(`${pad}if (${emitExpression(m[1])}) {`);
            out.push(...emitBlock(b.body, indent + 1));
            // peek: is next block elif/else?
            const peekIdx = blocks.indexOf(b);
            // We can't easily peek here because we don't have "next sibling" access;
            // rely on inner elif handling by post-processing.
            out.push(`${pad}}`);
            continue;
          }
        }
        if (/^elif\s/.test(head)) {
          const m = head.match(/^elif\s+(.+)\s*:\s*$/);
          if (m) {
            // Convert to else-if (only valid after a previous if).
            out.push(`${pad}else if (${emitExpression(m[1])}) {`);
            out.push(...emitBlock(b.body, indent + 1));
            out.push(`${pad}}`);
            continue;
          }
        }
        if (/^else\s*:\s*$/.test(head)) {
          out.push(`${pad}else {`);
          out.push(...emitBlock(b.body, indent + 1));
          out.push(`${pad}}`);
          continue;
        }
        if (/^try\s*:\s*$/.test(head)) {
          out.push(`${pad}try {`);
          out.push(...emitBlock(b.body, indent + 1));
          out.push(`${pad}} catch (__e) {}`);
          continue;
        }
        // Unknown compound — fallback
        out.push(`${pad}{ /* unsupported: ${head.trim()} */`);
        out.push(...emitBlock(b.body, indent + 1));
        out.push(`${pad}}`);
      }
    }
    return out;
  }

  // Helper: produce a JS expression for a Python expr at the if/for level
  function __evalExpr(expr) {
    return emitExpression(expr);
  }

  // Handle top-level: elifs are tricky because we flattened them into the block array.
  // To keep things simple, we post-process emitted output to repair if/elif/else.
  function repairIfElif(lines) {
    // We'll only handle top-level / single-level elifs emitted as separate blocks.
    // Our current implementation emits else-if on its own line — which is invalid JS
    // when it follows a closing brace at same indent. Merge those.
    const merged = [];
    for (let i = 0; i < lines.length; i++) {
      const cur = lines[i];
      const next = lines[i + 1] || '';
      const curClose = cur.trim() === '}' || /^\s*\}/.test(cur.trimEnd());
      // If current line ends with `}` and next is `else if (...) {`, merge into `} else if (...) {`
      if (cur.trim() === '}' && /^(\s*)else\s+if/.test(next)) {
        const indent = next.match(/^(\s*)/)[1];
        merged.push(cur.replace(/\}\s*$/, `} ${indent.trimStart()}else if`).replace(/^\s*/, indent));
        // modify line: remove leading indent of `else if`
        merged[merged.length - 1] = indent + '} else if';
        // we'll rewrite next completely:
        lines[i + 1] = next.replace(/^(\s*)else\s+if/, '$1').replace(/^(\s*)/, indent);
      }
    }
    return merged;
  }

  // Strip import statements
  function stripImports(code) {
    return code
      .split('\n')
      .map(line => line.replace(/^\s*import\s+turtle(\s+as\s+\w+)?\s*$/, ''))
      .map(line => line.replace(/^\s*from\s+turtle\s+import\s+[^#\n]*$/, ''))
      .join('\n');
  }

  // ----- Module-level helpers injected into the generated function -----
  const helpers = `
    const __turtle = window.Turtle;
    function __mkTurtle() {
      return window.Turtle.create();
    }
    function __range(start, stop, step) {
      if (stop === undefined) { stop = start; start = 0; }
      if (step === undefined) step = 1;
      const out = [];
      if (step > 0) for (let i = start; i < stop; i += step) out.push(i);
      else for (let i = start; i > stop; i += step) out.push(i);
      return out;
    }
    function __print(...args) {
      const line = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
      const c = document.getElementById('console');
      if (c) c.innerHTML += '<div>' + line + '</div>';
    }
    function __int(x) { return Math.trunc(+x); }
    function __float(x) { return +x; }
    function __str(x) { return String(x); }
    function __len(x) { return x.length; }
    function __round(x, n) { return n === undefined ? Math.round(x) : Math.round(x * Math.pow(10, n)) / Math.pow(10, n); }
    function __abs(x) { return Math.abs(x); }
    function __min(...args) { return Math.min(...args.flat()); }
    function __max(...args) { return Math.max(...args.flat()); }
    function __sum(arr) { let s = 0; for (const x of arr) s += +x; return s; }
    function __sorted(arr) { return [...arr].sort((a, b) => a - b); }
  `;

  function transpile(code) {
    code = stripImports(code);
    const blocks = linesToBlocks(code);
    const lines = emitBlock(blocks, 1);
    const finalLines = [];
    for (let i = 0; i < lines.length; i++) {
      const cur = lines[i];
      const next = lines[i + 1] || '';
      // If cur is "}" closing an if/elif and next is "} else if (...) {" at same indent,
      // collapse to "} else if (...) {"
      const indentMatch = cur.match(/^(\s*)\}/);
      if (indentMatch) {
        const indent = indentMatch[1];
        const nextMatch = next.match(/^(\s*)else\s+if\s*\((.*)\)\s*{$/);
        if (nextMatch && nextMatch[1] === indent) {
          finalLines.push(`${indent}} else if (${nextMatch[2]}) {`);
          i++;
          continue;
        }
      }
      finalLines.push(cur);
    }
    const body = finalLines.join('\n');

    const fn = `
      ${helpers}
      return (function() {
${body}
      }).call(this);
    `;
    return fn;
  }

  global.PythonTranspiler = { transpile };
})(window);
