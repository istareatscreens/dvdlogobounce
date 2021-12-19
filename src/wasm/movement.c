#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <time.h>

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

double get_resize_ratio(double imgWidth, double imgHeight, double canvasWidth, double canvasHeight)
{
    double resizeRatio = 2;
    if (imgHeight / canvasHeight > 0.25 || imgWidth / canvasWidth > 0.25)
    {
        resizeRatio = (imgHeight / canvasHeight > imgWidth / canvasWidth) ? 1 - imgHeight / canvasHeight : 1 - imgWidth / canvasWidth;
        if (resizeRatio < 0.25)
        {
            resizeRatio = 0.25;
        }
    }
    return resizeRatio;
}