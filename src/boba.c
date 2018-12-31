// program.c
#include <webassembly.h>

struct Vertex
{
    int x;
    int y;
};

extern void jsSetInterval(void (*callback)());
extern void jsDrawVertex(int x, int y);
extern void jsClearCanvas();

void tick()
{
    console_log("c.tick");
    jsClearCanvas();
}

export int runCallback(void (*callback)())
{
    console_log("c.runCallback");
    callback();
}

export void start()
{
    console_log("c.start");
    jsSetInterval(tick);
}
