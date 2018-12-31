import WebAssembly from 'webassembly';

console.log('Go: 3');

WebAssembly.load('./node_modules/@benwiz/boba.wasm/dist/boba.wasm').then((module) => {
  console.log(`1 + 2 + 3 = ${module.exports.add(1, 2, 3)}`);
});
