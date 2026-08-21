/* =====================================================================
 * blocks-data.js
 * 7 blocks from the user's screenshots + their Python turtle equivalents.
 * ===================================================================== */
window.BLOCKS_DATA = [
  {
    id: 1,
    type: 'motion',
    label: '移动 {X} 步',
    labelNum: 10,
    match: '移动 <span class="num">10</span> 步',
    description: '让小乌龟沿着当前方向前进或后退指定的步数。在 Python 里对应的就是 <code>t.forward(X)</code>，负值表示后退。',
    python: ['# 让小乌龟向前移动 10 步', 't.forward(10)', '', '# 传入负数表示后退', 't.forward(-50)'],
    keyword: 'forward',
    aliases: ['fd'],
    category: '运动类'
  },
  {
    id: 2,
    type: 'motion',
    label: '右转 {X} 度',
    labelNum: 15,
    match: '右转 <span class="num">15</span> 度',
    description: '让小乌龟顺时针旋转指定的角度。在 Python 里使用 <code>t.right(X)</code>。注意：图形化编程里「右转」是顺时针；Python turtle 中 <code>right()</code> 也是顺时针。',
    python: ['# 顺时针（右）旋转 15 度', 't.right(15)'],
    keyword: 'right',
    aliases: ['rt'],
    category: '运动类'
  },
  {
    id: 3,
    type: 'motion',
    label: '左转 {X} 度',
    labelNum: 15,
    match: '左转 <span class="num">15</span> 度',
    description: '让小乌龟逆时针旋转指定的角度。在 Python 里使用 <code>t.left(X)</code>。',
    python: ['# 逆时针（左）旋转 15 度', 't.left(15)'],
    keyword: 'left',
    aliases: ['lt'],
    category: '运动类'
  },
  {
    id: 4,
    type: 'motion',
    label: '面向 {X} 方向',
    labelNum: 90,
    match: '面向 <span class="num">90</span> 方向',
    description: '把方向直接设置为指定角度（0° = 向右，90° = 向上，180° = 向左）。在 Python 里使用 <code>t.setheading(X)</code>。',
    python: ['# 直接把方向设置为 90 度（朝上）', 't.setheading(90)', '', '# 也可以简写为 seth()', 't.seth(0)  # 朝右'],
    keyword: 'setheading',
    aliases: ['seth'],
    category: '运动类'
  },
  {
    id: 5,
    type: 'motion',
    label: '移到 x:{X} y:{Y}',
    labelNum1: 0,
    labelNum2: 0,
    match: '移到 x:<span class="num">0</span> y:<span class="num">0</span>',
    description: '瞬间把小乌龟移动到画布上指定的坐标（屏幕中心是 0,0；右为正，上为正）。在 Python 里使用 <code>t.goto(X, Y)</code>。',
    python: ['# 瞬间移动到 (0, 0)，即屏幕中心', 't.goto(0, 0)', '', '# 移动到 (100, 50)', 't.goto(100, 50)'],
    keyword: 'goto',
    aliases: ['setpos', 'setposition'],
    category: '运动类'
  },
  {
    id: 6,
    type: 'looks',
    label: '将大小设为 {X}',
    labelNum: 100,
    match: '将大小设为 <span class="num">100</span>',
    description: '调整画笔粗细或小乌龟尺寸。图形化编程里 100 是默认值。在 Python turtle 中常用 <code>t.pensize(W)</code> 来设置画笔粗细；调整「乌龟大小」用 <code>t.shapesize(W)</code>。',
    python: ['# 画笔粗细（影响描线宽度）', 't.pensize(5)', '', '# 在 Python turtle 里默认没有 “100”的可视化尺寸，', '# 通常用 pensize 表示粗细；用 shapesize 缩放乌龟'],
    keyword: 'pensize',
    aliases: ['width', 'shapesize'],
    category: '外观类'
  },
  {
    id: 7,
    type: 'looks',
    label: '将 {VAR} 特效设定为 {X}',
    labelNum: 0,
    match: '将 <span style="background:#fff;color:#333;padding:2px 10px;border-radius:10px;font-weight:700;margin:0 6px;">颜色▼</span> 特效设定为 <span class="num">0</span>',
    description: '这一类积木在图形化编程里用来切换图形特效（比如颜色、马赛克、虚化）。Python turtle 没有完全等价的特效系统，但可以通过 <code>pencolor</code>、<code>fillcolor</code>、<code>bgcolor</code> 等直接控制颜色。',
    python: ['# 通过颜色变换模拟 “颜色特效”', 't.pencolor("deepskyblue")'],
    keyword: 'pencolor / bgcolor',
    aliases: ['color', 'fillcolor'],
    category: '外观类'
  }
];
