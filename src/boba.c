// program.c
#include <webassembly.h>

struct Vertex
{
    int x;
    int y;
};

extern void jsDrawVertex(int x, int y);

export void start()
{
    console_log("This is a log from C");
    jsDrawVertex(10, 30);
}
