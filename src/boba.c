// program.c
#include <webassembly.h>

struct Vertex
{
    int x;
    int y;
};

extern setInterval(int (*callback)());
extern void jsDrawVertex(int x, int y);

void tick()
{
    console_log("tick");
}

export int runCallback(int (*callback)())
{
    return callback();
}

export void start()
{
    jsSetInterval(tick);
}
