/* =====================================================================
 * turtle-engine.js
 * JavaScript implementation of Python turtle API semantics.
 * Compatible with our Python-to-JS transpiler.
 * ===================================================================== */
(function (global) {
  'use strict';

  // ----- Utilities -----
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(c => {
      const h = Math.max(0, Math.min(255, Math.round(c))).toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
  }

  function parseColor(input) {
    if (Array.isArray(input)) {
      const [a, b, c] = input;
      if (a <= 1 && b <= 1 && c <= 1) return rgbToHex(a * 255, b * 255, c * 255);
      return rgbToHex(a, b, c);
    }
    if (typeof input === 'string') {
      const s = input.trim();
      // hex
      if (s.startsWith('#') && (s.length === 7 || s.length === 4)) {
        if (s.length === 4) {
          return '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
        }
        return s;
      }
      // rgb(r, g, b)
      const rgbMatch = s.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
      if (rgbMatch) return rgbToHex(+rgbMatch[1], +rgbMatch[2], +rgbMatch[3]);
      // named CSS color via canvas API
      if (Turtle.CANVAS_CTX) {
        Turtle.CANVAS_CTX.fillStyle = '#000';
        Turtle.CANVAS_CTX.fillStyle = s;
        const computed = Turtle.CANVAS_CTX.fillStyle;
        if (computed && computed.startsWith('#')) return computed;
        // Some browsers return rgb(...) — normalize
        const m = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (m) return rgbToHex(+m[1], +m[2], +m[3]);
      }
      return s;
    }
    return '#000';
  }

  // Single shared default turtle used when user calls module-level helpers.
  function makeTurtle(ctx, width, height) {
    return {
      __id: ++Turtle.__idSeq,

      // State
      _drawCount: 0,       // 实际落笔绘制次数（用于判定"是否真的画出了图形"）
      _x: 0, _y: 0,
      _heading: 0,         // degrees; 0 = +x (right); 90 = +y (up)
      _pendown: true,
      _pensize: 1,
      _pencolor: '#1a1a1a',
      _fillcolor: '#ffffff',
      _fill: false,
      _fillPath: [],
      _visible: true,
      _shape: 'classic',
      _speed: 3,
      _drawing: true,

      _ctx: ctx,
      _width: width,
      _height: height,

      // Drawing primitives
      _drawLine(toX, toY) {
        const ctx = this._ctx;
        if (!this._drawing) return;
        if (!this._pendown) return;
        const sx = this._x + this._width / 2;
        const sy = this._height / 2 - this._y;
        const tx = toX + this._width / 2;
        const ty = this._height / 2 - toY;
        // 仅当确实移动了（线长>0）才计为「画了图形」；forward(0)/penup 移动等不计入
        if (sx !== tx || sy !== ty) this._drawCount++;
        ctx.save();
        ctx.lineWidth = this._pensize;
        ctx.strokeStyle = this._pencolor;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.restore();
      },

      _drawTurtle() {
        if (!this._visible) return;
        const ctx = this._ctx;
        const sx = this._x + this._width / 2;
        const sy = this._height / 2 - this._y;
        const heading = this._heading; // 0 = right; 90 = up
        // In screen coords (y flipped) heading 90 = up means -90 from screen y axis.
        const angleScreen = -heading + Math.PI / 2;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(angleScreen);
        ctx.fillStyle = '#3aa757';
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-8, 6);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-8, -6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1a2236';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      },

      // ----- Public API mirroring Python turtle.Turtle -----
      forward(d) {
        if (this._fill) this._fillPath.push(['line', this._x, this._y]);
        const rad = this._heading * Math.PI / 180;
        const nx = this._x + d * Math.cos(rad);
        const ny = this._y + d * Math.sin(rad);
        this._drawLine(nx, ny);
        this._x = nx; this._y = ny;
        if (this._fill) this._fillPath.push(['line', this._x, this._y]);
      },
      fd: function (d) { this.forward(d); },

      backward(d) { this.forward(-d); },
      back: function (d) { this.backward(d); },
      bk: function (d) { this.backward(d); },

      left(angle) { this._heading += angle; },
      lt: function (a) { this.left(a); },
      right(angle) { this._heading -= angle; },
      rt: function (a) { this.right(a); },

      goto(x, y) {
        const nx = +x, ny = +y;
        if (this._fill) this._fillPath.push(['line', this._x, this._y]);
        this._drawLine(nx, ny);
        this._x = nx; this._y = ny;
        if (this._fill) this._fillPath.push(['line', this._x, this._y]);
      },
      setpos: function (x, y) { this.goto(x, y); },
      setposition: function (x, y) { this.goto(x, y); },

      setx(x) {
        const nx = +x;
        if (this._fill) this._fillPath.push(['line', this._x, this._y]);
        this._drawLine(nx, this._y);
        this._x = nx;
      },
      sety(y) {
        const ny = +y;
        if (this._fill) this._fillPath.push(['line', this._x, this._y]);
        this._drawLine(this._x, ny);
        this._y = ny;
      },

      setheading(angle) { this._heading = +angle; },
      seth: function (a) { this.setheading(a); },

      penup() { this._pendown = false; },
      up: function () { this.penup(); },
      pu: function () { this.penup(); },
      pendown() { this._pendown = true; },
      down: function () { this.pendown(); },
      pd: function () { this.pendown(); },

      pensize(w) { this._pensize = Math.max(0, +w); },
      width: function (w) { this.pensize(w); },

      pencolor() {
        if (arguments.length === 0) return this._pencolor;
        if (arguments.length === 1) this._pencolor = parseColor(arguments[0]);
        if (arguments.length === 3) this._pencolor = parseColor([arguments[0], arguments[1], arguments[2]]);
      },

      fillcolor() {
        if (arguments.length === 0) return this._fillcolor;
        if (arguments.length === 1) this._fillcolor = parseColor(arguments[0]);
        if (arguments.length === 3) this._fillcolor = parseColor([arguments[0], arguments[1], arguments[2]]);
      },

      color() {
        if (arguments.length === 0) return [this._pencolor, this._fillcolor];
        if (arguments.length === 1) {
          const c = parseColor(arguments[0]);
          this._pencolor = c;
          this._fillcolor = c;
        }
        if (arguments.length === 2) {
          this._pencolor = parseColor(arguments[0]);
          this._fillcolor = parseColor(arguments[1]);
        }
        if (arguments.length === 3) {
          const c = parseColor([arguments[0], arguments[1], arguments[2]]);
          this._pencolor = c;
          this._fillcolor = c;
        }
      },

      begin_fill() {
        this._fill = true;
        this._fillPath = [['move', this._x, this._y]];
      },
      end_fill() {
        if (!this._fill) return;
        this._fill = false;
        const ctx = this._ctx;
        ctx.save();
        ctx.fillStyle = this._fillcolor;
        ctx.beginPath();
        const w = this._width, h = this._height;
        for (const seg of this._fillPath) {
          if (seg[0] === 'move') ctx.moveTo(seg[1] + w / 2, h / 2 - seg[2]);
          else ctx.lineTo(seg[1] + w / 2, h / 2 - seg[2]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        // 只有路径里真的含线段（move + 至少一个 line）才算填充出了图形
        if (this._fillPath.length > 1) this._drawCount++;
        this._fillPath = [];
      },

      circle(radius, extent, steps) {
        let ext = extent != null ? extent : 360;
        let st = steps != null ? steps : Math.max(20, Math.round(Math.abs(ext * Math.PI * radius / 180 / 4)));
        const stepAngle = ext / st;
        const stepLength = 2 * Math.PI * radius * Math.abs(ext) / 360 / st;
        const startHeading = this._heading;
        for (let i = 0; i < st; i++) {
          this.forward(stepLength);
          if (ext > 0) this.left(stepAngle);
          else this.right(stepAngle);
        }
        this._heading = startHeading;
      },

      dot(size, color) {
        const r = size != null ? +size / 2 : Math.max(this._pensize + 4, 8);
        const c = color != null ? parseColor(color) : this._pencolor;
        const ctx = this._ctx;
        ctx.save();
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(this._x + this._width / 2, this._height / 2 - this._y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        this._drawCount++;
      },

      home() {
        this.goto(0, 0);
        this.setheading(0);
      },

      clear() {
        const ctx = this._ctx;
        ctx.save();
        ctx.fillStyle = parseColor(Turtle._bgColor || '#ffffff');
        ctx.fillRect(0, 0, this._width, this._height);
        ctx.restore();
      },

      reset() {
        this.clear();
        this._x = 0; this._y = 0;
        this._heading = 0;
        this._pendown = true;
        this._pensize = 1;
        this._pencolor = '#1a1a1a';
        this._fillcolor = '#ffffff';
      },

      hideturtle() { this._visible = false; },
      showturtle() { this._visible = true; },
      ht: function () { this.hideturtle(); },
      st: function () { this.showturtle(); },

      speed(s) {
        const v = +s;
        // Python turtle: speed accepts 0..10 where 0 = "fastest" (no animation).
        // Our synchronous engine always draws immediately, so speed only stores
        // the value — it must NEVER disable drawing.
        if (!isNaN(v)) this._speed = Math.max(0, Math.min(10, v));
      },

      write(text) {
        const ctx = this._ctx;
        ctx.save();
        ctx.fillStyle = '#1a2236';
        ctx.font = '13px "Noto Sans SC", sans-serif';
        ctx.textBaseline = 'middle';
        const sx = this._x + this._width / 2;
        const sy = this._height / 2 - this._y;
        ctx.fillText(String(text), sx + 6, sy);
        ctx.restore();
        this._drawCount++;
      }
    };
  }

  // ----- Module-level state -----
  const Turtle = {
    __idSeq: 0,
    CANVAS_CTX: null,
    _bgColor: '#ffffff',

    setCanvas(canvas) {
      this.CANVAS_CTX = canvas.getContext('2d');
      this._canvas = canvas;
    },

    clearBackground() {
      const ctx = this.CANVAS_CTX;
      if (!ctx) return;
      ctx.fillStyle = this._bgColor;
      ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    },

    bgcolor() {
      if (arguments.length === 0) return this._bgColor;
      this._bgColor = parseColor(arguments[0]);
      this.clearBackground();
    },

    makeTurtle,

    // Singleton instance for import-turtle-t-only style code:
    _singletons: [],
    create() {
      const t = makeTurtle(this.CANVAS_CTX, this._canvas.width, this._canvas.height);
      this._singletons.push(t);
      return t;
    }
  };

  global.Turtle = Turtle;
})(window);
