#include <emscripten/emscripten.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    printf("Hello World\n");
}

int EMSCRIPTEN_KEEPALIVE hello(int argc, char **argv)
{
    printf("Hello!\n");
    return 8;
}
