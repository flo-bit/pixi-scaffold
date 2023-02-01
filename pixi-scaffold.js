import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.mjs";

export default class PixiScaffold {
  constructor(opts) {
    this.opts = opts ?? {};
    window.PIXI = PIXI;
    this.opts.PS = this;
    window.PS = this;
    this.app = new PIXI.Application();
    this.app.view.style.position = "absolute";
    this.app.view.style.top = "0px";
    this.app.view.style.left = "0px";
    document.body.appendChild(this.app.view);

    this.w = opts.w ?? 1000;
    this.h = opts.h ?? 1000;
    this.root = new PIXI.Container();
    this.app.stage.addChild(this.root);
    this.windowResized();

    this.keys = {};
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
    window.addEventListener("resize", this.windowResized.bind(this));

    if (this.opts.setup) this.opts.setup(this);
    let ticker = PIXI.Ticker.shared;
    ticker.add(this.animate.bind(this));
  }
  animate() {
    /* Update your scene here */
    let elapsed = PIXI.Ticker.shared.elapsedMS / 1000.0;
    let total = PIXI.Ticker.shared.lastTime / 1000.0;

    if (this.opts.update) this.opts.update(elapsed, total, this);
  }
  resizeRoot() {
    let w = window.innerWidth,
      h = window.innerHeight;
    let scl = Math.min(w / this.w, h / this.h);
    this.root.position.x = w / 2;
    this.root.position.y = h / 2;
    this.root.scale.x = scl;
    this.root.scale.y = scl;
  }
  windowResized() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.resizeRoot();
  }
  keyDown(event) {
    this.keys[event.key] = true;
  }
  keyUp(event) {
    this.keys[event.key] = false;
  }
  addChild(c) {
    this.root.addChild(c);
  }
}
