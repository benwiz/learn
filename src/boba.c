#include <webassembly.h>

// TODO: Figure out how to not do it like this
#define NUM_VERTICES 6
#define NUM_NEIGHBORS 2
#define NUM_EDGES 12    // NUM_VERTICES * NUM_NEIGHBORS
#define NUM_TRIANGLES 4 // N! / 3(N-3)! = max num possible triangles

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
int WIDTH;
int HEIGHT;
Vertex VERTICES[NUM_VERTICES];
Edge EDGES[NUM_EDGES];
Triangle TRIANGLES[NUM_TRIANGLES];

//
// Util and Math functions
//
float distance(float x1, float y1, float x2, float y2)
{
    float a = Math_pow((x1 - x2), 2);
    float b = Math_pow((y1 - y2), 2);
    float c = Math_sqrt(a + b);
    return c;
}

bool edgeExists(int vertexID_A, int vertexID_B)
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        Edge *edge = &EDGES[i];
        if (edge->vertexID_A == vertexID_A && edge->vertexID_B == vertexID_B ||
            edge->vertexID_A == vertexID_B && edge->vertexID_B == vertexID_A)
        {
            return true;
        }
    }

    return false;
}

//
// Setup functions
//
void setupVertices()
{
    int n = sizeof(VERTICES) / sizeof(Vertex);
    for (int i = 0; i < n; i++)
    {
        float f = Math_random(); // (double)rand() / RAND_MAX;
        float x = f * WIDTH;

        f = Math_random(); // (double)rand() / RAND_MAX;
        float y = f * HEIGHT;

        VERTICES[i].x = x;
        VERTICES[i].y = y;
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
        Vertex *vertex = &VERTICES[i]; // ???: I am doing this thinking I am helping readability. Am I slowing anything down? Is this more readable?
        vertex->x += 0;
        vertex->y += 0;
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
    int matrix[NUM_VERTICES][NUM_VERTICES];
    for (int i = 0; i < NUM_VERTICES; i++)
    {
        for (int j = 0; j < NUM_VERTICES; j++)
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
    drawVertices();
    drawEdges();
    drawTriangles();
}

// runCallback executes `tick` and is the entry point into the main loop
export int runCallback(void (*callback)())
{
    callback();
}

// start sets up vertices and begins the main loop
export void start(int width, int height)
{
    // Store width and height of canvas globally
    WIDTH = width;
    HEIGHT = height;

    // Seed rand
    srand(1); // time(NULL)

    // Call setup functions
    setupVertices();
    setupEdges();
    setupTriangles();

    // Start loop
    jsSetInterval(tick);
}
