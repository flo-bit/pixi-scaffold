# PIXI scaffold

This is a scaffold for PIXI.js projects.

includes:

- automatic resizing of root container (fixed size) and canvas to window size
- keydown and keyup events
- setup and update functions

see [flo-bit.github.io/pixi-scaffold/](https://flo-bit.github.io/pixi-scaffold/) for a simple example.

## Usage

- import the `pixi-scaffold` module

```js
import PixiScaffold from "https://flo-bit.github.io/pixi-scaffold/pixi-scaffold.js";
```

- make a game class with a `setup` and `update` function

```js
class Game {
  setup(app) {
    // setup your game here
  }
  update(delta, total, app) {
    // update your game here
  }
}
```

- call `PixiScaffold.run` and pass an instance of your game class

```js
PixiScaffold.run(new Game());
```
