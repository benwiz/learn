#include <webassembly.h>

#define MAX(a, b) \
    ({ __typeof__ (a) _a = (a); \
       __typeof__ (b) _b = (b); \
     _a > _b ? _a : _b; })
#define MIN(a, b) \
    ({ __typeof__ (a) _a = (a); \
       __typeof__ (b) _b = (b); \
     _a < _b ? _a : _b; })

//
// Constant definitions that are being used as configs
// TODO: Figure out how not to use constants for configs, because
// they are not configurable
//
#define MAX_NUM_VERTICES 3
#define MAX_NUM_NEIGHBORS 2
#define MAX_NUM_EDGES 6      // MAX_NUM_VERTICES * MAX_NUM_NEIGHBORS
#define MAX_NUM_TRIANGLES 10 // N! / 3(N-3)! = max num possible triangles

//
// Global variables that are being used as configs. Better to set here than
// to pass between WebAssembly and JavaScript every iteration of the loop.
//
int WIDTH;
int HEIGHT;
int NUM_NEIGHBORS;
bool DRAW_VERTICES;
bool DRAW_EDGES;
bool DRAW_TRIANGLES;

//
// External JavaScript functions
//
extern void jsSetInterval(void (*callback)());
extern void jsClearCanvas();
extern void jsDrawVertex(int id, float x, float y);
extern void jsDrawEdge(float x1, float y1, float x2, float y2);
extern void jsDrawTriangle(float x1, float y1, float x2, float y2, float x3, float y3);

//
// Structs
//
typedef struct
{
    float x;
    float y;
    float radius;
    float speed;
    float angle;
} Vertex;

typedef struct
{
    int vertexID_A;
    int vertexID_B;
} Edge;

typedef struct
{
    int vertexID_A;
    int vertexID_B;
    int vertexID_C;
} Triangle;

//
// Global variables store the state
//
int N = 6;
Vertex VERTICES[MAX_NUM_VERTICES];
Edge EDGES[MAX_NUM_EDGES];
Triangle TRIANGLES[MAX_NUM_TRIANGLES];

//
// Math functions
//
float distance(float x1, float y1, float x2, float y2)
{
    float a = Math_pow((x1 - x2), 2);
    float b = Math_pow((y1 - y2), 2);
    float c = Math_sqrt(a + b);
    return c;
}

float getRandomFloat(float min, float max)
{
    return Math_random() * (max - min) + min;
}

float degToRadians(float angle)
{
    return angle * (Math_PI / 180);
}

//
// Util functions
//
bool edgeExists(int vertexID_A, int vertexID_B)
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        Edge *edge = &EDGES[i];
        if ((edge->vertexID_A == vertexID_A && edge->vertexID_B == vertexID_B) ||
            (edge->vertexID_A == vertexID_B && edge->vertexID_B == vertexID_A))
        {
            return true;
        }
    }

    return false;
}

//
// Setup functions
//
void setupConfigs(int width, int height, int numNeighbors, bool drawVertices, bool drawEdges, bool drawTriangles)
{
    WIDTH = width;
    HEIGHT = height;
    NUM_NEIGHBORS = numNeighbors;
    DRAW_VERTICES = drawVertices;
    DRAW_EDGES = drawEdges;
    DRAW_TRIANGLES = drawTriangles;
}

void setupVertices(float minRadius, float maxRadius, float minSpeed, float maxSpeed)
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        Vertex *vertex = &VERTICES[i];

        vertex->x = getRandomFloat(0, WIDTH - 1);
        vertex->y = getRandomFloat(0, HEIGHT - 1);
        vertex->radius = getRandomFloat(minRadius, maxRadius);
        vertex->speed = getRandomFloat(minSpeed, maxSpeed);
        vertex->angle = getRandomFloat(0, 360);
    }
}

void setupEdges()
{
    int n = sizeof(EDGES) / sizeof(Edge);
    for (int i = 0; i < n; i++)
    {
        EDGES[i].vertexID_A = -1;
        EDGES[i].vertexID_B = -1;
    }
}

void setupTriangles()
{
    int n = sizeof(TRIANGLES) / sizeof(Triangle);
    for (int i = 0; i < n; i++)
    {
        TRIANGLES[i].vertexID_A = -1;
        TRIANGLES[i].vertexID_B = -1;
        TRIANGLES[i].vertexID_C = -1;
    }
}

