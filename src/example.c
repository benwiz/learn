#define W 1024
#define H 1024

extern print(char *message);
extern jsClearRect(int x, int y, int width, int height);
extern jsFillRect(int x, int y, int width, int height);
extern setInterval(int (*callback)());

int runCallback(int (*callback)()) { return callback(); }

typedef struct Vec2
{
    float x;
    float y;
} Vec2;

typedef struct Rect
{
    float x;
    float y;
    float w;
    float h;
} Rect;

typedef enum Type
{
    WALL,
    BALL
} Type;

typedef struct Object
{
    Type t;
    Rect r; // Bounds
    Vec2 v; // Velocity
} Object;

Object world[] = {
    {.r = {0, 0, W, 32}},      // Top Wall
    {.r = {0, H - 32, W, 32}}, // Bottom Wall
    {.r = {-32, 0, 32, H}},    // Left Wall
    {.r = {W, 0, 32, H}},      // Right Wall
    {.r = {16, H / 2 - 128 / 2, 32, 128}},
    {.r = {W - 48, H / 2 - 128 / 2, 32, 128}},
    {.t = BALL, .r = {W / 2, H / 2, 32, 32}, .v = {2.9f, 1.7f}} // Ball 1
};

int drawWorld()
{
    int c = sizeof(world) / sizeof(Object);
    for (int i = 0; i < c; i++)
    {
        Rect r = world[i].r;
        jsFillRect(r.x, r.y, r.w, r.h);
    }
}

int valueInRange(float value, float min, float max)
{
    return (value >= min) && (value <= max);
}

int rectOverlap(Rect *A, Rect *B)
{
    int xOverlap =
        valueInRange(A->x, B->x, B->x + B->w) || valueInRange(B->x, A->x, A->x + A->w);
    int yOverlap =
        valueInRange(A->y, B->y, B->y + B->h) || valueInRange(B->y, A->y, A->y + A->h);
    return xOverlap && yOverlap;
}

void move(Object *o)
{
    int c = sizeof(world) / sizeof(Object);

    Rect n = o->r;
    n.x += o->v.x;
    n.y += o->v.y;

    for (int i = 0; i < c; i++)
    {
        Rect r = world[i].r;
        if (world[i].t == o->t)
        {
            continue;
        }
        if (o != &world[i] && rectOverlap(&n, &r))
        {
            // X Axis
            n = o->r;
            n.x += o->v.x;
            if (rectOverlap(&n, &r))
            {
                o->v.x *= -1;
            }
            // Y Axis
            n = o->r;
            n.y += o->v.y;
            if (rectOverlap(&n, &r))
            {
                o->v.y *= -1;
            }
            // Move
            n.x += o->v.x;
            n.y += o->v.y;
        }
    }
    o->r = n;
}

int tick()
{
    jsClearRect(0, 0, W, H);
    drawWorld();
    move(&world[6]);
}

int main()
{
    setInterval(tick);
    return 42;
}