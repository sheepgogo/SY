/* =====================================================================
 * typing-words.js
 * 常见 Python 单词库：英文单词 + 英语发音（IPA）+ 中文解释 + 例句
 * 按「中国电子学会 · 全国青少年软件编程等级考试（Python）1-4 级考纲」
 * 分成 4 类（level）：一级 / 二级 / 三级 / 四级。
 *
 * 考纲定位（摘自官方标准）：
 *   一级 —— 简单数学运算与 Turtle 海龟画图：熟悉编程环境，编写顺序结构的程序
 *   二级 —— 核心数据类型（列表/字典/字符串/range）+ 顺序、分支、循环结构
 *   三级 —— 算法（解析/枚举/排序/查找）、简单数据处理、异常处理、核心内置函数
 *   四级 —— 函数及自定义函数、递归与分治、扩展库（模块）思维
 * ===================================================================== */

/* 四个类别（对应考级 1-4 级），含考纲范围说明，供 UI 展示 */
window.TYPING_LEVELS = [
  { id: 'level1', name: '一级', scope: '简单数学运算 + Turtle 海龟画图 + 顺序结构 + 输入输出 + 变量与类型转换 + 基础逻辑运算' },
  { id: 'level2', name: '二级', scope: '核心数据类型（列表 / 字典 / 字符串 / range）+ 分支与循环控制（if/elif/else、for/while、break/continue）' },
  { id: 'level3', name: '三级', scope: '异常处理（try/except）+ 文件与数据处理 + 常用核心内置函数 + 基础算法（枚举 / 排序 / 查找）' },
  { id: 'level4', name: '四级', scope: '函数定义与调用、参数与返回值、变量作用域 + 模块导入（import/from/as）+ 面向对象与递归/分治思想' }
];

