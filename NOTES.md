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

- Is it normal to use global variables? What is the correct way to avoid global `VERTICES`, `EDGES`, and `SHAPES` array? Should I?
- I think I understand when to use value and when to use pointer, but not sure.
- If I have an array of structs, can I set an element to NULL or set the pointer for that index to NULL? I couldn't figure it out. I think exactly what I'm imagining isn't possible.

## Notes

- The data structure of having an array for vertices, an array for edges, and an array for shapes is not ideal. I decided to take this structure from boba.js because the point of this project is to learn C and WASM not to create an optmized program. In this same vein, some of the updating algorithms, `updateEdges` for example, can be greatly optmized but I am more interested in C language optmizations, for exmaple when to use values vs. addresses.
- I'm fairly certain I have some triangle duplicates, but I haven't checked. It's ok though because it causes variation in color which looks nice.
- I think I must leave many of the configs as global variables in C because it's better to not pass the data back and forth between WebAssembly and JavaScript

## Algorithm Optimizations

- `updateEdges` creates all possible edges, there almost certainly a way of simply finding the N-nearest neighbors without checking all neighbors. This would remove the need for the following sort algorithm.
- `updateEdges` uses selection sort which runs in O(n^2). Choose a faster sorting algorithm.

## To Do

- Set up configuration tooling
  - Colors
  - Num vertices
  - Num neighbors
  - Get default configs function from JS
- Update readme
- Deploy to NPM
- Create demo website
- Final deploy to NPM
- Update benwiz.io to use boba.wasm instead of boba.js
