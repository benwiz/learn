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

- Move a dot across the screen
