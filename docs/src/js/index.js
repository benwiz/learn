import * as Boba from '@benwiz/boba.wasm';

// Initialize boba.wasmm options
const options = {
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
    a: 0.2,
  },
  // Edges
  drawEdges: true,
  edgeColor: {
    r: 101,
    g: 79,
    b: 240,
    a: 0.2,
  },
  // Triangles
  drawTriangles: true,
  triangleColor: {
    r: 101,
    g: 79,
    b: 240,
    a: 0.2,
  },
};
Boba.start(options, '1.0.2');
