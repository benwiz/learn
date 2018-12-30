# Development notes

## How I learned to use Emscripten and compile a C program to WebAssembly

https://flaviocopes.com/webassembly/

## To compile

```sh
emcc test.c -s WASM=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"
```