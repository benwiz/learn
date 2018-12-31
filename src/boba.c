// program.c
#include <webassembly.h>

extern void jsFillRect(int x);

export int add(int a, int b, int c)
{
    console_log("This is a log from C");
    jsFillRect(99);
    return a + b + c;
}
