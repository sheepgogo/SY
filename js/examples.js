/* =====================================================================
 * examples.js
 * Sample programs ranging from "almost the same as the blocks" to
 * "real Python uses".
 * 画图模块的示例全部用「一步一步的指令」实现，不使用 for / while 循环
 * （循环是「循环判断模块」专门讲解的内容）。
 * Each example has a small SVG `preview` so the user gets a feel of
 * what it will draw *before* running it.
 * ===================================================================== */

window.EXAMPLES = [
  {
    id: 'square',
    icon: '#3a7bd5',
    title: '正方形 — 入门第一个图形',
    description: '用「向前 + 左转 90 度」连续 4 次，画一个正方形。完美对应「移动 100 步」+「左转 15 度」的积木思路。',
    preview: `<svg viewBox="-90 -90 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="royalblue" stroke-width="4" stroke-linejoin="round"/>
    </svg>`,
    code: `import turtle

t = turtle.Turtle()
t.speed(3)
t.pensize(3)
t.pencolor("royalblue")

# 连续 4 次：走一条边、转一次弯（每步都明确写出来，不使用循环）
t.forward(120)   # 对应积木 "移动 100 步"
t.left(90)       # 对应积木 "左转 15 度"
t.forward(120)
t.left(90)
t.forward(120)
t.left(90)
t.forward(120)
t.left(90)`
  },
  {
    id: 'star',
    icon: '#d4a017',
    title: '五角星 — 调小角度就有惊喜',
    description: '画五角星的关键是每次转 144°（= 180 − 360÷5），不是 90°！连续 5 次「向前 + 左转 144°」即可。',
    preview: `<svg viewBox="-90 -90 180 180" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,-70 16.6,-21.6 67.6,-21.6 26.9,8.5 41.5,57.7 0,28 -41.5,57.7 -26.9,8.5 -67.6,-21.6 -16.6,-21.6"
               fill="none" stroke="goldenrod" stroke-width="3" stroke-linejoin="round"/>
    </svg>`,
    code: `import turtle

t = turtle.Turtle()
t.speed(3)
t.pensize(2)
t.pencolor("gold")

# 连续 5 次：向前走、左转 144 度（不写循环，一步一步来）
t.forward(150)
t.left(144)
t.forward(150)
t.left(144)
t.forward(150)
t.left(144)
t.forward(150)
t.left(144)
t.forward(150)
t.left(144)`
  },
  {
    id: 'circle-flower',
    icon: '#e8607d',
    title: '太阳花 — 一组放射状的花瓣',
    description: '用 setheading 把画笔指向不同方向，从中心向外画一条线再退回，连起来就是一圈花瓣。这里把「循环」展开成一步步的指令。',
    preview: `<svg viewBox="-90 -90 180 180" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke-width="2">
        <g stroke="red"><polyline points="0,0 60,0" transform="rotate(0)"/><polyline points="0,0 60,0" transform="rotate(10)"/></g>
        <g stroke="orange"><polyline points="0,0 60,0" transform="rotate(20)"/><polyline points="0,0 60,0" transform="rotate(30)"/></g>
        <g stroke="gold"><polyline points="0,0 60,0" transform="rotate(40)"/><polyline points="0,0 60,0" transform="rotate(50)"/></g>
        <g stroke="green"><polyline points="0,0 60,0" transform="rotate(60)"/><polyline points="0,0 60,0" transform="rotate(70)"/></g>
        <g stroke="blue"><polyline points="0,0 60,0" transform="rotate(80)"/><polyline points="0,0 60,0" transform="rotate(90)"/></g>
        <g stroke="purple"><polyline points="0,0 60,0" transform="rotate(100)"/><polyline points="0,0 60,0" transform="rotate(110)"/></g>
      </g>
    </svg>`,
    code: `import turtle

t = turtle.Turtle()
t.speed(3)
t.pensize(2)

# 太阳花：12 条放射状花瓣，每条从中心向外画 60 再退回
# 颜色每两条换一种，角度每次加 10 度（不写循环，逐条列出）
t.pencolor("red")
t.setheading(0);   t.forward(60); t.backward(60)
t.setheading(10);  t.forward(60); t.backward(60)
t.pencolor("orange")
t.setheading(20);  t.forward(60); t.backward(60)
t.setheading(30);  t.forward(60); t.backward(60)
t.pencolor("gold")
t.setheading(40);  t.forward(60); t.backward(60)
t.setheading(50);  t.forward(60); t.backward(60)
t.pencolor("green")
t.setheading(60);  t.forward(60); t.backward(60)
t.setheading(70);  t.forward(60); t.backward(60)
t.pencolor("blue")
t.setheading(80);  t.forward(60); t.backward(60)
t.setheading(90);  t.forward(60); t.backward(60)
t.pencolor("purple")
t.setheading(100); t.forward(60); t.backward(60)
t.setheading(110); t.forward(60); t.backward(60)`
  },
  {
    id: 'house',
    icon: '#e97461',
    title: '小房子 — 直线 + 颜色填充',
    description: '先用 begin_fill / end_fill 给矩形和三角形上色，再加一扇窗。四条边、三条边都一步一步画出来。',
    preview: `<svg viewBox="-90 -90 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="-60" y="0" width="120" height="60" fill="peachpuff" stroke="#1a2236" stroke-width="2"/>
      <polygon points="-60,0 60,0 0,-80" fill="tomato" stroke="#1a2236" stroke-width="2"/>
    </svg>`,
    code: `import turtle

t = turtle.Turtle()
t.speed(3)
t.pensize(2)

# 方块房子身子：连续 4 次「向前 + 左转 90 度」
t.fillcolor("peachpuff")
t.begin_fill()
t.forward(120)
t.left(90)
t.forward(120)
t.left(90)
t.forward(120)
t.left(90)
t.forward(120)
t.left(90)
t.end_fill()

# 三角形屋顶：连续 3 次「向前 + 左转 120 度」
t.penup()
t.goto(0, 120)
t.pendown()
t.fillcolor("tomato")
t.begin_fill()
t.forward(120)
t.left(120)
t.forward(120)
t.left(120)
t.forward(120)
t.left(120)
t.end_fill()`
  },
  {
    id: 'spiral',
    icon: '#7b5cff',
    title: '彩色螺旋 — 一圈圈向外盘',
    description: '用 circle 画一连串半圆，半径每次变大、颜色依次切换，自然就盘成一条螺旋。这里不写循环，每一步都明确写出来。',
    preview: `<svg viewBox="-90 -90 180 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1"><stop offset="0" stop-color="red"/><stop offset="0.5" stop-color="gold"/><stop offset="1" stop-color="blue"/></linearGradient>
      </defs>
      <path d="M 0,0 m -1,0
               q 5,-30 30,-25 q 35,8 30,40 q -5,40 -40,30
               q -45,-12 -30,-50 q 18,-40 60,-25 q 50,18 30,60"
            fill="none" stroke="url(#g1)" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    code: `import turtle

t = turtle.Turtle()
t.speed(0)
t.pensize(2)

# 一连串半圆，半径一次比一次大，颜色按顺序切换（不写循环）
t.pencolor("red");    t.circle(15, 180)
t.pencolor("orange"); t.circle(22, 180)
t.pencolor("gold");   t.circle(29, 180)
t.pencolor("green");  t.circle(36, 180)
t.pencolor("blue");   t.circle(43, 180)
t.pencolor("purple"); t.circle(50, 180)
t.pencolor("red");    t.circle(57, 180)
t.pencolor("orange"); t.circle(64, 180)
t.pencolor("gold");   t.circle(71, 180)
t.pencolor("green");  t.circle(78, 180)
t.pencolor("blue");   t.circle(85, 180)
t.pencolor("purple"); t.circle(92, 180)`
  },
  {
    id: 'sky',
    icon: '#2c4a8f',
    title: '满天星 — goto + 画点',
    description: '用 goto 把画笔移动到不同位置，原地画一个点，连起来就像满天星。这里把坐标一个个写出来，不使用循环。',
    preview: `<svg viewBox="-90 -90 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="-90" y="-90" width="180" height="180" fill="#0a1226"/>
      <g fill="white">
        <circle cx="-50" cy="-30" r="2"/>
        <circle cx="20" cy="-40" r="2"/>
        <circle cx="40" cy="0" r="2"/>
        <circle cx="-30" cy="40" r="2"/>
        <circle cx="60" cy="30" r="2"/>
        <circle cx="-70" cy="10" r="2"/>
        <circle cx="50" cy="50" r="2"/>
        <circle cx="-20" cy="-60" r="2"/>
        <circle cx="30" cy="-20" r="2"/>
        <circle cx="-60" cy="50" r="2"/>
        <circle cx="70" cy="-60" r="2"/>
        <circle cx="-10" cy="60" r="2"/>
      </g>
    </svg>`,
    code: `import turtle

t = turtle.Turtle()
t.speed(0)
t.pensize(2)
t.pencolor("white")

# 逐颗星星：移动到指定位置，原地画一个点（坐标一个个写，不使用循环）
t.penup(); t.goto(-50, -30); t.pendown(); t.dot(8, "white")
t.penup(); t.goto(20, -40);  t.pendown(); t.dot(8, "white")
t.penup(); t.goto(40, 0);    t.pendown(); t.dot(8, "white")
t.penup(); t.goto(-30, 40);  t.pendown(); t.dot(8, "white")
t.penup(); t.goto(60, 30);   t.pendown(); t.dot(8, "white")
t.penup(); t.goto(-70, 10);  t.pendown(); t.dot(8, "white")
t.penup(); t.goto(50, 50);   t.pendown(); t.dot(8, "white")
t.penup(); t.goto(-20, -60); t.pendown(); t.dot(8, "white")
t.penup(); t.goto(30, -20);  t.pendown(); t.dot(8, "white")
t.penup(); t.goto(-60, 50);  t.pendown(); t.dot(8, "white")
t.penup(); t.goto(70, -60);  t.pendown(); t.dot(8, "white")
t.penup(); t.goto(-10, 60);  t.pendown(); t.dot(8, "white")`
  }
];
