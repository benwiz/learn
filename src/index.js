import WebAssembly from 'webassembly';

//
// Canvas
//
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

//
// Drawing function
// Generally (maybe always?) these will map 1:1 to the WASM-C imports
//
const drawVertex = (ctx, x, y) => {
  ctx.fillStyle = 'orange';
  const w = 20;
  const h = 20;
  ctx.fillRect(x, y, w, h);
};

const clearCanvas = (ctx, x, y) => {
  ctx.clearRect(x, y, ctx.canvas.width, ctx.canvas.height);
};

//
// Wasm
//
const loadWasm = async (ctx) => {
  const wasmPath = './node_modules/@benwiz/boba.wasm/dist/boba.wasm'; // TODO: Solve the wasmPath
  const wasmModule = await WebAssembly.load(wasmPath, {
    imports: {
      jsSetInterval: (f, n) => {
        // setInterval is a JS function that calls the provided function every n milliseconds
        setInterval(() => wasmModule.exports.runCallback(f), n);
      },
      jsDrawVertex: (x, y) => drawVertex(ctx, x, y), // May have return type issues
      jsClearCanvas: (x, y) => clearCanvas(ctx, x, y), // May have return type issues
    },
  });

  return wasmModule;
};

//
// Main
//
const main = async () => {
  // Create the canvas
  const canvasX = 0;
  const canvasY = 0;
  const canvasWidth = document.documentElement.scrollWidth;
  const canvasHeight = document.documentElement.scrollHeight;
  const canvas = createCanvas(canvasX, canvasY, canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Start the wasm module
  const wasmModule = await loadWasm(ctx);
  wasmModule.exports.start();
};

main();
