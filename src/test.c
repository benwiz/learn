#include <stdio.h>
#include <emscripten/emscripten.h>

int main(int argc, char **argv)
{
    printf("Main is called\n");
}

int EMSCRIPTEN_KEEPALIVE hello(int argc, char **argv)
{
    printf("Hello!\n");
    return 8;
}