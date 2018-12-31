# Development notes

## How I learned to use Emscripten and compile a C program to WebAssembly

https://flaviocopes.com/webassembly/

## To compile

Source environment variables.

Use my alias

```sh
emsdk_env
```

or the full command

```sh
source $HOME/code/vendor/emsdk/emsdk_env.sh
```

Compile `test.c` to wasm

```sh
emcc test.c -s WASM=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"
```

## To Do

- Now that I have a working hello world, try deploying to NPM
- Once NPM deploy works, set up the html, javascript, webpack, etc.
- Then figure out how to set up game loop using https://medium.com/@mbebenita/lets-write-pong-in-webassembly-ac3a8e7c4591
