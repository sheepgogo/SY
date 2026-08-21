/* =====================================================================
 * app.js
 * Wires the blocks card grid, the playground editor, the examples,
 * and the cheatsheet together.
 * ===================================================================== */
(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ---------- 成就（通关奖章）---------- */
  // 同时完成「在线演练跑通代码 + 累计答对 20 道打字题」，奖章就旋转出现
  // 改为「当次会话内判定」：不读 / 不写 localStorage，刷新后重新累计，
  // 避免历史进度（尤其是之前已攒够的 typedCount）导致"只运行代码就出奖章"。
  const ACH_KEY = 'wb_ach_v1';
  const TYPING_TARGET = 20;   // 累计答对多少题解锁
  let ACH = {};               // 仅保存在内存，刷新即清零，不与历史状态纠缠
  function saveAch() {
    // 关闭持久化：不再写入 localStorage。
    // 如需恢复「跨会话记忆（刷新后仍停在右上角）」，取消下一行注释即可：
    // try { localStorage.setItem(ACH_KEY, JSON.stringify(ACH)); } catch (_) {}
  }
  function maybeUnlockMedal() {
    if (ACH.ranCode && (ACH.typedCount || 0) >= TYPING_TARGET) {
      const m = document.getElementById('medal');
      if (m) m.classList.add('is-unlocked');
    }
  }

  /* ---------- Block card grid ---------- */
  function renderBlocks() {
    const grid = $('#blockGrid');
    grid.innerHTML = window.BLOCKS_DATA.map(b => `
      <div class="map-card">
        <div class="map-card-head">
          <span class="map-card-num">${b.id}</span>
          <div>
            <div><span class="block block-${b.type}">${b.match}</span></div>
            <span class="map-tag">${b.category}</span>
          </div>
        </div>
        <p class="map-card-desc">${b.description}</p>
        <pre class="map-card-code"><code>${b.python.map((line, i) => {
          const l = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          return l;
        }).join('\n')}</code></pre>
      </div>
    `).join('');
  }

  /* ---------- 计算模块 / 循环判断模块共用模板 ---------- */
  function _renderBlockGrid(gridSel, data) {
    const grid = $(gridSel);
    grid.innerHTML = data.map(b => {
      const headVisual = b.img
        ? `<img class="block-img" src="${b.img}" alt="${(b.label||'').replace(/"/g,'&quot;')}">`
        : `<span class="block block-${b.type}">${b.match}</span>`;
      const labelHtml = b.img
        ? `<div class="block-label">${b.label || ''}</div>`
        : '';
      return `
      <div class="map-card">
        <div class="map-card-head">
          <span class="map-card-num">${b.id}</span>
          <div>
            <div>${headVisual}</div>
            ${labelHtml}
            <span class="map-tag">${b.category}</span>
          </div>
        </div>
        <p class="map-card-desc">${b.description}</p>
        <pre class="map-card-code"><code>${b.python.map(line =>
            line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          ).join('\n')}</code></pre>
      </div>
    `;
    }).join('');
  }

  /* ---------- 计算模块积木卡片 ---------- */
  function renderCalcBlocks() {
    const grid = $('#calcGrid');
    if (!grid || !window.CALC_BLOCKS_DATA) return;
    grid.innerHTML = window.CALC_BLOCKS_DATA.map(b => `
      <div class="map-card">
        <div class="map-card-head">
          <span class="map-card-num">${b.id}</span>
          <div>
            <div><span class="block block-${b.type}">${b.match}</span></div>
            <span class="map-tag">${b.category}</span>
          </div>
        </div>
        <p class="map-card-desc">${b.description}</p>
        <pre class="map-card-code"><code>${b.python.map((line) => {
          const l = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          return l;
        }).join('\n')}</code></pre>
      </div>
    `).join('');
  }

  /* ---------- 循环判断模块积木卡片（复用 _renderBlockGrid，头部显示积木原图）---------- */
  function renderLoopBlocks() {
    if (!window.LOOP_BLOCKS_DATA) return;
    _renderBlockGrid('#loopGrid', window.LOOP_BLOCKS_DATA);
  }

  /* ---------- Examples grid ---------- */
  function renderExamples() {
    const grid = $('#examplesGrid');
    grid.innerHTML = window.EXAMPLES.map(ex => `
      <div class="example-card">
        <div class="example-icon" style="background:${ex.icon}"></div>
        <h3 class="example-title">${ex.title}</h3>
        <p class="example-desc">${ex.description}</p>
        <div class="example-preview">${ex.preview}</div>
        <div class="example-actions">
          <button class="btn btn-ghost" data-load="${ex.id}">载入示例</button>
          <button class="btn btn-primary" data-run="${ex.id}">直接运行</button>
        </div>
      </div>
    `).join('');

    grid.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;
      const id = target.dataset.load || target.dataset.run;
      const ex = window.EXAMPLES.find(x => x.id === id);
      if (!ex) return;
      $('#codeEditor').value = ex.code;
      if (target.dataset.run) runCode();
      else {
        // Smooth-scroll to playground
        document.getElementById('playground').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => $('#codeEditor').focus(), 600);
      }
    });
  }

  /* ---------- Cheatsheet ---------- */
  function renderCheatsheet() {
    const sections = [
      {
        title: '运动类',
        items: [
          ['t.forward(d) / t.fd(d)', '前进 d 步（d 可负数）'],
          ['t.backward(d) / t.bk(d)', '后退 d 步'],
          ['t.left(a) / t.lt(a)', '逆时针转 a 度'],
          ['t.right(a) / t.rt(a)', '顺时针转 a 度'],
          ['t.goto(x, y)', '瞬间移动到 (x, y)'],
          ['t.setheading(a) / t.seth(a)', '把朝向设置为 a 度']
        ]
      },
      {
        title: '画笔类',
        items: [
          ['t.penup() / t.pu()', '抬起笔 — 移动不再画线'],
          ['t.pendown() / t.pd()', '放下笔 — 移动开始画线'],
          ['t.pensize(w) / t.width(w)', '设置画笔粗细'],
          ['t.pencolor(c)', '设置画笔颜色 (字符串或 RGB 元组)'],
          ['t.fillcolor(c)', '设置填充色'],
          ['t.begin_fill() / t.end_fill()', '包裹一段路径进行填充']
        ]
      },
      {
        title: '外观与画布',
        items: [
          ['t.hideturtle() / t.ht()', '隐藏小乌龟'],
          ['t.showturtle() / t.st()', '显示小乌龟'],
          ['t.speed(s)', '0..10：动画速度，0 最快'],
          ['t.home()', '回到中心且朝向归零'],
          ['t.reset()', '清屏 + 重置所有属性'],
          ['t.write("hi")', '在当前位置写字']
        ]
      },
      {
        title: '几何图元',
        items: [
          ['t.circle(r, ext, steps)', '画半径为 r 的圆 / 弧'],
          ['t.dot(size, color)', '画一个点（无边框）'],
          ['t.shapesize(s)', '放大 / 缩小小乌龟本身']
        ]
      },
      {
        title: 'Python 通用',
        items: [
          ['import turtle', '导入 turtle 模块（演练场已自动处理）'],
          ['range(N) / range(a, b) / range(a, b, step)', '生成整数序列'],
          ['print(...)', '把内容输出到下方控制台'],
          ['int() / float() / str()', '类型转换'],
          ['abs() / round() / min() / max() / sum()', '常用数学函数']
        ]
      }
    ];

    const root = $('#cheatsheet');
    root.innerHTML = sections.map(sec => `
      <div class="cs-section">
        <div class="cs-section-title">${sec.title}</div>
        <table class="cs-table">
          <thead><tr><th style="width:42%">Python 写法</th><th>作用</th></tr></thead>
          <tbody>
            ${sec.items.map(it => `<tr><td><code>${escapeHtml(it[0])}</code></td><td>${it[1]}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    `).join('');
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ---------- Supported command list in playground ---------- */
  function renderSupportedList() {
    const list = [
      ['t.forward(d)', '前进'],
      ['t.left(a)', '左转'],
      ['t.right(a)', '右转'],
      ['t.goto(x, y)', '定位'],
      ['t.setheading(a)', '设朝向'],
      ['t.penup() / pendown()', '抬/落笔'],
      ['t.pensize(w)', '笔粗'],
      ['t.pencolor(c)', '笔色'],
      ['t.fillcolor(c)', '填充色'],
      ['t.begin_fill / end_fill', '填色'],
      ['t.circle(r)', '画圆'],
      ['t.dot(s, c)', '画点'],
      ['t.home()', '回家'],
      ['t.clear()', '清屏'],
      ['t.speed(0..10)', '速度'],
      ['t.hideturtle()', '隐龟'],
      ['t.write(text)', '写字'],
      ['range() / print()', '内置']
    ];
    $('#supportedList').innerHTML = list.map(([c, t]) =>
      `<div><code>${c}</code> · ${t}</div>`).join('');
  }

  /* ---------- Playground / runner ---------- */
  let canvasEl, ctx;

  function setupCanvas(keepTurtles) {
    canvasEl = $('#turtleCanvas');
    ctx = canvasEl.getContext('2d');
    window.Turtle.setCanvas(canvasEl);
    window.Turtle.clearBackground();
    drawGrid();
    if (!keepTurtles) {
      // Clear singleton list — the user's code will re-create turtles via
      // turtle.Turtle() / Turtle.create().
      window.Turtle._singletons.length = 0;
    }
    // No placeholder turtle — let the user's code draw its own.
  }

  // Draw a faint grid + axes so it's easier to "see" coords
  function drawGrid() {
    const w = canvasEl.width, h = canvasEl.height;
    const ctx2 = ctx;
    ctx2.fillStyle = '#ffffff';
    ctx2.fillRect(0, 0, w, h);
    ctx2.save();
    ctx2.strokeStyle = '#eef0f7';
    ctx2.lineWidth = 1;
    const step = 20;
    for (let x = w / 2; x < w; x += step) {
      ctx2.beginPath(); ctx2.moveTo(x, 0); ctx2.lineTo(x, h); ctx2.stroke();
      ctx2.beginPath(); ctx2.moveTo(w - x, 0); ctx2.lineTo(w - x, h); ctx2.stroke();
    }
    for (let y = h / 2; y < h; y += step) {
      ctx2.beginPath(); ctx2.moveTo(0, y); ctx2.lineTo(w, y); ctx2.stroke();
      ctx2.beginPath(); ctx2.moveTo(0, h - y); ctx2.lineTo(w, h - y); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle = '#cfd6e6';
    ctx2.beginPath(); ctx2.moveTo(0, h / 2); ctx2.lineTo(w, h / 2); ctx2.stroke();
    ctx2.beginPath(); ctx2.moveTo(w / 2, 0); ctx2.lineTo(w / 2, h); ctx2.stroke();
    ctx2.restore();
  }

  function setStatus(text, kind) {
    const el = $('#status');
    el.textContent = text;
    el.classList.remove('error', 'success');
    if (kind) el.classList.add(kind);
  }

  function clearConsole() { $('#console').innerHTML = ''; }

  function runCode() {
    const code = $('#codeEditor').value;
    clearConsole();
    setupCanvas(false);   // wipe canvas + clear previous turtles
    window.Turtle._bgColor = '#ffffff';
    setStatus('运行中...');
    try {
      const transpiled = window.PythonTranspiler.transpile(code);
      // eslint-disable-next-line no-new-func
      // NOTE: transpiled already ends with `return (function(){...})();`
      // so we must NOT prepend another `return` — doing so triggers ASI
      // (automatic semicolon insertion) and makes all code unreachable.
      const fn = new Function(transpiled);
      // Run inside a closure that captures the editor console.
      fn();

      // Draw final turtles at their last positions
      for (const t of window.Turtle._singletons) {
        t._drawTurtle();
      }
      setStatus('完成', 'success');
      // 必须"真的画出了图形"才算数：排除只创建 turtle、只做 penup 移动、
      // forward(0) 等我确实没落笔的情况（靠 turtle 引擎的 _drawCount 判定）
      const drew = window.Turtle._singletons.some(t => (t._drawCount || 0) > 0);
      if (drew) {
        ACH.ranCode = true; saveAch(); maybeUnlockMedal();
      }
    } catch (err) {
      console.error(err);
      $('#console').innerHTML = '<div class="err">' + (err.message || err) + '</div>';
      setStatus('出错了', 'error');
    }
  }

  function stepRunCode() {
    // Naive step run: highlight current line by sequentially executing statements.
    // For simplicity, we just re-run from scratch and toggle a banner.
    runCode();
    setStatus('（单步）完成', 'success');
  }

  function resetCanvas() {
    window.Turtle._singletons = [];
    setupCanvas();
    clearConsole();
    setStatus('画布已重置');
  }

  /* ---------- 打字练习 ---------- */
  const TP = {
    allWords: [],
    words: [],
    filter: 'all',
    mode: 'random',
    orderIndex: 0,
    lastIndex: -1,
    current: null,
    correct: 0,
    total: 0,
    resolved: false
  };

  function tpSpeak(text) {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      u.pitch = 1;
      // 尽量挑一个英语嗓音
      const voices = window.speechSynthesis.getVoices();
      const en = voices.find(v => /^en(-|_)/i.test(v.lang));
      if (en) u.voice = en;
      window.speechSynthesis.speak(u);
    } catch (e) { /* 不支持就静默 */ }
  }

  function tpPickIndex() {
    if (TP.mode === 'order') {
      const i = TP.orderIndex % TP.words.length;
      TP.orderIndex++;
      return i;
    }
    // 随机：尽量不与上一个重复
    if (TP.words.length === 1) return 0;
    let i;
    do { i = Math.floor(Math.random() * TP.words.length); } while (i === TP.lastIndex);
    return i;
  }

  function tpLoadWord() {
    const i = tpPickIndex();
    TP.lastIndex = i;
    TP.current = TP.words[i];
    TP.resolved = false;
    const catEl = $('#tpCat');
    catEl.textContent = TP.current.level;
    catEl.className = 'tp-cat ' + tpLevelCls(TP.current.level);
    $('#tpZh').textContent = TP.current.zh;
    $('#tpPhon').textContent = TP.current.phonetic;
    const input = $('#tpInput');
    input.value = '';
    input.classList.remove('shake');
    $('#tpFeedback').textContent = '';
    $('#tpFeedback').className = 'tp-feedback';
    tpRenderTarget();
    tpSpeak(TP.current.word);
  }

  function tpRenderTarget() {
    const word = (TP.current && TP.current.word) || '';
    const typed = $('#tpInput').value;
    const html = word.split('').map((ch, i) => {
      let cls = 'tp-letter pending';
      let disp = ch;
      if (i < typed.length) {
        cls = (typed[i].toLowerCase() === ch.toLowerCase()) ? 'tp-letter correct' : 'tp-letter wrong';
      }
      return `<span class="${cls}">${disp}</span>`;
    }).join('');
    $('#tpTarget').innerHTML = html;
  }

  function tpRenderStats() {
    $('#tpCorrect').textContent = TP.correct;
    $('#tpTotal').textContent = TP.total;
    const acc = TP.total === 0 ? 100 : Math.round((TP.correct / TP.total) * 100);
    $('#tpAcc').textContent = acc + '%';
  }

  function tpSubmit() {
    if (!TP.current) return;
    // 已经答对或看过答案：再按回车 / 点提交 = 进入下一个词，避免卡在已解决的词上
    if (TP.resolved) { tpLoadWord(); return; }
    const typed = $('#tpInput').value.trim();
    if (!typed) { tpShake(); return; }
    TP.total++;
    if (typed.toLowerCase() === TP.current.word.toLowerCase()) {
      TP.correct++;
      ACH.typedCount = (ACH.typedCount || 0) + 1; saveAch(); maybeUnlockMedal();
      TP.resolved = true;
      $('#tpFeedback').textContent = '答对了！就是这个单词。';
      $('#tpFeedback').className = 'tp-feedback ok';
      tpRenderTarget(); // 全部变绿
      tpRenderStats();
      // 答对后稍作停顿再自动进入下一词，避免长时间停在已答对的词上造成“卡住”感
      setTimeout(() => { if (TP.resolved) tpLoadWord(); }, 1200);
    } else {
      $('#tpFeedback').textContent = '还不对，再试一次，或点「显示答案」。';
      $('#tpFeedback').className = 'tp-feedback err';
      tpShake();
      tpRenderStats();
    }
  }

  function tpShowAnswer() {
    if (!TP.current || TP.resolved) return;
    TP.resolved = true;
    const input = $('#tpInput');
    input.value = TP.current.word;
    tpRenderTarget();
    $('#tpFeedback').textContent = '正确答案：' + TP.current.word + '（' + TP.current.ex + '）';
    $('#tpFeedback').className = 'tp-feedback hint';
  }

  function tpShake() {
    const input = $('#tpInput');
    input.classList.remove('shake');
    void input.offsetWidth; // 触发重排以重启动画
    input.classList.add('shake');
  }

  function tpLevelCls(level) {
    return { '一级': 'lv1', '二级': 'lv2', '三级': 'lv3', '四级': 'lv4' }[level] || 'lv1';
  }

  function tpRenderWordList() {
    // 已移除单词列表外显，保留函数以兼容旧调用
  }

  function tpApplyFilter(level) {
    TP.filter = level;
    // 仅练习区（TP.words）按级别筛选
    TP.words = (level === 'all')
      ? TP.allWords.slice()
      : TP.allWords.filter(w => w.level === level);
    TP.orderIndex = 0;
    TP.lastIndex = -1;
    tpLoadWord();
  }

  function setupTyping() {
    if (!window.TYPING_WORDS) return;
    TP.allWords = window.TYPING_WORDS;
    TP.words = TP.allWords.slice();
    // 单词列表已隐藏，不再渲染
    tpRenderStats();

    // 构建考级筛选标签（全部 / 一级 / 二级 / 三级 / 四级）
    const levels = (window.TYPING_LEVELS || [{ name: '全部', id: 'all' }]);
    const tabs = [{ name: '全部', id: 'all' }].concat(levels);
    const tabsHtml = tabs.map((lv, idx) => {
      // “全部”保持 'all'；其余级别用中文名（与单词的 level 字段一致），否则筛选会落空
      const key = (lv.id === 'all') ? 'all' : lv.name;
      return `<button class="tp-level ${idx === 0 ? 'active' : ''}" data-level="${key}">${lv.name}</button>`;
    }).join('');
    $('#tpLevels').innerHTML = tabsHtml;
    $$('#tpLevels .tp-level').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#tpLevels .tp-level').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tpApplyFilter(btn.getAttribute('data-level'));
        $('#tpInput').focus();
      });
    });

    $('#tpInput').addEventListener('input', tpRenderTarget);
    $('#tpInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); tpSubmit(); }
    });
    $('#tpSubmit').addEventListener('click', tpSubmit);
    $('#tpShow').addEventListener('click', tpShowAnswer);
    $('#tpNext').addEventListener('click', () => { tpLoadWord(); $('#tpInput').focus(); });
    $('#tpReset').addEventListener('click', () => {
      TP.correct = 0; TP.total = 0; TP.orderIndex = 0; TP.lastIndex = -1;
      tpRenderStats();
      tpLoadWord();
    });
    $('#tpSpeak').addEventListener('click', () => { if (TP.current) tpSpeak(TP.current.word); });

    $$('.tp-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.tp-mode').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        TP.mode = btn.getAttribute('data-mode');
        TP.orderIndex = 0;
        TP.lastIndex = -1;
        tpLoadWord();
      });
    });

    // 部分浏览器需要等嗓音加载完
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }

    tpLoadWord();
  }

  /* ---------- Bindings ---------- */
  function bind() {
    $('#runBtn').addEventListener('click', runCode);
    $('#stepBtn').addEventListener('click', stepRunCode);
    $('#resetBtn').addEventListener('click', resetCanvas);
    $('#loadExample').addEventListener('click', () => {
      $('#codeEditor').value = window.EXAMPLES[0].code;
      setStatus('已载入示例：正方形');
    });

    // Keyboard shortcut: Ctrl/Cmd + Enter runs
    $('#codeEditor').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      // Tab insertion
      if (e.key === 'Tab') {
        e.preventDefault();
        const ta = e.target;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        ta.value = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
        ta.selectionStart = ta.selectionEnd = start + 4;
      }
    });
  }

  /* ---------- Init ---------- */
  /* ---------- 侧边栏滚动高亮 ---------- */
  function setupSidebar() {
    const items = Array.from(document.querySelectorAll('.nav-item'));
    const map = new Map();        // section -> 对应 nav-item
    const parentOf = new Map();   // 子 nav-item -> 父 nav-item（画图章节）
    items.forEach(it => {
      const sec = document.getElementById(it.getAttribute('data-target'));
      if (sec) map.set(sec, it);
      const group = it.closest('.nav-group');
      if (group) {
        const p = group.querySelector(':scope > .nav-parent');
        if (p && p !== it) parentOf.set(it, p);
      }
    });
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach(i => i.classList.remove('active'));
          const it = map.get(entry.target);
          if (it) {
            it.classList.add('active');
            const p = parentOf.get(it);   // 子项高亮时，父项（画图章节）也高亮
            if (p) p.classList.add('active');
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    map.forEach((_, sec) => obs.observe(sec));
  }

  function init() {
    renderBlocks();
    renderCalcBlocks();
    renderLoopBlocks();
    renderExamples();
    renderCheatsheet();
    renderSupportedList();
    setupSidebar();
    setupTyping();
    setupCanvas();
    bind();
    normalizeOps();       // 兜底：把全站任何残留的数学符号 ≠ ≤ ≥ 替换为 Python 运算符
  }

  /* 兜底归一化：无论 HTML/JS 哪里出现数学符号，运行时统一替换为 Python 运算符。
   * 作用：防止浏览器缓存旧版、或某处漏改时仍残留 ≠ ≤ ≥。 */
  function normalizeOps() {
    const map = { '\u2260': '!=', '\u2264': '<=', '\u2265': '>=' };
    const re = /[\u2260\u2264\u2265]/;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const targets = [];
    let n;
    while ((n = walker.nextNode())) {
      if (re.test(n.nodeValue)) targets.push(n);
    }
    for (const t of targets) {
      let v = t.nodeValue;
      for (const k in map) v = v.split(k).join(map[k]);
      t.nodeValue = v;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
