# Development notes

This is my first real C program.

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

## Things that confuse me about C

- Is it normal to use global variables? How can I avoid using a global `VERTICES` array?

## To Do

- Move a dot across the screen
