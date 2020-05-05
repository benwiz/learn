/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _boba = __webpack_require__(1);

var Boba = _interopRequireWildcard(_boba);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Initialize boba.wasmm options
var options = {
  // Canvas
  x: 0,
  y: 0,
  width: document.documentElement.scrollWidth,
  height: document.documentElement.scrollHeight,
  // Vertices
  drawVertices: true,
  vertexMinRadius: 8,
  vertexMaxRadius: 16,
  vertexMinSpeed: 0.5,
  vertexMaxSpeed: 1.0,
  vertexColor: {
    r: 101,
    g: 79,
    b: 240,
    a: 0.2
  },
  // Edges
  drawEdges: true,
  edgeColor: {
    r: 101,
    g: 79,
    b: 240,
    a: 0.2
  },
  // Triangles
  drawTriangles: true,
  triangleColor: {
    r: 101,
    g: 79,
    b: 240,
    a: 0.2
  }
};
Boba.start(options, '1.0.2');

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports =
/******/function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/var installedModules = {};
    /******/
    /******/ // The require function
    /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
            /******/return installedModules[moduleId].exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
            /******/i: moduleId,
            /******/l: false,
            /******/exports: {}
            /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/__webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/__webpack_require__.c = installedModules;
    /******/
    /******/ // define getter function for harmony exports
    /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
            /******/Object.defineProperty(exports, name, {
                /******/configurable: false,
                /******/enumerable: true,
                /******/get: getter
                /******/ });
            /******/
        }
        /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
            return module['default'];
        } :
        /******/function getModuleExports() {
            return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/__webpack_require__.p = "";
    /******/
    /******/ // Load entry module and return exports
    /******/return __webpack_require__(__webpack_require__.s = 0);
    /******/
}(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.start = undefined;

    var _webassembly = __webpack_require__(1);

    var _webassembly2 = _interopRequireDefault(_webassembly);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
    }

    //
    // Canvas
    //
    var createCanvas = function createCanvas(x, y, width, height) {
        // Create canvas
        var canvas = document.createElement('canvas');
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
    var clearCanvas = function clearCanvas(ctx) {
        var x = 0;
        var y = 0;
        ctx.clearRect(x, y, ctx.canvas.width, ctx.canvas.height);
    };

    var drawVertex = function drawVertex(ctx, id, x, y, color) {
        ctx.strokeStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
        ctx.fillStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a / 2 + ')';

        var r = 12;
        var startAngle = 0;
        var endAngle = 2 * Math.PI;

        ctx.beginPath();
        ctx.arc(x, y, r, startAngle, endAngle, false);
        ctx.stroke();
        ctx.fill();

        // ctx.font = '12px Arial black';
        // ctx.fillStyle = 'black';
        // ctx.textAlign = 'center';
        // ctx.fillText(id, x, y);
    };

    var drawEdge = function drawEdge(ctx, x1, y1, x2, y2, color) {
        ctx.strokeStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    var drawTriangle = function drawTriangle(ctx, x1, y1, x2, y2, x3, y3, color) {
        ctx.fillStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';

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
    var loadWasm = async function loadWasm(wasmPath, ctx, vertexColor, edgeColor, triangleColor) {
        var wasmModule = await _webassembly2.default.load(wasmPath, {
            imports: {
                jsSetInterval: function jsSetInterval(f, n) {
                    // setInterval is a JS function that calls the provided function every n milliseconds
                    setInterval(function () {
                        return wasmModule.exports.runCallback(f);
                    }, n);
                },
                jsClearCanvas: function jsClearCanvas() {
                    return clearCanvas(ctx);
                },
                jsDrawVertex: function jsDrawVertex(id, x, y) {
                    return drawVertex(ctx, id, x, y, vertexColor);
                },
                jsDrawEdge: function jsDrawEdge(x1, y1, x2, y2) {
                    return drawEdge(ctx, x1, y1, x2, y2, edgeColor);
                },
                jsDrawTriangle: function jsDrawTriangle(x1, y1, x2, y2, x3, y3) {
                    return drawTriangle(ctx, x1, y1, x2, y2, x3, y3, triangleColor);
                }
            }
        });

        return wasmModule;
    };

    //
    // Start
    //
    var start = exports.start = async function start(options, version) {
        // Create the canvas
        var canvas = createCanvas(options.x, options.y, options.width, options.height);
        var ctx = canvas.getContext('2d');

        // Start the wasm module
        var wasmPath = 'https://unpkg.com/@benwiz/boba.wasm@' + version + '/dist/boba.wasm';
        var wasmModule = await loadWasm(wasmPath, ctx, options.vertexColor, options.edgeColor, options.triangleColor);
        wasmModule.exports.start(options.width, options.height, options.vertexMinRadius, options.vertexMaxRadius, options.vertexMinSpeed, options.vertexMaxSpeed, options.drawVertices, options.drawEdges, options.drawTriangles);
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
    // start(options, version);

    /***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

    "use strict";

    module.exports = __webpack_require__(2);

    /***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

    "use strict";

    if (typeof window !== "undefined" && window) window.webassembly = exports;

    // Common aliases
    var getOwnPropertyNames = Object.getOwnPropertyNames;

    /**
     * Describes a module instance as returned by {@link load}.
     * @interface IModule
     * @property {Object.<string,*>} exports Exports
     * @property {Object.<string,*>} imports Imports
     * @property {IMemory} memory Memory
     * @property {Object.<string,*>} env Environment
     */

    /**
     * Describes a module memory instance.
     * @interface IMemory
     * @property {ArrayBuffer} buffer Underlying buffer
     * @property {number} initial=1 Specified initial amount of memory in 64k pages
     * @property {number} [maximum] If specified, maximum amount of memory in 64k pages
     * @property {Uint8Array} U8 Byte-level view
     * @property {Uint32Array} U32 Aligned unsigned 32-bit integer view
     * @property {Int32Array} S32 Aligned signed 32-bit integer view
     * @property {Float32Array} F32 Aligned 32-bit float view
     * @property {Float64Array} F64 Aligned 64-bit double view
     * @property {GetInt} getInt Reads a 32-bit signed integer starting at the specified memory offset (aligned to 4 bytes)
     * @property {GetUint} getUint Reads a 32-bit unsigned integer starting at the specified memory offset (aligned to 4 bytes)
     * @property {GetFloat} getFloat Reads a 32-bit float starting at the specified memory offset (aligned to 4 bytes)
     * @property {GetDouble} getDouble Reads a 64-bit double starting at the specified memory offset (aligned to 8 bytes)
     * @property {GetString} getString Reads the (zero-terminated, exclusive) string starting at the specified memory offset (aligned to 4 bytes)
     */

    /**
     * Loads a WebAssembly.
     * @param {string} file File name
     * @param {LoadOptions} [options] Options
     * @returns {Promise.<IModule>} Promise resolving to the instantiated module
     */
    function load(file, options) {

        /**
         * Options as used by {@link load}.
         * @interface LoadOptions
         * @property {number} [initialMemory=1] Initial memory in pages of 64k
         * @property {number} [maximumMemory] Maximum memory in pages of 64k
         * @property {Object.<string,*>} [imports] Imports
         */

        options || (options = {});

        var imports = options.imports || {};

        // Initialize memory

        var memory = imports.memory;
        if (!memory) {
            var opts = { initial: options.initialMemory || 1 };
            if (options.maximumMemory) opts.maximum = options.maximumMemory;
            memory = new WebAssembly.Memory(opts);
            memory.initial = options.initialMemory || 1;
            memory.maximum = options.maximumMemory;
        }

        var table = imports.table;
        if (!table) table = new WebAssembly.Table({ initial: 0, element: "anyfunc" });

        function grow() {
            var buf = memory.buffer;
            memory.U8 = new Uint8Array(buf);
            memory.S32 = new Int32Array(buf);
            memory.U32 = new Uint32Array(buf);
            memory.F32 = new Float32Array(buf);
            memory.F64 = new Float64Array(buf);
        }

        grow();

        // Add utilty to memory

        /**
         * Reads a 32-bit signed integer starting at the specified memory offset.
         * @typedef GetInt
         * @function
         * @param {number} ptr Memory offset
         * @returns {number} Signed 32-bit integer value
         */
        function getInt(ptr) {
            return memory.S32[ptr >> 2];
        }

        memory.getInt = getInt;

        /**
         * Reads a 32-bit unsigned integer starting at the specified memory offset.
         * @typedef GetUint
         * @function
         * @param {number} ptr Memory offset
         * @returns {number} Unsigned 32-bit integer value
         */
        function getUint(ptr) {
            return memory.U32[ptr >> 2];
        }

        memory.getUint = getUint;

        /**
         * Reads a 32-bit float starting at the specified memory offset.
         * @typedef GetFloat
         * @function
         * @param {number} ptr Memory offset
         * @returns {number} 32-bit float value
         */
        function getFloat(ptr) {
            return memory.F32[ptr >> 2];
        }

        memory.getFloat = getFloat;

        /**
         * Reads a 64-bit double starting at the specified memory offset.
         * @typedef GetDouble
         * @function
         * @param {number} ptr Memory offset
         * @returns {number} 64-bit float value
         */
        function getDouble(ptr) {
            return memory.F64[ptr >> 3];
        }

        memory.getDouble = getDouble;

        /**
         * Reads a (zero-terminated, exclusive) string starting at the specified memory offset.
         * @typedef GetString
         * @function
         * @param {number} ptr Memory offset
         * @returns {string} String value
         */
        function getString(ptr) {
            var start = ptr >>>= 0;
            while (memory.U8[ptr++]) {}
            getString.bytes = ptr - start;
            return String.fromCharCode.apply(null, memory.U8.subarray(start, ptr - 1));
        }

        memory.getString = getString;

        // Initialize environment

        var env = {};

        env.memoryBase = imports.memoryBase || 0;
        env.memory = memory;
        env.tableBase = imports.tableBase || 0;
        env.table = table;

        // Add console to environment

        function sprintf(ptr, base) {
            var s = getString(ptr);
            return base ? s.replace(/%([dfisu]|lf)/g, function ($0, $1) {
                var val;
                return base += $1 === "u" ? (val = getUint(base), 4) : $1 === "f" ? (val = getFloat(base), 4) : $1 === "s" ? (val = getString(getUint(base)), 4) : $1 === "lf" ? (val = getDouble(base), 8) : (val = getInt(base), 4), val;
            }) : s;
        }

        getOwnPropertyNames(console).forEach(function (key) {
            if (typeof console[key] === "function") // eslint-disable-line no-console
                env["console_" + key] = function (ptr, base) {
                    console[key](sprintf(ptr, base)); // eslint-disable-line no-console
                };
        });

        // Add Math to environment

        getOwnPropertyNames(Math).forEach(function (key) {
            if (typeof Math[key] === "function") env["Math_" + key] = Math[key];
        });

        // Add imports to environment

        Object.keys(imports).forEach(function (key) {
            return env[key] = imports[key];
        });

        // Add default exit listeners if not explicitly imported

        if (!env._abort) env._abort = function (errno) {
            throw Error("abnormal abort in " + file + ": " + errno);
        };
        if (!env._exit) env._exit = function (code) {
            if (code) throw Error("abnormal exit in " + file + ": " + code);
        };

        // Finally, fetch the assembly and instantiate it

        env._grow = grow;

        return (typeof fetch === "function" && fetch || fetch_node)(file).then(function (result) {
            return result.arrayBuffer();
        }).then(function (buffer) {
            return WebAssembly.instantiate(buffer, { env: env });
        }).then(function (module) {
            var instance = module.instance;
            instance.imports = imports;
            instance.memory = memory;
            instance.env = env;
            return instance;
        });
    }

    exports.load = load;

    // Internal fetch API polyfill for node that doesn't trigger webpack
    var fs;
    function fetch_node(file) {
        return new Promise(function (resolve, reject) {
            return (fs || (fs = eval("equire".replace(/^/, "r"))("fs"))).readFile(file, function (err, data) {
                return err ? reject(err) : resolve({ arrayBuffer: function arrayBuffer() {
                        return data;
                    } });
            });
        });
    }

    /***/
}]
/******/);
//# sourceMappingURL=bundle.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map