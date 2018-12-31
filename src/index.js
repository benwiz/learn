import WebAssembly from 'webassembly';

// The path to the wasm binary. I need to figure out how to make it work with webpack bundler.
const wasmPath = './node_modules/@benwiz/boba.wasm/dist/boba.wasm';

const run = (module) => {
  console.log(`SUM = ${module.exports.add(1, 2, 3)}`);
};

// Load the wasm
WebAssembly.load(wasmPath).then(run);
