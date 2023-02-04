import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.mjs";
import * as PixiUtils from "https://flo-bit.github.io/pixi-utils/pixi-utils.js";

export default class PixiScaffold {
  constructor(opts) {
    this.opts = opts ?? {};
    window.PIXI = PIXI;
    this.opts.PS = this;
    window.PS = this;
    this.app = new PIXI.Application(this.opts.renderOptions);
    this.app.view.style.position = "absolute";
    this.app.view.style.top = "0px";
    this.app.view.style.left = "0px";
    document.body.appendChild(this.app.view);

    this.w = opts.w ?? 1000;
    this.h = opts.h ?? 1000;
    this.root = new PIXI.Container();
    this.root.sortableChildren = true;
    this.app.stage.addChild(this.root);
    this.windowResized();

    this.keys = {};
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
    window.addEventListener("resize", this.windowResized.bind(this));

    if (this.opts.assets) {
      this.load();
      return;
    }

    this.setup();
  }

  load() {
    for (let k of Object.keys(this.opts.assets)) {
      PIXI.Assets.add(k, this.opts.assets[k]);
    }

    const texturesPromise = PIXI.Assets.load(Object.keys(this.opts.assets));
    texturesPromise.then(this.loadingFinished.bind(this));
  }

  loadingFinished(textures) {
    this.textures = textures ?? {};
    this.setup();
  }

  setup() {
    if (this.opts.setup) this.opts.setup(this);
    this.start();
  }

  start() {
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
    let w = document.documentElement.clientWidth,
      h = document.documentElement.clientHeight;
    let scl = Math.min(w / this.w, h / this.h);
    this.root.position.x = w / 2;
    this.root.position.y = h / 2;
    this.root.scale.x = scl;
    this.root.scale.y = scl;
  }
  windowResized() {
    // using clientWidth and clientHeight instead of innerWidth and innerHeight
    // because of weird ios web app behavior which doesn't update innerWidth and innerHeight immediately
    this.app.renderer.resize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight
    );
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
    return c;
  }
  add(c) {
    return PixiUtils.Utils.addChild(this.root, c);
  }
}
