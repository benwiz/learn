# boba.wasm

Boba.wasm is animated background JavaScript module published to [NPM](https://www.npmjs.com/package/@benwiz/boba.wasm).

[Demo](https://benwiz.io/boba.wasm/)

## Why

I created a background for my website but wanted to be able to make it re-usable. Creating the NPM module was an excuse to practice TypeScript and learn how to publish an NPM module.

## How to Use

#### Using a CDN

In the `body`, import the script then call `Boba.start()` and pass in the configuration options.

```html
<script src="https://unpkg.com/@benwiz/boba.wasm@latest/dist/bundle.js"></script>
<script>
  const options = Boba.getDefaultOptions();

  var color1 = { r: 255, g: 0, b: 0, a: 0.1 };
  options.vertexColors = [color1];
  options.edgeColors = [color1];

  var color2 = { r: 255, g: 0, b: 0, a: 0.05 };
  options.shapeColors = [color2];

  Boba.start(options);
</script>
```

#### Using ES6 modules

Install the package

```sh
npm install @benwiz/boba.wasm
```

Import the package, override any options, then call the `Boba.start()` function.

```js
import * as Boba from '@benwiz/boba.wasm';

// Initialize boba.wasm options by grabbing the defaults
const bobaOptions = Boba.getDefaultOptions();

// Canvas configs
bobaOptions.x = 0;
bobaOptions.y = 0;
bobaOptions.width = document.documentElement.scrollWidth;
bobaOptions.height = document.documentElement.scrollHeight;

// Vertex configs
bobaOptions.numVertices = 40;
bobaOptions.drawVertices = true;
bobaOptions.vertexMinSize = 8;
bobaOptions.vertexMaxSize = 16;
bobaOptions.vertexMinSpeed = 0.5;
bobaOptions.vertexMaxSpeed = 2;
bobaOptions.vertexColors = [
  {
    r: 0,
    g: 255,
    b: 0,
    a: 0.1,
  },
];

// Edge configs
bobaOptions.numNeighbors = 2;
bobaOptions.drawEdges = true;
bobaOptions.edgeColors = [
  {
    r: 0,
    g: 255,
    b: 0,
    a: 0.1,
  },
];

// Shape configs
bobaOptions.drawShapes = true;
bobaOptions.shapeColors = [
  {
    r: 0,
    g: 255,
    b: 0,
    a: 0.05,
  },
];

// Start the animation
Boba.start(bobaOptions);
```

#### Mobile considerations

If using the default canvas height `document.documentElement.scrollHeight`, ensure the following CSS is used to ensure the HTML document is the full height of the mobile browser.

```css
html {
  height: 100%;
}
```

#### `stop` function

Call `Boba.stop()` to stop the animation and remove the canvas. Right now, call `stop` then `start` if options are changed. In the future, I'd like to handle changing options more elegantly.

## Development

See [NOTES.md](./NOTES.md) for development notes and a to do list.