window.TYPING_WORDS = [
  /* ===================== 一级 ===================== */
  /* —— Turtle 海龟画图（考纲一级：前进/后退/左右转/提落笔/画点/画圆） —— */
  { word: 'turtle',     phonetic: '/ˈtɜːrtl/',     zh: '海龟绘图库，本网站的主角', level: '一级', ex: 'import turtle' },
  { word: 'forward',    phonetic: '/ˈfɔːrwərd/',    zh: '让小海龟向前走', level: '一级', ex: 't.forward(100)' },
  { word: 'backward',   phonetic: '/ˈbækwərd/',     zh: '让小海龟向后退', level: '一级', ex: 't.backward(50)' },
  { word: 'left',       phonetic: '/left/',         zh: '向左转（逆时针）', level: '一级', ex: 't.left(90)' },
  { word: 'right',      phonetic: '/raɪt/',         zh: '向右转（顺时针）', level: '一级', ex: 't.right(90)' },
  { word: 'penup',      phonetic: '/ˈpen ʌp/',      zh: '抬笔（移动时不画线）', level: '一级', ex: 't.penup()' },
  { word: 'pendown',    phonetic: '/ˈpen daʊn/',    zh: '落笔（恢复画线）', level: '一级', ex: 't.pendown()' },
  { word: 'goto',       phonetic: '/ˈɡoʊ tuː/',     zh: '移动到指定的 (x, y) 坐标', level: '一级', ex: 't.goto(0, 0)' },
  { word: 'circle',     phonetic: '/ˈsɜːrkl/',      zh: '画一个圆', level: '一级', ex: 't.circle(80)' },
  { word: 'color',      phonetic: '/ˈkʌlər/',       zh: '设置画笔颜色', level: '一级', ex: 't.color("red")' },
  { word: 'pensize',    phonetic: '/ˈpen saɪz/',    zh: '设置画笔粗细', level: '一级', ex: 't.pensize(3)' },
  { word: 'speed',      phonetic: '/spiːd/',        zh: '设置绘制速度', level: '一级', ex: 't.speed(3)' },
  { word: 'write',      phonetic: '/raɪt/',         zh: '在画布上写文字', level: '一级', ex: 't.write("hi")' },
  { word: 'begin_fill', phonetic: '/bɪˈɡɪn fɪl/',   zh: '开始填充图形内部', level: '一级', ex: 't.begin_fill()' },
  { word: 'end_fill',   phonetic: '/end fɪl/',      zh: '结束填充，给图形上色', level: '一级', ex: 't.end_fill()' },

  /* —— 输入输出（考纲一级：IPO 输入-处理-输出） —— */
  { word: 'print',      phonetic: '/prɪnt/',       zh: '把内容打印到屏幕上', level: '一级', ex: 'print("hello")' },
  { word: 'input',      phonetic: '/ˈɪnpʊt/',      zh: '读取用户从键盘输入', level: '一级', ex: 'name = input("?")' },

  /* —— 变量与类型转换（考纲一级：会对变量类型进行转换） —— */
  { word: 'int',        phonetic: '/ɪnt/',          zh: '转换成整数', level: '一级', ex: 'int("7")' },
  { word: 'float',      phonetic: '/floʊt/',        zh: '转换成小数（浮点数）', level: '一级', ex: 'float("3.14")' },
  { word: 'str',        phonetic: '/str/',          zh: '转换成字符串', level: '一级', ex: 'str(42)' },

  /* —— 布尔与空值（考纲一级：逻辑运算基本概念） —— */
  { word: 'True',       phonetic: '/truː/',        zh: '真（布尔值）', level: '一级', ex: 'running = True' },
  { word: 'False',      phonetic: '/fɔːls/',       zh: '假（布尔值）', level: '一级', ex: 'done = False' },
  { word: 'None',       phonetic: '/nʌn/',         zh: '空值 / 什么都没有', level: '一级', ex: 'result = None' },

  /* —— 逻辑运算（考纲一级：逻辑运算的基本概念） —— */
  { word: 'and',        phonetic: '/ænd/',         zh: '并且（两个条件都要成立）', level: '一级', ex: 'if a > 0 and b > 0:' },
  { word: 'or',         phonetic: '/ɔːr/',         zh: '或者（满足其一即可）', level: '一级', ex: 'if a or b:' },
  { word: 'not',        phonetic: '/nɑːt/',        zh: '非（取反）', level: '一级', ex: 'if not empty:' },
  { word: 'is',         phonetic: '/ɪz/',          zh: '判断是不是同一个对象', level: '一级', ex: 'if x is None:' },

  /* ===================== 二级 ===================== */
  /* —— 分支结构（考纲二级：单分支/二分支/多分支） —— */
  { word: 'if',         phonetic: '/ɪf/',          zh: '如果（条件成立就执行）', level: '二级', ex: 'if x > 0:' },
  { word: 'elif',       phonetic: '/ˈelif/',       zh: '否则如果（再判断一个条件）', level: '二级', ex: 'elif x == 0:' },
  { word: 'else',       phonetic: '/els/',         zh: '否则（前面都不成立时执行）', level: '二级', ex: 'else:' },

  /* —— 循环结构（考纲二级：for/while、break/continue、range 类型） —— */
  { word: 'for',        phonetic: '/fɔːr/',        zh: 'for 循环，遍历一组数', level: '二级', ex: 'for i in range(4):' },
  { word: 'while',      phonetic: '/waɪl/',        zh: '当条件为真时反复执行', level: '二级', ex: 'while running:' },
  { word: 'range',      phonetic: '/reɪndʒ/',      zh: '生成一串连续的数字', level: '二级', ex: 'range(10)' },
  { word: 'break',      phonetic: '/breɪk/',       zh: '立刻跳出循环', level: '二级', ex: 'break' },
  { word: 'continue',   phonetic: '/kənˈtɪnjuː/',  zh: '跳过本次循环，进入下一轮', level: '二级', ex: 'continue' },
  { word: 'in',         phonetic: '/ɪn/',          zh: '在……里面 / 属于（也用于 for 遍历）', level: '二级', ex: 'for i in [1,2,3]' },
  { word: 'pass',       phonetic: '/pæs/',         zh: '空语句，占位用（啥也不做）', level: '二级', ex: 'pass' },

  /* —— 核心数据类型（考纲二级：列表、元组、集合、字典、字符串、range） —— */
  { word: 'list',       phonetic: '/lɪst/',         zh: '列表，一排有序的元素', level: '二级', ex: 'a = list(range(3))' },
  { word: 'tuple',      phonetic: '/ˈtjuːpəl/',     zh: '元组，不可修改的一组有序元素', level: '二级', ex: 't = (1, 2, 3)' },
  { word: 'set',        phonetic: '/set/',          zh: '集合，一组不重复的元素', level: '二级', ex: 's = {1, 2, 3}' },
  { word: 'dict',       phonetic: '/dɪkt/',         zh: '字典，用“键”存“值”', level: '二级', ex: 'd = {"a": 1}' },

  /* ===================== 三级 ===================== */
  /* —— 异常处理（考纲三级：try-except 结构语句） —— */
  { word: 'try',        phonetic: '/traɪ/',        zh: '尝试执行可能出错的代码', level: '三级', ex: 'try:' },
  { word: 'except',     phonetic: '/ɪkˈsept/',     zh: '如果出错了就执行这里', level: '三级', ex: 'except ZeroDivisionError:' },
  { word: 'finally',    phonetic: '/ˈfaɪnəli/',    zh: '无论对错最后都会执行', level: '三级', ex: 'finally:' },

  /* —— 文件与数据处理（考纲三级：with 管理资源、一维/二维数据读写） —— */
  { word: 'with',       phonetic: '/wɪð/',         zh: '自动管理资源（如打开文件）', level: '三级', ex: 'with open("a.txt") as f:' },

  /* —— 常用核心内置函数（考纲三级：记住常用核心内置函数的功能及用法） —— */
  { word: 'len',        phonetic: '/len/',          zh: '求长度（几个元素）', level: '三级', ex: 'len([1,2,3])' },
  { word: 'type',       phonetic: '/taɪp/',         zh: '查看一个数据的类型', level: '三级', ex: 'type(3)' },
  { word: 'sum',        phonetic: '/sʌm/',          zh: '求和', level: '三级', ex: 'sum([1,2,3])' },
  { word: 'sorted',     phonetic: '/ˈsɔːrtɪd/',     zh: '排序（从小到大）', level: '三级', ex: 'sorted([3,1,2])' },
  { word: 'min',        phonetic: '/mɪn/',          zh: '求最小值', level: '三级', ex: 'min([3,1,2])' },
  { word: 'max',        phonetic: '/mæks/',         zh: '求最大值', level: '三级', ex: 'max([3,1,2])' },
  { word: 'abs',        phonetic: '/æbs/',          zh: '求绝对值', level: '三级', ex: 'abs(-5)' },
  { word: 'round',      phonetic: '/raʊnd/',        zh: '四舍五入（保留小数位）', level: '三级', ex: 'round(3.14159, 2)' },
  { word: 'bool',       phonetic: '/buːl/',         zh: '转换成布尔值（真 / 假）', level: '三级', ex: 'bool(0)' },
  { word: 'open',       phonetic: '/ˈoʊpən/',       zh: '打开一个文件', level: '三级', ex: 'open("a.txt", "r")' },
  { word: 'enumerate',  phonetic: '/ɪˈnjuːməreɪt/', zh: '遍历时同时拿到下标和元素', level: '三级', ex: 'for i, v in enumerate(lst):' },
  { word: 'zip',        phonetic: '/zɪp/',          zh: '把多个序列按位置一一配对', level: '三级', ex: 'zip(a, b)' },
  { word: 'any',        phonetic: '/ˈeni/',         zh: '只要有一个为真就返回真', level: '三级', ex: 'any([False, True])' },
  { word: 'all',        phonetic: '/ɔːl/',          zh: '全部为真才返回真', level: '三级', ex: 'all([True, True])' },
  { word: 'format',     phonetic: '/ˈfɔːrmæt/',     zh: '格式化字符串（占位填值）', level: '三级', ex: '"{}岁".format(8)' },
  { word: 'isinstance', phonetic: '/aɪzˈɪnstəns/',  zh: '判断一个对象是不是某类型', level: '三级', ex: 'isinstance(x, int)' },

  /* ===================== 四级 ===================== */
  /* —— 函数（考纲四级：函数及过程、参数、返回值、变量作用域） —— */
  { word: 'def',        phonetic: '/def/',         zh: '定义（definition）一个函数', level: '四级', ex: 'def draw():' },
  { word: 'return',     phonetic: '/rɪˈtɜːrn/',    zh: '函数返回一个结果', level: '四级', ex: 'return x + 1' },
  { word: 'global',     phonetic: '/ˈɡloʊbl/',     zh: '声明使用全局变量', level: '四级', ex: 'global score' },
  { word: 'lambda',     phonetic: '/ˈlæmdə/',      zh: '写一个匿名的小函数', level: '四级', ex: 'f = lambda x: x*2' },

  /* —— 模块 / 扩展库（考纲四级：模块的功能、获取、安装、调用） —— */
  { word: 'import',     phonetic: '/ɪmˈpɔːrt/',   zh: '导入——把别人写好的模块拿进来用', level: '四级', ex: 'import turtle' },
  { word: 'from',       phonetic: '/frʌm/',        zh: '从某个模块里导入指定的东西', level: '四级', ex: 'from math import pi' },
  { word: 'as',         phonetic: '/æz/',          zh: '给导入的东西起一个别名', level: '四级', ex: 'import turtle as t' },

  /* —— 面向对象 / 进阶（考纲四级：模块思维、函数形式代码复用的延伸） —— */
  { word: 'class',      phonetic: '/klæs/',        zh: '定义一个类（对象的模板）', level: '四级', ex: 'class Cat:' }
];
