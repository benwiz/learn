// import createInstance from './add.wasm';
// import createInstance from './a.out.wasm';
import Module from './hello';

console.log('Import index.js, 0');

// createInstance().then((m) => {
//   console.log(m);

//   // const res = m.instance.exports.add(1, 2);
//   // console.log(res);

//   // const res = m.instance.exports.hello();
//   // console.log(res);

//   const res = m.module.ccall('hello', null, null, null);
//   console.log(res);
// });

Module.onRuntimeInitialized = () => {
  console.log('runtime init');
  const hello = Module.cwrap('hello', 1, null, null);
  const res = hello();
  console.log('var hello =', res);
};

// const wasmModule = new WebAssembly.Module(Module);
// const instance = new WebAssembly.Instance(wasmModule, {
//   env: {},
// });

// console.log(instance);

// const importObject = {};
// WebAssembly.instantiateStreaming(fetch('./dist/hello.wasm'), importObject).then((obj) => {
//   console.log(obj);
// });
