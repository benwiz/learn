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
const clearCanvas = (ctx) => {
  const x = 0;
  const y = 0;
  ctx.clearRect(x, y, ctx.canvas.width, ctx.canvas.height);
};

const drawVertex = (ctx, id, x, y) => {
  ctx.strokeStyle = 'rgba(255, 128, 0, 0.8)';
  ctx.fillStyle = 'rgba(255, 128, 0, 0.5)';

  const r = 12;
  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  ctx.beginPath();
  ctx.arc(x, y, r, startAngle, endAngle, false);
  ctx.stroke();
  ctx.fill();

  ctx.font = '12px Arial black';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(id, x, y);
};

const drawEdge = (ctx, x1, y1, x2, y2) => {
  ctx.strokeStyle = 'rgba(255, 128, 0, 0.8)';

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const drawTriangle = (ctx, x1, y1, x2, y2, x3, y3) => {
  ctx.fillStyle = 'rgba(255, 128, 0, 0.2)';
  ctx.strokeStyle = 'cyan';

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
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
      jsClearCanvas: () => clearCanvas(ctx),
      jsDrawVertex: (id, x, y) => drawVertex(ctx, id, x, y),
      jsDrawEdge: (x1, y1, x2, y2) => drawEdge(ctx, x1, y1, x2, y2),
      jsDrawTriangle: (x1, y1, x2, y2, x3, y3) => drawTriangle(ctx, x1, y1, x2, y2, x3, y3),
    },
  });

  return wasmModule;
};

//
// Main
//
const main = async () => {
  // Create the canvas
  const x = 0;
  const y = 0;
  const width = document.documentElement.scrollWidth;
  const height = document.documentElement.scrollHeight;
  const canvas = createCanvas(x, y, width, height);
  const ctx = canvas.getContext('2d');

  // Start the wasm module
  const wasmModule = await loadWasm(ctx);
  wasmModule.exports.start(width, height);
};

main();
