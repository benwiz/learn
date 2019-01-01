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

## Notes

- The data structure of having an array for vertices, an array for edges, and an array for shapes is not ideal. I decided to take this structure from boba.js because the point of this project is to learn C and WASM not to create an optmized program. In this same vein, some of the updating algorithms can be optmized but I am more interested in C language optmizations like when to use values vs. addresses.

## To Do

- Move a dot across the screen
