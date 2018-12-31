import WebAssembly from 'webassembly';

const main = async () => {
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
  const width = document.documentElement.scrollWidth;
  const height = document.documentElement.scrollHeight;
  const canvas = createCanvas(0, 0, width, height);
  const ctx = canvas.getContext('2d');

  // Load and initialize the wasm binary
  // TODO: Sort out the wasmPath
  const wasmPath = './node_modules/@benwiz/boba.wasm/dist/boba.wasm';
  const wasmModule = await WebAssembly.load(wasmPath, {
    imports: {
      jsSetInterval: (f, n) => {
        // setInterval is a JS function that calls the provided function every n milliseconds
        setInterval(() => {
          wasmModule.exports.runCallback(f);
        }, n);
      },
      jsDrawVertex: (x, y) => {
        ctx.fillStyle = 'orange';
        const w = 20;
        const h = 20;
        ctx.fillRect(x, y, w, h);
      },
      jsClearCanvas: (x, y) => {
        ctx.clearRect(x, y, width, height);
      },
    },
  });
  wasmModule.exports.start();

  // .then((module) => {
  //   // Call a function that enables C to control the game loop
  //   module.exports.start();
  // });
};

main();
