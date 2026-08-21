/* =========================================================
 * 知识点闯关模块
 * 玩法：屏幕显示「文档右边」的中文释义，用户键盘输入「文档左边」
 *       的 Python 代码 / 单词；全部答对后显示总用时（精确到毫秒）。
 * 数据来源：桌面 题目.txt（制表符分隔：左=术语，右=释义），
 *       此处已解析为下方数组，便于离线/直接双击打开也能用。
 * ========================================================= */
(function () {
  'use strict';

  // answer = 文档左边（要打出的术语）；prompt = 文档右边（显示的中文释义）
  // 第 22 行原文为「字符串  input()  输入语句返回的是什么数据类型」，
  // 按语义取答案为 input()（输入语句），释义为最右列。
  var QS = [
    { answer: 'int',          prompt: '整数' },
    { answer: 'float',        prompt: '小数' },
    { answer: 'bool',         prompt: '布尔值' },
    { answer: 'str',          prompt: '字符串' },
    { answer: '+',            prompt: '加' },
    { answer: '-',            prompt: '减' },
    { answer: '*',            prompt: '乘' },
    { answer: '/',            prompt: '除' },
    { answer: '//',           prompt: '整除' },
    { answer: '%',            prompt: '取余' },
    { answer: '**',           prompt: '幂' },
    { answer: 'and',          prompt: '与：两边都真才真', hint: '例：True and False → False' },
    { answer: 'or',           prompt: '或：只要一个真就真', hint: '例：True or False → True' },
    { answer: 'not',          prompt: '非：把真假反过来', hint: '例：not True → False' },
    { answer: 'import turtle', prompt: '导入 turtle 模块' },
    { answer: 'print()',      prompt: '输出语句' },
    { answer: 'input()',      prompt: '输入语句' },
    { answer: '字符串',       prompt: '输入语句返回的是什么数据类型' },
    // 以下为「看代码，写出运行结果」类题目：prompt=代码，answer=输出
    { answer: '2.0',          prompt: 'print(10/5)' },
    { answer: '2',            prompt: 'print(10//5)' },
    { answer: '2.0',          prompt: 'print(10.0//5)' },
    { answer: 'True',         prompt: 'print(10>5)' },
    { answer: 'True',         prompt: 'print(5<10)' },
    { answer: '1',            prompt: 'print(10%3)' },
    { answer: '0',            prompt: 'print(10%5)' },
    { answer: '8',            prompt: 'print(2**3)' }
  ];

  var idx = 0;
  var startTime = 0;
  var timerId = null;
  var finished = false;
  var locked = false;   // 切换题目过渡期间锁定，防止重复提交

  function $(s) { return document.querySelector(s); }

  var startScreen = $('#chStart');
  var quizScreen  = $('#chQuiz');
  var doneScreen  = $('#chDone');
  var startBtn    = $('#chStartBtn');
  var restartBtn  = $('#chRestart');
  var submitBtn   = $('#chSubmit');
  var promptEl    = $('#chPrompt');
  var hintEl      = $('#chHint');
  var inputEl     = $('#chInput');
  var feedbackEl  = $('#chFeedback');
  var progressEl  = $('#chProgress');
  var timerEl     = $('#chTimer');
  var timeEl      = $('#chTime');
  var totalEl     = $('#chTotal');
  var countEl     = $('#chCount');

  function norm(s) { return (s || '').trim().toLowerCase(); }

  function fmt(ms) {
    return (ms / 1000).toFixed(3) + ' 秒';
  }

  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  function start() {
    idx = 0;
    finished = false;
    startTime = performance.now();
    if (countEl) countEl.textContent = QS.length;
    hide(startScreen);
    hide(doneScreen);
    show(quizScreen);
    showQuestion();
    if (timerId) clearInterval(timerId);
    timerId = setInterval(function () {
      timerEl.textContent = fmt(performance.now() - startTime);
    }, 47);
  }

  function showQuestion() {
    var q = QS[idx];
    promptEl.textContent = q.prompt;
    hintEl.textContent = q.hint ? ('提示：' + q.hint) : '';
    inputEl.value = '';
    setFeedback('', '');
    progressEl.textContent = '第 ' + (idx + 1) + ' / ' + QS.length + ' 题';
    inputEl.disabled = false;
    locked = false;
    inputEl.focus();
  }

  function setFeedback(msg, cls) {
    feedbackEl.textContent = msg;
    feedbackEl.className = 'ch-feedback' + (cls ? ' ' + cls : '');
  }

  // 答对或答错（已显示正确答案）后，统一从这里进入下一题 / 结束
  function advance() {
    if (idx + 1 >= QS.length) {
      finish();
    } else {
      idx++;
      showQuestion();
    }
  }

  function submit() {
    if (finished || locked) return;
    var val = inputEl.value;
    if (!val.trim()) {
      setFeedback('请先输入答案再提交', 'err');
      inputEl.focus();
      return;
    }
    if (norm(val) === norm(QS[idx].answer)) {
      setFeedback('答对了！', 'ok');
      locked = true;
      inputEl.disabled = true;
      setTimeout(advance, 480);
    } else {
      // 打错：显示正确答案，但停留在本题，必须重新输入正确才进入下一题
      setFeedback('不对，正确答案是：' + QS[idx].answer + '（请重新输入）', 'err');
      inputEl.value = '';
      inputEl.focus();
    }
  }

  function finish() {
    finished = true;
    if (timerId) { clearInterval(timerId); timerId = null; }
    var elapsed = performance.now() - startTime;
    timeEl.innerHTML = '用时 <b>' + (elapsed / 1000).toFixed(3) + '</b> 秒';
    if (totalEl) totalEl.textContent = QS.length;
    timerEl.textContent = fmt(elapsed);
    hide(quizScreen);
    show(doneScreen);
  }

  function bind() {
    if (startBtn)   startBtn.addEventListener('click', start);
    if (restartBtn) restartBtn.addEventListener('click', start);
    if (submitBtn)  submitBtn.addEventListener('click', submit);
    if (inputEl) {
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); submit(); }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
