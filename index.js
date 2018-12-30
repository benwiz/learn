console.log("Hello from index.js");

Module.onRuntimeInitialized = function() {
  console.log("runtime init");
  var hello = Module.cwrap("hello", 1, null, null);
  var res = hello();
  console.log("var hello =", res);
};
