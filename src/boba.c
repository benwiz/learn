// program.c
#include <webassembly.h>

export int add(int a, int b, int c)
{
    console_log("This is a log from C");
    return a + b + c;
}