//
// Update functions
//
// updateVertices moves all vertices according to their speed and angle. It also reflects off walls.
void updateVertices()
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        Vertex *vertex = &VERTICES[i];

        // Move the vertex
        vertex->x += vertex->speed * cos(degToRadians(vertex->angle));
        vertex->y += vertex->speed * sin(degToRadians(vertex->angle));

        // Constrain the vertex within the bounds of the canvas
        if (vertex->x < 0 + vertex->radius)
        {
            vertex->x = 0 + vertex->radius;
        }
        if (vertex->x > WIDTH - vertex->radius)
        {
            vertex->x = WIDTH - vertex->radius;
        }
        if (vertex->y < 0 + vertex->radius)
        {
            vertex->y = 0 + vertex->radius;
        }
        if (vertex->y > HEIGHT - vertex->radius)
        {
            vertex->y = HEIGHT - vertex->radius;
        }

        // Keep the vertex's angle reasonable
        if (vertex->angle >= 360)
        {
            vertex->angle -= 360;
        }
        else if (vertex->angle <= -360)
        {
            vertex->angle += 360;
        }

        // Update angle if hit wall. Account for radius.
        if (vertex->x <= 0 + vertex->radius ||
            WIDTH - vertex->radius <= vertex->x)
        {
            vertex->angle = 180 - vertex->angle;
        }
        else if (vertex->y <= 0 + vertex->radius ||
                 HEIGHT - vertex->radius <= vertex->y)
        {
            vertex->angle = 0 - vertex->angle;
        }
    }
}

// updateEdges finds the nearest NUM_NEIGHBORS-neighbors to each point and stores them as edges in
// the EDGES array. Every EDGE in EDGES is replaced.
void updateEdges()
{
    // For each vertex
    int numVertices = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < numVertices; i++)
    {
        // The following block simply creates an array that contains all pairs of indices where
        // the lower index comes first and uses the Edge struct.

        // Create a edge to all vertices other than itself. Use `k` to track the current index.
        int numEdgesForVertex = numVertices - 1;
        Edge edgesForVertex[numEdgesForVertex];
        int k = 0;
        for (int j = 0; j < numVertices; j++)
        {
            if (i == j)
                continue;
            Edge *edge = &edgesForVertex[k];

            // Create the edge so that vertexA has the lower id
            if (i < j)
            {
                edge->vertexID_A = i;
                edge->vertexID_B = j;
            }
            else
            {
                edge->vertexID_A = j;
                edge->vertexID_B = i;
            }

            // Update `edgesForVertex` index counter `k`
            k += 1;
        }

        // Now, we have an array `edgesForVertex` that contains every edge for the current vertex.
        // We want to only keep those edges that have the smallest Cartesian distance. To do this,
        // we must sort the array.

        // Selection sort. Run's in O(n^2) time so it can definitely be replaced with a faster
        // sorting algorithm.
        for (int n = 0; n < numEdgesForVertex; n++)
        {
            Edge *edge1 = &edgesForVertex[n];
            Vertex *edge1_vertexA = &VERTICES[edge1->vertexID_A];
            Vertex *edge1_vertexB = &VERTICES[edge1->vertexID_B];
            float dist1 = distance(edge1_vertexA->x, edge1_vertexA->y, edge1_vertexB->x, edge1_vertexB->y);

            for (int m = n + 1; m < numEdgesForVertex; m++)
            {
                Edge *edge2 = &edgesForVertex[m];
                Vertex *edge2_vertexA = &VERTICES[edge2->vertexID_A];
                Vertex *edge2_vertexB = &VERTICES[edge2->vertexID_B];
                float dist2 = distance(edge2_vertexA->x, edge2_vertexA->y, edge2_vertexB->x, edge2_vertexB->y);

                // If dist1 is greater, move edge2 to edge1's spot toward the front
                if (dist1 > dist2)
                {
                    Edge edge = edgesForVertex[n];
                    edgesForVertex[n] = edgesForVertex[m];
                    edgesForVertex[m] = edge;
                }
            }
        }

        // Insert the NUM_NEIGHBORS-nearest-neighbors into the EDGES array
        for (int edgesForVertexIndex = 0; edgesForVertexIndex < NUM_NEIGHBORS; edgesForVertexIndex++)
        {
            int edgeIndex = i * NUM_NEIGHBORS + edgesForVertexIndex;
            EDGES[edgeIndex] = edgesForVertex[edgesForVertexIndex];
        }
    }

    // Remove duplicate edges. Duplicates exist because edges are undirected.
    // The main reason to remove duplicates is to avoid drawing the same edge
    // twice. Drawing is the main slow down of the app. Rather than messing with
    // the size of the EDGES array, assign the appropriate element to the null
    // pointer `NULL` then skip it when drawing.
    // To find the duplicates use a count matrix. If the cell already has a
    // value >0, then we know the element we have come across in a duplicate.
    // TODO: I think this should work even if the edge is unsorted IF I sort
    // the IDs in this function when checking the matrix. So I can remove that
    // code logic from above after I make the change below.
    // Initialize count matrix and set all values to 0.
    // TODO: There must be a better way of initializing to 0. But `= {{0}}` did
    // not work. Console gave a "memset" error.
    int matrix[numVertices][numVertices];
    for (int i = 0; i < numVertices; i++)
    {
        for (int j = 0; j < numVertices; j++)
        {
            matrix[i][j] = 0;
        }
    }

    int numEdges = sizeof(EDGES) / sizeof(Edge);
    for (int i = 0; i < numEdges; i++)
    {
        Edge *edge = &EDGES[i];

        // If we already have incremented the count matrix at this location,
        // then mark edge inidices with -1 to signal "do not draw".
        if (matrix[edge->vertexID_A][edge->vertexID_B] > 0)
        {
            edge->vertexID_A = -1;
            edge->vertexID_B = -1;
        }

        // Increase the counter
        matrix[edge->vertexID_A][edge->vertexID_B] += 1;
    }
}

