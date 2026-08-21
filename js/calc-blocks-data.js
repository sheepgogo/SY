/* =====================================================================
 * calc-blocks-data.js
 * 20 个"计算/逻辑/变量"类积木 → Python 对照
 * 颜色：operators(绿)/sensing(蓝)/variables(橙) — 沿用 Scratch 习惯
 * ===================================================================== */
window.CALC_BLOCKS_DATA = [
  /* —— 1. 询问并等待（sensing · 蓝） —— */
  {
    id: 1, type: 'sense',
    label: '询问 [问] 并等待',
    match: '询问 <span class="num">你叫什么名字？</span> 并等待',
    description: '在终端弹出一个问题，等待用户在键盘输入一行文字后回车。Python 里用 <code>input("...")</code>，返回值始终是字符串。',
    python: [
      '# 弹一个问题，把用户的回答存进变量',
      'name = input("你叫什么名字？")',
      '',
      '# 也可以直接当作判断条件用',
      'if input("你叫什么名字？") == "小明":',
      '    print("你好小明！")'
    ],
    keyword: 'input',
    category: '侦测类'
  },

  /* —— 2. 平方根（operators · 绿） —— */
  {
    id: 2, type: 'ops',
    label: '平方根 [v]',
    match: '平方根 <span class="num">v</span>',
    description: '求一个非负数的平方根。Python 用 <code>math.sqrt(x)</code>（要先 <code>import math</code>）；也可以直接写 <code>x ** 0.5</code>，效果相同但不用 import。',
    python: [
      'import math',
      '',
      'math.sqrt(9)   # = 3.0',
      '16 ** 0.5      # = 4.0（不用 import math）'
    ],
    keyword: 'math.sqrt',
    aliases: ['** 0.5'],
    category: '运算类'
  },

  /* —— 3. 向上取整（operators） —— */
  {
    id: 3, type: 'ops',
    label: '向上取整 [v]',
    match: '向上取整 <span class="num">v</span>',
    description: '把小数"往上"取整到最近的整数（也叫"进一法"，<code>3.14 → 4</code>）。Python 用 <code>math.ceil(x)</code>。注意负数方向：<code>-1.2 → -1</code>（往"更大"的方向走）。',
    python: [
      'import math',
      '',
      'math.ceil(3.14)  # = 4',
      'math.ceil(-1.2)  # = -1'
    ],
    keyword: 'math.ceil',
    category: '运算类'
  },

  /* —— 4. 绝对值（operators） —— */
  {
    id: 4, type: 'ops',
    label: '绝对值 [v]',
    match: '绝对值 <span class="num">v</span>',
    description: '把负号去掉，只留大小。Python 用内置函数 <code>abs(x)</code>，**不用 import** 任何模块。',
    python: [
      'abs(-5)     # = 5',
      'abs(3.14)   # = 3.14',
      '',
      '# 常用：算两点距离的差',
      'gap = abs(x1 - x2)'
    ],
    keyword: 'abs',
    category: '运算类'
  },

  /* —— 5. 四舍五入（operators） —— */
  {
    id: 5, type: 'ops',
    label: '四舍五入 [v]',
    match: '四舍五入 <span class="num">v</span>',
    description: '把小数四舍五入到最近的整数。Python 用内置函数 <code>round(x)</code>，<strong>不用 import</strong>。',
    python: [
      'round(3.5)    # = 4',
      'round(3.4)    # = 3',
      '',
      '# 还能保留几位小数：round(x, n)',
      'round(3.14159, 2)  # = 3.14'
    ],
    keyword: 'round',
    category: '运算类'
  },

  /* —— 6. 包含（operators） —— */
  {
    id: 6, type: 'ops',
    label: '"苹果" 包含 "果" ?',
    match: '<span class="num">苹果</span> 包含 <span class="num">果</span> ?',
    description: '判断一个字符串里是否包含另一个子串。Python 用关键字 <code>in</code>，结果是 <code>True</code> / <code>False</code>。',
    python: [
      '"果" in "苹果"           # = True',
      '"apple" in "pineapple"  # = True',
      '"abc" in "xyz"          # = False',
      '',
      '# 配合 if 用：',
      'if "果" in fruit:',
      '    print("是水果！")'
    ],
    keyword: 'in',
    category: '运算类'
  },

  /* —— 7. 连接（operators） —— */
  {
    id: 7, type: 'ops',
    label: '连接 苹果 和 香蕉',
    match: '连接 <span class="num">苹果</span> 和 <span class="num">香蕉</span>',
    description: '把多个字符串拼成一个。Python 用 <code>+</code> 直接拼；批量拼一长串用 <code>"".join([...])</code> 更省事。',
    python: [
      '"苹果" + "香蕉"                    # = "苹果香蕉"',
      '"苹果" + "和" + "香蕉"              # = "苹果和香蕉"',
      '"".join(["苹果", "和", "香蕉"])     # = "苹果和香蕉"（批量）'
    ],
    keyword: '+ (字符串拼接)',
    aliases: ['join'],
    category: '运算类'
  },

  /* —— 8. = （operators · 比较） —— */
  {
    id: 8, type: 'ops',
    label: '○ = 50',
    match: '<span class="num">○</span> = <span class="num">50</span>',
    description: '判断两边是否<strong>相等</strong>。Python 用 <code>==</code>（两个等号）。注意：单个 <code>=</code> 是"赋值"，含义完全不同。',
    python: [
      '3 == 3           # = True',
      '"hi" == "hi"     # = True',
      '3 == 5           # = False',
      '',
      '# 错例（这是赋值，不是比较）：',
      'x = 3            # x 变成 3'
    ],
    keyword: '==',
    category: '运算类'
  },

  /* —— 9. < （operators · 比较） —— */
  {
    id: 9, type: 'ops',
    label: '○ < 50',
    match: '<span class="num">○</span> &lt; <span class="num">50</span>',
    description: '判断左边是否<strong>小于</strong>右边。Python 直接用 <code>&lt;</code>。',
    python: [
      '3 < 5     # = True',
      '5 < 5     # = False（不大于也不小于）',
      '',
      '# 配合 if：',
      'if score < 60:',
      '    print("不及格")'
    ],
    keyword: '<',
    category: '运算类'
  },

  /* —— 10. > （operators · 比较） —— */
  {
    id: 10, type: 'ops',
    label: '○ > 50',
    match: '<span class="num">○</span> &gt; <span class="num">50</span>',
    description: '判断左边是否<strong>大于</strong>右边。Python 直接用 <code>&gt;</code>。',
    python: [
      '7 > 5     # = True',
      '5 > 5     # = False',
      '',
      '# 比较运算符还能连写：',
      '0 < x < 100   # x 在 0~100 之间'
    ],
    keyword: '>',
    category: '运算类'
  },

  /* —— 11. 变量（variables · 橙） —— */
  {
    id: 11, type: 'var',
    label: '建立 / 设定 / 增加 变量',
    match: '将 <span class="num">my variable</span> 设为 <span class="num">0</span>',
    description: '"变量"在 Python 里就是<strong>赋值</strong>：用 <code>=</code> 创建/改值，用 <code>+=</code> 自增。变量名要符合规则（字母/数字/下划线，<strong>不能以数字开头</strong>）。',
    python: [
      '# 建立并赋值',
      'score = 0',
      '',
      '# 修改（重新赋值）',
      'score = 10',
      '',
      '# 自增 1',
      'score += 1     # 等价于 score = score + 1',
      '',
      '# 增加任意数',
      'score += 5'
    ],
    keyword: '= / +=',
    aliases: ['赋值'],
    category: '变量类'
  },

  /* —— 12. 向下取整（operators） —— */
  {
    id: 12, type: 'ops',
    label: '向下取整 [v]',
    match: '向下取整 <span class="num">v</span>',
    description: '把小数"往下"取整到最近的整数（也叫"去尾法"，<code>3.99 → 3</code>）。Python 用 <code>math.floor(x)</code>。',
    python: [
      'import math',
      '',
      'math.floor(3.99)  # = 3',
      'math.floor(-1.2)  # = -2（注意负数方向）',
      '',
      '# 想要"截掉小数"的更简便写法：',
      'int(3.99)         # = 3（与 math.floor 对正数等价）'
    ],
    keyword: 'math.floor',
    category: '运算类'
  },

  /* —— 13. 取余（operators） —— */
  {
    id: 13, type: 'ops',
    label: 'a 除以 b 的余数',
    match: '<span class="num">a</span> 除以 <span class="num">b</span> 的余数',
    description: '两个数相除的<strong>余数</strong>。Python 用 <code>%</code> 运算符。常用来判断"能否整除"、"奇偶"。',
    python: [
      '7 % 3     # = 1（7 除以 3 商 2 余 1）',
      '10 % 2    # = 0（被 2 整除）',
      '',
      '# 判断奇偶：',
      'n % 2 == 0    # True 表示偶数',
      '',
      '# 取个位/十位数字：',
      'num % 10      # 个位',
      'num // 10 % 10  # 十位'
    ],
    keyword: '%',
    category: '运算类'
  },

  /* —— 14. 不成立（operators · 逻辑） —— */
  {
    id: 14, type: 'ops',
    label: '不成立 [条件]',
    match: '不成立 <span class="num">条件</span>',
    description: '把 True 变 False、False 变 True（逻辑取反）。Python 用关键字 <code>not</code>。',
    python: [
      'not True            # = False',
      'not False           # = True',
      'not (3 > 5)         # = True（3>5 是 False，取反变 True）',
      '',
      '# 配合 if：',
      'if not finished:',
      '    print("还没结束")'
    ],
    keyword: 'not',
    category: '运算类'
  },

  /* —— 15. 或（operators · 逻辑） —— */
  {
    id: 15, type: 'ops',
    label: 'a 或 b',
    match: '<span class="num">a</span> 或 <span class="num">b</span>',
    description: '两个条件<strong>只要有一个</strong>为 True，结果就是 True。Python 用关键字 <code>or</code>。',
    python: [
      'True or False    # = True',
      'False or False   # = False',
      'True or True     # = True',
      '',
      '# 配合 if：',
      'if score < 0 or score > 100:',
      '    print("分数异常")'
    ],
    keyword: 'or',
    category: '运算类'
  },

  /* —— 16. 与（operators · 逻辑） —— */
  {
    id: 16, type: 'ops',
    label: 'a 与 b',
    match: '<span class="num">a</span> 与 <span class="num">b</span>',
    description: '两个条件<strong>都为 True</strong>，结果才是 True。Python 用关键字 <code>and</code>。',
    python: [
      'True and False   # = False',
      'True and True    # = True',
      'False and False  # = False',
      '',
      '# 配合 if（区间判断）：',
      'if age >= 18 and age <= 60:',
      '    print("青壮年")'
    ],
    keyword: 'and',
    category: '运算类'
  },

  /* —— 17. / （operators · 除） —— */
  {
    id: 17, type: 'ops',
    label: 'a / b',
    match: '<span class="num">a</span> / <span class="num">b</span>',
    description: '两个数相除。Python 用 <code>/</code>，结果<strong>总是浮点数</strong>（即使除得尽也会带 <code>.0</code>）。想要"整除"用 <code>//</code>。',
    python: [
      '6 / 3     # = 2.0（注意是 2.0 不是 2）',
      '7 / 2     # = 3.5',
      '',
      '# 整除（向下取整到整数）：',
      '7 // 2    # = 3',
      '',
      '# 除以 0 会报错，要先判断：',
      'if b != 0:',
      '    print(a / b)'
    ],
    keyword: '/',
    category: '运算类'
  },

  /* —— 18. * （operators · 乘） —— */
  {
    id: 18, type: 'ops',
    label: 'a * b',
    match: '<span class="num">a</span> * <span class="num">b</span>',
    description: '两个数相乘。Python 用 <code>*</code>。还能用来让<strong>字符串重复</strong>若干次。',
    python: [
      '3 * 4         # = 12',
      '2.5 * 4       # = 10.0',
      '',
      '# 字符串重复：',
      '"hi" * 3      # = "hihihi"',
      '"-" * 10      # = "----------"（画分隔线）'
    ],
    keyword: '*',
    category: '运算类'
  },

  /* —— 19. - （operators · 减） —— */
  {
    id: 19, type: 'ops',
    label: 'a - b',
    match: '<span class="num">a</span> - <span class="num">b</span>',
    description: '两个数相减。Python 用 <code>-</code>。写在数字前表示<strong>负数</strong>。',
    python: [
      '10 - 3    # = 7',
      '-5        # = 负五（直接写在数字前）',
      '',
      '# 自减：',
      'n -= 1    # 等价于 n = n - 1'
    ],
    keyword: '-',
    category: '运算类'
  },

  /* —— 20. + （operators · 加） —— */
  {
    id: 20, type: 'ops',
    label: 'a + b',
    match: '<span class="num">a</span> + <span class="num">b</span>',
    description: '两个数<strong>相加</strong>；或两个字符串<strong>拼接</strong>。Python 用同一个 <code>+</code>，根据类型自动决定。',
    python: [
      '3 + 4              # = 7（数字相加）',
      '"苹果" + "香蕉"     # = "苹果香蕉"（字符串拼接）',
      '',
      '# 数字和字符串不能直接 +，要 str() 转换：',
      '"我今年" + str(10) + "岁"  # = "我今年10岁"',
      '',
      '# 推荐用 f-string 更直观：',
      'f"我今年{10}岁"'
    ],
    keyword: '+',
    category: '运算类'
  }
];
