/* =====================================================================
 * loop-blocks-data.js
 * 6 个"循环 / 条件 / 终止"控制类积木 → Python 对照
 * 颜色：loop(橙) — 沿用 Scratch 控制块配色
 * 卡片头部显示积木原图（来自 images/loop/01-06.jpg）
 * 顺序与原图 @image#1~#6 一致
 * ===================================================================== */
window.LOOP_BLOCKS_DATA = [
  /* —— 1. 重复执行（forever loop）—— 原图 01.jpg */
  {
    id: 1, type: 'loop',
    label: '重复执行',
    img: 'images/loop/01.jpg',
    match: '重复执行',
    description: '无限循环：从上到下一直重复执行「凹槽」里的积木，直到手动停止才能停下；Python 里对应 <code>while True:</code>。',
    python: [
      '# 无限循环，需要在画布里手动停止才能结束',
      'while True:',
      '    t.forward(5)',
      '    t.left(3)'
    ],
    category: '循环'
  },

  /* —— 2. 如果 … 那么（if） —— 原图 02.jpg */
  {
    id: 2, type: 'loop',
    label: '如果 … 那么',
    img: 'images/loop/02.jpg',
    match: '如果 <span class="num">⟐</span> 那么',
    description: '条件分支：只有当「菱形」里的条件为真时，才执行「凹槽」里的积木。Python 里对应 <code>if 条件:</code>。',
    python: [
      'x = t.xcor()            # 取当前坐标',
      '',
      'if x > 0:               # 当 x 大于 0 时',
      '    t.forward(100)      #    才往前走'
    ],
    category: '判断'
  },

  /* —— 3. 停止全部脚本（stop all）—— 原图 03.jpg */
  {
    id: 3, type: 'loop',
    label: '停止全部脚本',
    img: 'images/loop/03.jpg',
    match: '停止全部脚本',
    description: '立刻结束当前正在运行的脚本。在 Python 里没有「一键停所有」的命令，通常是在循环里用 <code>break</code> 跳出当前循环来停止。',
    python: [
      '# 在单个循环里，跳出当前循环用 break：',
      'for i in range(1000):',
      '    if t.xcor() > 200:    # 走到右边太远',
      '        break             # 跳出当前循环',
      '    t.forward(5)'
    ],
    category: '终止'
  },

  /* —— 4. 重复执行直到 …（repeat until）—— 原图 04.jpg */
  {
    id: 4, type: 'loop',
    label: '重复执行直到 …',
    img: 'images/loop/04.jpg',
    match: '重复执行直到 <span class="num">⟐</span>',
    description: '带退出条件的循环：一直重复，直到「六边形」里的条件变成真为止。Python 用 <code>while not 条件:</code>（取反）。',
    python: [
      '# 一直走到画到(100, 0) 就停',
      'while not (t.xcor() >= 100):',
      '    t.forward(5)'
    ],
    category: '循环'
  },

  /* —— 5. 重复执行 … 次（repeat N times）—— 原图 05.jpg */
  {
    id: 5, type: 'loop',
    label: '重复执行 … 次',
    img: 'images/loop/05.jpg',
    match: '重复执行 <span class="num">N</span> 次',
    description: '固定次数的循环：从 0 到 N-1，整段执行 N 次。Python 用 <code>for i in range(N):</code>（<code>i</code> 依次取 0, 1, …, N-1）。',
    python: [
      'for i in range(4):    # 重复 4 次（i = 0,1,2,3）',
      '    t.forward(100)',
      '    t.left(90)         # 画一个正方形'
    ],
    category: '循环'
  },

  /* —— 6. 如果 … 那么 … 否则（if / else）—— 原图 06.jpg */
  {
    id: 6, type: 'loop',
    label: '如果 … 那么 … 否则',
    img: 'images/loop/06.jpg',
    match: '如果 <span class="num">⟐</span> 那么<br />否则',
    description: '二选一分支：条件为真执行「那么」部分，为假执行「否则」部分。Python 里对应 <code>if … else</code>。',
    python: [
      'x = t.xcor()',
      '',
      'if x > 0:               # 条件为真',
      '    t.forward(100)      #   走一段',
      'else:                   # 条件为假',
      '    t.left(180)         #   转回去'
    ],
    category: '判断'
  }
];
