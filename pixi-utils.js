import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.mjs";
import JSUtils from "https://flo-bit.github.io/js-utils/utils.js";
import Vector from "https://flo-bit.github.io/js-utils/vector.js";

const shapePresets = {};

class Shape extends PIXI.Graphics {
  constructor(opts) {
    super();
    opts = JSUtils.combine(opts, shapePresets);
    this.fillColor = opts.color ?? opts.fill ?? opts.c;
    this.fillAlpha = opts.fillAlpha ?? 1;

    this._strokeColor = opts.strokeColor ?? opts.stroke;
    this.strokeAlpha = opts.strokeAlpha ?? 1;
    this.strokeWeight = opts.strokeWeight ?? opts.weight ?? 1;

    this.setObservers();

    this.size = new Vector(
      opts.width ?? opts.w ?? opts.size ?? opts.s ?? 100,
      opts.height ?? opts.h ?? opts.size ?? opts.s ?? 100
    );

    this.shape = opts.shape ?? opts.type ?? "rect";

    this._cornerRadius = opts.cornerRadius ?? opts.corner ?? 0;

    this.a = opts.a;
    this.b = opts.b;

    if (opts.text) {
      let textOpts = JSUtils.merge(
        { text: opts.text },
        opts.style,
        opts.textStyle,
        opts.textOptions
      );
      this._text = new Text(textOpts);
      this.addChild(this._text);
    }

    Utils.applySettings(this, opts);
    this.redraw();
  }

  set text(text) {
    this._text.text = text;
  }
  get text() {
    return this._text.text;
  }
  set fontSize(t) {
    this._text.style.fontSize = t;
  }
  get fontSize() {
    return this._text.style.fontSize;
  }
  set fontColor(c) {
    this._text.style.fill = c;
  }
  get fontColor() {
    return this._text.style.fill;
  }

  get(name) {
    return this.getChild(name);
  }
  getChild(name) {
    return this.getChildByName(name);
  }

  add(c) {
    return Utils.addChild(this, c);
  }

  get cornerRadius() {
    return this._cornerRadius;
  }
  set cornerRadius(cR) {
    this._cornerRadius = cR;
    this.redraw();
  }

  setObservers() {
    if (this.fillColor?.isColor == true) {
      this.fillColor = this.fillColor.clone();
      this.fillColor.observer = this.redraw.bind(this);
    }
    if (this._strokeColor?.isColor == true) {
      this._strokeColor = this._strokeColor.clone();
      this._strokeColor.observer = this.redraw.bind(this);
    }
  }

  set color(c) {
    this.fill = c;
  }
  get color() {
    return this.fillColor;
  }
  set fill(c) {
    this.fillColor = c;
    this.setObservers();
    this.redraw();
  }
  get fill() {
    return this.fillColor;
  }

  set stroke(c) {
    this.strokeColor = c;
    this.setObservers();
  }
  get stroke() {
    return this._strokeColor;
  }
  set strokeColor(c) {
    this._strokeColor = c;
    this.redraw();
  }
  get strokeColor() {
    return this._strokeColor;
  }
  set weight(w) {
    this.strokeWeight = w;
    this.redraw();
  }
  get weight() {
    return this.strokeWeight;
  }

  set width(w) {
    this.size.x = w;
    this.redraw();
  }
  get width() {
    return this.size.x;
  }
  set height(h) {
    this.size.y = h;
    this.redraw();
  }
  get height() {
    return this.size.y;
  }

  move(x, y) {
    if (x) this.position.x += x;
    if (y) this.position.y += y;
  }

  setStroke(color, weight, alpha) {
    this.strokeColor = color;
    this.strokeWeight = weight;
    this.strokeAlpha = alpha;

    this.redraw();
  }

  redraw() {
    this.clear();

    if (this.fillColor != undefined)
      this.beginFill(this.fillColor?.hex ?? this.fillColor, this.fillAlpha);

    if (this._strokeColor != undefined)
      this.lineStyle(
        this.strokeWeight,
        this._strokeColor?.hex ?? this.strokeColor,
        this.strokeAlpha
      );

    if (this.shape == "rect") {
      if (this._cornerRadius <= 0) {
        this.drawRect(
          -this.size.x / 2,
          -this.size.y / 2,
          this.size.x,
          this.size.y
        );
      } else {
        this.drawRoundedRect(
          -this.size.x / 2,
          -this.size.y / 2,
          this.size.x,
          this.size.y,
          this._cornerRadius
        );
      }
    } else if (this.shape == "circle" || this.shape == "ellipse") {
      this.drawEllipse(0, 0, this.size.x / 2, this.size.y / 2);
    } else if (
      this.shape == "line" &&
      this.a != undefined &&
      this.b != undefined
    ) {
      this.moveTo(this.a.x, this.a.y);
      this.lineTo(this.b.x, this.b.y);
    }
  }
}

