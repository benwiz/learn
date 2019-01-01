#include <webassembly.h>

//
// External JavaScript functions
//
extern void jsSetInterval(void (*callback)());
extern void jsDrawVertex(int x, int y);
extern void jsClearCanvas();

//
// Structs
//
typedef struct
{
    float x;
    float y;
} Vertex;

typedef struct
{
    int id1;
    int id2;
} Edge;

//
// For now, global variables. Later, configs.
//
int NUM_VERTICES = 20;
int NUM_NEIGHBORS = 2;

//
// Global variables store the state
//
int WIDTH;
int HEIGHT;
Vertex VERTICES[NUM_VERTICES];
Edge EDGES[NUM_VERTICES * NUM_NEIGHBORS];

//
// Setup functions
//
void setupVertices()
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        float f = Math_random(); // (double)rand() / RAND_MAX;
        float x = f * WIDTH;

        f = Math_random(); // (double)rand() / RAND_MAX;
        float y = f * HEIGHT;

        VERTICES[i].x = x;
        VERTICES[i].y = y;
    }
}

//
// Update functions
//
void updateVertices()
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        Vertex *vertex = &VERTICES[i]; // ???: I am doing this thinking I am helping readability. Am I slowing anything down? Is this more readable?
        vertex->x += 0;
        vertex->y += 0;
    }
}

void updateEdges()
{
    // For each vertex
    int numVertices = sizeof(EDGES) / sizeof(Edge);
    for (int i = 0; i < n; i++)
    {
        Vertex *vertex = &VERTICES[i];
    }
}

//
// Draw functions
//
void drawVertices()
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        Vertex *vertex = &VERTICES[i];
        jsDrawVertex(vertex->x, vertex->y);
    }
}

//
// Loop functions
//
// tick executes the drawing and updating functions
void tick()
{
    // console_log("c.tick");

    // Clear canvas
    jsClearCanvas();

    // Call update functions
    updateVertices();

    // Call draw functions
    drawVertices();
}

// runCallback executes `tick` and is the entry point into the main loop
export int runCallback(void (*callback)())
{
    callback();
}

// start sets up vertices and begins the main loop
export void start(int width, int height)
{
    // Store width and height of canvas
    WIDTH = width;
    HEIGHT = height;

    // Seed rand
    srand(1); // time(NULL)

    // Call setup functions
    setupVertices();

    // Start loop
    jsSetInterval(tick);
}