void updateTriangles()
{
    int triangleIndex = 0;
    int numEdges = sizeof(EDGES) / sizeof(Edge);
    int numVertices = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < numEdges; i++)
    {
        Edge *edge = &EDGES[i];

        for (int j = 0; j < numVertices; j++)
        {
            // If the vertex is part of the edge, skip this vertex
            if (edge->vertexID_A == j || edge->vertexID_B == j)
                continue;

            // Check to see if the edges (vertexID_A, vertexID) and
            // (vertexID_B, vertexID) exist.
            bool testA = edgeExists(j, edge->vertexID_A);
            bool testB = edgeExists(j, edge->vertexID_B);
            if (testA && testB)
            {
                Triangle *triangle = &TRIANGLES[triangleIndex];
                triangle->vertexID_A = edge->vertexID_A;
                triangle->vertexID_B = edge->vertexID_B;
                triangle->vertexID_C = j;

                triangleIndex += 1;
            }
        }
    }

    // Remove duplicate triangles using a count matrix
    int matrix[numVertices][numVertices][numVertices];
    for (int i = 0; i < numVertices; i++)
    {
        for (int j = 0; j < numVertices; j++)
        {
            for (int k = 0; k < numVertices; k++)
            {
                matrix[i][j][k] = 0;
            }
        }
    }

    for (int i = 0; i < triangleIndex; i++)
    {
        Triangle *triangle = &TRIANGLES[i];

        int min = MIN(MIN(triangle->vertexID_A, triangle->vertexID_B), triangle->vertexID_C);
        int max = MAX(MAX(triangle->vertexID_A, triangle->vertexID_B), triangle->vertexID_C);
        int mid;
        // If C is leftover
        if ((min == triangle->vertexID_A || min == triangle->vertexID_B) &&
            (max == triangle->vertexID_A || max == triangle->vertexID_B))
        {
            mid = triangle->vertexID_C;
        }
        // Else, if B is leftover
        else if ((min == triangle->vertexID_A || min == triangle->vertexID_C) &&
                 (max == triangle->vertexID_A || max == triangle->vertexID_C))
        {
            mid = triangle->vertexID_B;
        }
        // Else, if A is leftover
        else
        {
            mid = triangle->vertexID_A;
        }

        if (matrix[min][mid][max] > 0)
        {
            triangle->vertexID_A = -1;
            triangle->vertexID_B = -1;
            triangle->vertexID_C = -1;
        }
        matrix[min][mid][max] += 1;
    }
}

//
// Draw functions
//
void drawVertices()
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        Vertex *vertex = &VERTICES[i];
        jsDrawVertex(i, vertex->x, vertex->y);
    }
}

void drawEdges()
{
    int n = sizeof(EDGES) / sizeof(Edge);
    for (int i = 0; i < n; i++)
    {
        Edge *edge = &EDGES[i];
        if (edge->vertexID_A == -1 || edge->vertexID_B == -1)
            continue;

        Vertex *vertexA = &VERTICES[edge->vertexID_A];
        Vertex *vertexB = &VERTICES[edge->vertexID_B];
        jsDrawEdge(vertexA->x, vertexA->y, vertexB->x, vertexB->y);
    }
}

void drawTriangles()
{
    int n = sizeof(TRIANGLES) / sizeof(Triangle);
    for (int i = 0; i < n; i++)
    {
        Triangle *triangle = &TRIANGLES[i];
        if (triangle->vertexID_A == -1 || triangle->vertexID_B == -1 || triangle->vertexID_C == -1)
            continue;

        Vertex *vertexA = &VERTICES[triangle->vertexID_A];
        Vertex *vertexB = &VERTICES[triangle->vertexID_B];
        Vertex *vertexC = &VERTICES[triangle->vertexID_C];
        jsDrawTriangle(vertexA->x, vertexA->y, vertexB->x, vertexB->y, vertexC->x, vertexC->y);
    }
}

//
// Loop functions
//
// tick executes the drawing and updating functions
void tick()
{
    // Clear canvas
    jsClearCanvas();

    // Call update functions
    updateVertices();
    updateEdges();
    updateTriangles();

    // Call draw functions
    if (DRAW_VERTICES)
        drawVertices();
    if (DRAW_EDGES)
        drawEdges();
    if (DRAW_TRIANGLES)
        drawTriangles();
}

// runCallback executes `tick` and is the entry point into the main loop
export int runCallback(void (*callback)())
{
    callback();
}

// start sets up vertices and begins the main loop
export void start(int width, int height, float minRadius, float maxRadius, float minSpeed, float maxSpeed, int numNeighbors, bool drawVertices, bool drawEdges, bool drawTriangles)
{
    // Call setup functions
    setupConfigs(width, height, numNeighbors, drawVertices, drawEdges, drawTriangles);
    setupVertices(minRadius, maxRadius, minSpeed, maxSpeed);
    setupEdges();
    setupTriangles();

    // Start loop
    jsSetInterval(tick);
}
