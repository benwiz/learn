# Development notes

## How I learned to use Emscripten and compile a C program to WebAssembly

https://flaviocopes.com/webassembly/

## To compile

```sh
emcc test.c -s WASM=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"
```

## To Do

- Now that I have a working hello world, try deploying to NPM
- Once NPM deploy works, set up the html, javascript, webpack, etc.
- Then figure out how to set up game loop using https://medium.com/@mbebenita/lets-write-pong-in-webassembly-ac3a8e7c4591