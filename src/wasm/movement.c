#include <stdio.h>
#include <stdbool.h>

double get_canvas_size(double canvasDimension, double imageDimension)
{
    return canvasDimension - imageDimension;
}

double update_axis(double axis, double velocity, double dimension)
{

    axis += velocity;

    if (axis > dimension)
    {
        axis = dimension;
    }
    else if (axis < 0)
    {
        axis = 0;
    }

    return axis;
}

int get_selection(int selection, double axis, double velocity)
{
    int newSelection = selection;
    if (0 > velocity)
        newSelection++;
    if (selection > 2)
        newSelection = 0;
    return newSelection;
}

double change_direction(double axis, double velocity, double boundary)
{
    if ((axis >= boundary && velocity > 0) || (axis <= 0 && velocity < 0))
        return velocity * -1;
    return velocity;
}