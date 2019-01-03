# boba.wasm

Boba.wasm is animated background mostly written in C and and compiled to WebAssembly. Drawing is handled by JavaScript and HTML5 Canvas. Published to [NPM](https://www.npmjs.com/package/@benwiz/boba.wasm).

[Demo](https://benwiz.io/boba.wasm/)

## Why

This was a project to learn how to use WebAssembly and to re-learn C.

## How to Use

#### Using a CDN

No CDN option yet. I need to change WebPack `output.libraryTarget` to `var` to make this work.

#### Using ES6 modules

Install the package

```sh
npm install @benwiz/boba.wasm
```

Import the package, override any options, then call the `Boba.start(options, version)` function.

```js
import * as Boba from '@benwiz/boba.wasm';

// Initialize boba.wasmm options
const options = {
  // Canvas
  x: 0,
  y: 0,
  width: document.documentElement.scrollWidth,
  height: document.documentElement.scrollHeight,
  // Vertices
  drawVertices: true,
  vertexMinRadius: 8,
  vertexMaxRadius: 16,
  vertexMinSpeed: 0.5,
  vertexMaxSpeed: 1.0,
  vertexColor: {
    r: 101,
    g: 79,
    b: 240,
    a: 0.2,
  },
  // Edges
  drawEdges: true,
  edgeColor: {
    r: 101,
    g: 79,
    b: 240,
    a: 0.2,
  },
  // Triangles
  drawTriangles: true,
  triangleColor: {
    r: 101,
    g: 79,
    b: 240,
    a: 0.2,
  },
};

// Start the animation
Boba.start(bobaOptions, '1.0.2');
```

#### Mobile considerations

If using the default canvas height `document.documentElement.scrollHeight`, ensure the following CSS is used to ensure the HTML document is the full height of the mobile browser.

```css
html {
  height: 100%;
}
```

## Development

See [NOTES.md](./NOTES.md) for development notes and a to do list.