const spritePresets = {};

class Sprite extends PIXI.Sprite {
  constructor(opts) {
    opts = JSUtils.combine(opts, spritePresets);
    super(opts.texture);

    Utils.applySettings(this, opts);
  }

  add(c) {
    return Utils.addChild(this, c);
  }

  set tintColor(c) {
    if (c?.isColor == true) {
      c.observer = this.updateTint.bind(this);
      this._tintColor = c;
      this.tint = c.hex;
    }
    this.tint = c;
  }

  get tintColor() {
    return this._tintColor ?? this.tint;
  }

  updateTint(t) {
    super.tint = t?.hex;
  }
}

const containerPresets = {};

class Container extends PIXI.Container {
  constructor(opts) {
    opts = JSUtils.combine(opts, containerPresets);
    super();

    Utils.applySettings(this, opts);
  }

  add(c) {
    return Utils.addChild(this, c);
  }

  set tintColor(c) {
    if (c?.isColor == true) {
      c.observer = this.updateTint.bind(this);
      this._tintColor = c;
      this.tint = c.hex;
    }
    this.tint = c;
  }

  get tintColor() {
    return this._tintColor ?? this.tint;
  }

  updateTint(t) {
    super.tint = t?.hex;
  }
}

const graphicsPresets = {};

class Graphics extends PIXI.Graphics {
  constructor(opts) {
    opts = JSUtils.combine(opts, graphicsPresets);
    super();

    Utils.applySettings(this, opts);
  }

  add(c) {
    return Utils.addChild(this, c);
  }
}

const textPresets = {};

class Text extends PIXI.Text {
  constructor(opts) {
    opts = JSUtils.combine(opts, textPresets);
    let style = JSUtils.merge(opts.style, opts);
    super(opts.text, {
      fontFamily:
        style.fontFamily ?? style.textFamily ?? style.family ?? "Arial",
      fontSize: style.fontSize ?? style.textSize ?? style.size ?? 24,
      fill:
        style.fontColor ??
        style.textColor ??
        style.color ??
        style.fill ??
        style.c ??
        0xffffff,
      align: style.fontAlign ?? style.textAlign ?? style.align ?? "center",
      fontWeight:
        style.fontWeight ?? style.textWeight ?? style.weight ?? "normal",
    });

    Utils.applySettings(this, opts);
  }

  add(c) {
    Utils.addChild(this, c);
  }
}

const animatedSpritePresets = {};

class AnimatedSprite extends PIXI.AnimatedSprite {
  static splitTexture(baseTex, num, vertical) {
    let w = baseTex.width,
      h = baseTex.height;
    let sw = vertical != true ? w / num : w,
      sh = vertical != true ? h : h / num;
    let textures = [];
    for (let i = 0; i < num; i++) {
      let rect =
        vertical != true
          ? new PIXI.Rectangle(sw * i, 0, sw, sh)
          : new PIXI.Rectangle(0, sh * i, sw, sh);
      textures.push(new PIXI.Texture(baseTex, rect));
    }
    return textures;
  }

  constructor(opts) {
    opts = JSUtils.combine(opts, animatedSpritePresets);
    let textures;

    if (opts.textures) {
      textures = opts.textures;
    } else if (opts.split) {
      let texture = opts.texture;
      if (texture == undefined && opts.name) {
        texture = PS.textures[opts.name];
      }
      if (opts.split && texture) {
        textures = AnimatedSprite.splitTexture(
          texture,
          opts.split,
          opts.splitVertical ?? opts.vertical
        );
      } else {
      }
    }
    super(textures);

    Utils.applySettings(this, opts);

    this.animationSpeed = opts.animationSpeed ?? opts.speed ?? 1;
    this.loop = opts.loop ?? opts.loops ?? true;

    if (opts.autoPlay) this.gotoAndPlay(0);
  }

  add(c) {
    return Utils.addChild(this, c);
  }

  set tintColor(c) {
    if (c?.isColor == true) {
      c.observer = this.updateTint.bind(this);
      this._tintColor = c;
      this.tint = c.hex;
    }
    this.tint = c;
  }

  get tintColor() {
    return this._tintColor ?? this.tint;
  }

  updateTint(t) {
    super.tint = t?.hex;
  }
}

const animatedContainerPresets = {};

