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
struct Vertex
{
    int x;
    int y;
};

//
// Setup functions
//

//
// Update functions
//

//
// Draw functions
//

//
// Loop functions
//
// tick executes the drawing and updating functions
void tick()
{
    console_log("c.tick");
    jsClearCanvas();
}

// runCallback executes `tick` and is the entry point into the main loop
export int runCallback(void (*callback)())
{
    callback();
}

// start sets up vertices and begins the main loop
export void start()
{
    // Call setup functions
    // TODO: Set up vertices

    // Start loop
    jsSetInterval(tick);
}
