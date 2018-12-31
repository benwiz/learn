import WebAssembly from 'webassembly';

// Function to create canvas
const createCanvas = (x, y, width, height) => {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // Set css-based location
  canvas.style.position = 'absolute';
  canvas.style.left = String(x);
  canvas.style.top = String(y);
  canvas.style.zIndex = '-1';

  // Append canvas to dom and return canvas
  document.body.appendChild(canvas);
  return canvas;
};

// Create the canvas
const canvas = createCanvas(
  0,
  0,
  document.documentElement.scrollWidth,
  document.documentElement.scrollHeight,
);
const ctx = canvas.getContext('2d');

// Load and initialize the wasm binary
// TODO: Sort out the wasmPath
const wasmPath = './node_modules/@benwiz/boba.wasm/dist/boba.wasm';
let cCallback;
const options = {
  imports: {
    jsSetInterval: (f, n) => {
      setInterval(() => {
        // module.exports.runCallback(f); // TODO: How do I access the callback before I have the module?
        cCallback(f);
      }, n);
    },
    jsDrawVertex: (x, y) => {
      console.log('vertex:', x, y);
      ctx.fillStyle = 'orange';
      const w = 20;
      const h = 20;
      ctx.fillRect(x, y, w, h);
    },
  },
};
WebAssembly.load(wasmPath, options).then((module) => {
  cCallback = module.exports.runCallback;

  // Call a function that enables C to control the game loop
  module.exports.start();
});
