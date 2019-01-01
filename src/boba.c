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
    int vertexID_A;
    int vertexID_B;
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
        // The following block simply creates an array that contains all pairs of indices where
        // the lower index comes first and uses the Edge struct.

        // Create a edge to all vertices other than itself. Use `k` to track the current index.
        int edgesForVertex[numVertices - 1];
        int k = 0;
        for (int j = 0; j < n; j++)
        {
            if (i == j)
                continue;

            // Create the edge so that vertexA has the lower id
            if (i < j)
            {
                edge->vertexID_A = i;
                edge->vertexID_B = j;
            }
            else
            {
                edge->vertexID_A = j;
                edge->vertexID_B = i;
            }

            // Update `edgesForVertex` index counter `k`
            k += 1;
        }

        // Now, we have an array `edgesForVertex` that contains every edge for the current vertex.
        // We want to only keep those edges that have the smallest Cartesian distance. To do this,
        // we must sort the array.

        // This code was a copy-paste but can be modified easily
        for (int n = 0; n < n; n++)
        {
            for (m = n + 1; m < n; m++)
            {
                // TODO: compare cartesian distances
                if (number[n] > number[m])
                {
                    a = number[n];
                    number[n] = number[m];
                    number[m] = a;
                }
            }
        }
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