class AnimatedContainer extends PIXI.Container {
  constructor(opts) {
    opts = JSUtils.combine(opts, animatedContainerPresets);
    super();

    Utils.applySettings(this, opts);

    this.animations = {};
    this.availableAnimations = [];
    this.currentAnimation = undefined;

    for (const key of Object.keys(opts.animations)) {
      let data = opts.animations[key];

      data.animationSpeed =
        data.animationSpeed ??
        data.speed ??
        opts.animationSpeed ??
        opts.speed ??
        1;

      data.name = data.name ?? key;
      data.visible = false;
      data.tint = data.tint ?? opts.tint ?? 0xffffff;

      let sprite = new AnimatedSprite(data);

      this.addChild(sprite);
      this.animations[key] = sprite;

      if (data.toState) {
        sprite.onComplete = () => {
          this.state = data.toState;
          if (data.complete) data.complete(this);
        };
        sprite.loop = false;
      } else if (data.complete) {
        sprite.onComplete = () => {
          data.complete(this);
        };
      }

      if (data.start) {
        sprite.start = data.start;
      }
      this.availableAnimations.push(key);
    }
    if (opts.start) this.state = opts.start;
  }

  reverse() {
    this.reversed = !this.reversed;
    this.scale.x = -this.scale.x;
  }

  get state() {
    return this.currentAnimation;
  }
  set state(s) {
    this.show(s);
  }

  set speed(s) {
    let mult = s / (this._speed ?? 1);
    for (let child of this.children) {
      child.animationSpeed *= mult;
    }
    this._speed = s;
  }
  get speed() {
    return this._speed;
  }

  show(key) {
    if (this.currentAnimation == key) return;

    if (
      this.currentAnimation != undefined &&
      this.animations[this.currentAnimation]
    ) {
      this.animations[this.currentAnimation].visible = false;
    }

    this.currentAnimation = key;
    if (this.animations[key] == undefined) return;

    this.animations[key].visible = true;
    if (this.animations[key].start) this.animations[key].start(this);
    this.animations[key].gotoAndPlay(0);
  }

  add(c) {
    return Utils.addChild(this, c);
  }
}

const gridPresets = {};

class Grid extends Container {
  constructor(opts) {
    opts = JSUtils.combine(opts, gridPresets);
    super();

    let numX = opts.numX ?? opts.num ?? 1;
    let numY = opts.numY ?? opts.num ?? 1;

    let spacingX = opts.spacingX ?? opts.spacing ?? 0;
    let spacingY = opts.spacingY ?? opts.spacing ?? 0;

    for (let x = 0; x < numX; x++) {
      for (let y = 0; y < numY; y++) {
        let object = Utils.process(opts.object);
        object.x = x * (object.width + spacingX);
        object.y = y * (object.height + spacingY);
        object.xIndex = x;
        object.yIndex = y;

        this.add(object);
      }
    }
    Utils.applySettings(this, opts);

    if (opts.center != false) {
      let rect = this.getLocalBounds();
      this.x -= (rect.left + rect.right) / 2;
      this.y -= (rect.top + rect.bottom) / 2;
    }
  }
}

class Color {
  /**
   *
   * @param {number} r - red component, between 0 and 1
   * @param {number} g - green component, between 0 and 1
   * @param {number} b - blue component, between 0 and 1
   */
  constructor(r, g, b) {
    this._r = r;
    this._g = g;
    this._b = b;

    this.isColor = true;

    this.observer = undefined;

    this.checkComponents();
  }

  clone() {
    return new Color(this._r, this._g, this._b);
  }

  static hex(hex) {
    return new Color(
      ((hex >> 16) & 0xff) / 255,
      ((hex >> 8) & 0xff) / 255,
      (hex & 0xff) / 255
    );
  }

  static rgb(r, g, b) {
    return new Color(r, g, b);
  }

  static hsl(h, s, l) {
    let color = new Color(0, 0, 0);
    color.hsl = { h: h, s: s, l: l };
    return color;
  }

  checkComponents() {
    this._r = Math.max(0, Math.min(1, this._r));
    this._g = Math.max(0, Math.min(1, this._g));
    this._b = Math.max(0, Math.min(1, this._b));

    if (this.observer) this.observer(this);
  }

  set rgb(rgb) {
    this._r = rgb.r;
    this._g = rgb.g;
    this._b = rgb.b;
    this.checkComponents();
  }

  set r(r) {
    this._r = r;
    this.checkComponents();
  }
  get r() {
    return this._r;
  }
  set g(g) {
    this._g = g;
    this.checkComponents();
  }
  get g() {
    return this._g;
  }
  set b(b) {
    this._b = b;
    this.checkComponents();
  }
  get b() {
    return this._b;
  }

  get hex() {
    return ((this.r * 255) << 16) + ((this.g * 255) << 8) + this.b * 255;
  }
  set hex(hex) {
    this.r = ((hex >> 16) & 0xff) / 255;
    this.g = ((hex >> 8) & 0xff) / 255;
    this.b = (hex & 0xff) / 255;
    this.checkComponents();
  }

  get h() {
    return this.hue;
  }
  set h(h) {
    this.hue = h;
  }
  get s() {
    return this.saturation;
  }
  set s(s) {
    this.saturation = s;
  }
  get l() {
    return this.lightness;
  }
  set l(l) {
    this.lightness = l;
  }

