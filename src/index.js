import WebAssembly from 'webassembly';

console.log('Go: 2');

WebAssembly.load('./dist/hello.wasm').then((module) => {
  console.log(`1 + 2 = ${module.exports.add(1, 2)}`);
});
