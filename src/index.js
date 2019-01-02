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

const drawVertex = (ctx, id, x, y, color) => {
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 2})`;

  const r = 12;
  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  ctx.beginPath();
  ctx.arc(x, y, r, startAngle, endAngle, false);
  ctx.stroke();
  ctx.fill();

  // ctx.font = '12px Arial black';
  // ctx.fillStyle = 'black';
  // ctx.textAlign = 'center';
  // ctx.fillText(id, x, y);
};

const drawEdge = (ctx, x1, y1, x2, y2, color) => {
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const drawTriangle = (ctx, x1, y1, x2, y2, x3, y3, color) => {
  ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  // ctx.closePath();
  ctx.fill();
};

//
// Wasm
//
const loadWasm = async (ctx, vertexColor, edgeColor, triangleColor) => {
  const wasmPath = './node_modules/@benwiz/boba.wasm/dist/boba.wasm'; // TODO: Solve the wasmPath
  const wasmModule = await WebAssembly.load(wasmPath, {
    imports: {
      jsSetInterval: (f, n) => {
        // setInterval is a JS function that calls the provided function every n milliseconds
        setInterval(() => wasmModule.exports.runCallback(f), n);
      },
      jsClearCanvas: () => clearCanvas(ctx),
      jsDrawVertex: (id, x, y) => drawVertex(ctx, id, x, y, vertexColor),
      jsDrawEdge: (x1, y1, x2, y2) => drawEdge(ctx, x1, y1, x2, y2, edgeColor),
      jsDrawTriangle: (x1, y1, x2, y2, x3, y3) => drawTriangle(ctx, x1, y1, x2, y2, x3, y3, triangleColor),
    },
  });

  return wasmModule;
};

//
// Start
//
export const start = async (options) => {
  // Create the canvas
  const canvas = createCanvas(options.x, options.y, options.width, options.height);
  const ctx = canvas.getContext('2d');

  // Start the wasm module
  const wasmModule = await loadWasm(
    ctx,
    options.vertexColor,
    options.edgeColor,
    options.triangleColor,
  );
  wasmModule.exports.start(
    options.width,
    options.height,
    options.vertexMinRadius,
    options.vertexMaxRadius,
    options.vertexMinSpeed,
    options.vertexMaxSpeed,
    options.drawVertices,
    options.drawEdges,
    options.drawTriangles,
  );
};

// const options = {
//   // Canvas
//   x: 0,
//   y: 0,
//   width: document.documentElement.scrollWidth,
//   height: document.documentElement.scrollHeight,
//   // Vertices
//   drawVertices: true,
//   vertexMinRadius: 8,
//   vertexMaxRadius: 16,
//   vertexMinSpeed: 0.5,
//   vertexMaxSpeed: 0.8,
//   vertexColor: {
//     r: 30,
//     g: 144,
//     b: 255,
//     a: 0.2,
//   },
//   // Edges
//   drawEdges: true,
//   edgeColor: {
//     r: 30,
//     g: 144,
//     b: 255,
//     a: 0.2,
//   },
//   // Triangles
//   drawTriangles: true,
//   triangleColor: {
//     r: 30,
//     g: 144,
//     b: 255,
//     a: 0.2,
//   },
// };
// start(options);