  get hue() {
    return this.hsl.h;
  }
  set hue(hue) {
    let hsl = this.hsl;
    hsl.h = hue;
    this.hsl = hsl;
  }

  get saturation() {
    return this.hsl.s;
  }
  set saturation(saturation) {
    let hsl = this.hsl;
    hsl.s = saturation;
    this.hsl = hsl;
  }

  get lightness() {
    return this.hsl.l;
  }
  set lightness(lightness) {
    let hsl = this.hsl;
    hsl.l = lightness;
    this.hsl = hsl;
  }

  /**
   * Converts an RGB color value to HSL. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes r, g, and b are contained in the set [0, 1] and
   * returns {h: number, s:number, l:number} in the set [0, 1].
   *
   * @param   {number}  r       The red color value
   * @param   {number}  g       The green color value
   * @param   {number}  b       The blue color value
   * @return  {object}           The HSL representation
   */
  get hsl() {
    this.checkComponents();
    let r = this.r,
      g = this.g,
      b = this.b;
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h, s: s, l: l };
  }
  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are keys of hsl and contained in the set [0, 1] and
   * sets r, g, and b to numbers in the set [0, 0].
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */
  set hsl(hsl) {
    let r, g, b;
    let h = hsl.h - Math.floor(hsl.h),
      s = hsl.s,
      l = hsl.l;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    this.r = r;
    this.g = g;
    this.b = b;

    this.checkComponents();
    return this;
  }
}

class Utils {
  static applySettings(obj, opts) {
    obj.alpha = opts.alpha ?? 1;
    obj.name = opts.name;
    obj.interactive = opts.interactive ?? false;

    obj.x = opts.x ?? 0;
    obj.y = opts.y ?? 0;
    obj.zIndex = opts.zIndex ?? 0;

    obj.rotation = opts.rotation ?? 0;

    if (obj.anchor !== undefined) {
      obj.anchor.set(
        opts.anchorX ?? opts.anchor ?? 0.5,
        opts.anchorY ?? opts.anchor ?? 0.5
      );
    }

    obj.tintColor = opts.tint ?? 0xffffff;
    obj.scale.set(
      opts.scaleX ?? opts.scale ?? 1,
      opts.scaleY ?? opts.scale ?? 1
    );

    if (opts.width) obj.width = opts.width;
    if (opts.height) obj.height = opts.height;

    obj.visible = opts.visible ?? true;

    if (opts.mask) obj.mask = opts.mask;
    if (opts.hitArea) obj.hitArea = opts.hitArea;

    obj.sortableChildren = opts.sortChildren ?? opts.sort ?? true;

    if (opts.child) {
      obj.add(child);
    }
    if (opts.children) {
      for (let child of opts.children) {
        obj.add(child);
      }
    }
    obj.opts = opts;
    return obj;
  }

  static addChild(parent, child) {
    child = Utils.process(child);
    if (child == undefined) return;

    if (!Array.isArray(child)) {
      parent.addChild(child);
      return child;
    }

    for (let c of child) {
      parent.addChild(c);
    }
    return child;
  }

  static process(child) {
    if (child == undefined) return;

    if (Array.isArray(child)) {
      return child.map((c) => Utils.process(c));
    }
    if (typeof child == "function") {
      child = child(child);
    }

    if (child == undefined) return;
    // check if child is already a pixi object
    if (child.isSprite != undefined) {
      return child;
    }

    child = JSUtils.deepClone(child);

    // try to find type of object from type property
    if (child.type == "container") {
      return new Container(child);
    }
    if (child.type == "sprite") {
      return new Sprite(child);
    }
    if (child.type == "shape") {
      return new Shape(child);
    }
    if (child.type == "anim" || child.type == "animation") {
      return new AnimatedSprite(child);
    }
    if (child.type == "text") {
      return new Text(child);
    }
    if (child.type == "graphics") {
      return new Graphics(child);
    }
    if (child.type == "grid") {
      return new Grid(child);
    }

    // try to find type of object from other properties
    if (child.animations != undefined) {
      return new AnimatedContainer(child);
    }
    if (child.split != undefined || child.speed != undefined) {
      return new AnimatedSprite(child);
    }
    if (child.shape != undefined) {
      return new Shape(child);
    }
    if (child.texture != undefined) {
      return new Sprite(child);
    }
    if (child.text != undefined) {
      return new Text(child);
    }
    if (child.children != undefined) {
      return new Container(child);
    }

    return child;
  }
}

export {
  Shape,
  Utils,
  Sprite,
  Container,
  Graphics,
  Text,
  AnimatedSprite,
  AnimatedContainer,
  Grid,
  Color,
};
