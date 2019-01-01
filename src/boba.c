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

//
// Global variables store the state
//
int WIDTH;
int HEIGHT;
Vertex VERTICES[20];

//
// Setup functions
//
void setupVertices()
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        float f = (double)rand() / RAND_MAX;
        float x = f * WIDTH;

        f = (double)rand() / RAND_MAX;
        float y = f * HEIGHT;

        VERTICES[i].x = x;
        VERTICES[i].y = y;
    }
}

//
// Update functions
//

//
// Draw functions
//
void drawVertices()
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        console_log("%lf, %lf", VERTICES[i].x, VERTICES[i].y);
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

    // TODO: Call update functions

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

    // Prime the `rand` function
    rand();

    // Call setup functions
    setupVertices();

    // Start loop
    jsSetInterval(tick);
}
