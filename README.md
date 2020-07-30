# Game-OF-Life
Building game called The Game of life using plain js

world that made of 2 dimensional which programmatically means 2 arrays that made of columns and rows --> Grid

*** you can read about the 2D array in js here https://medium.com/javascript-in-plain-english/javascript-multi-dimensional-arrays-7186e8edd03 ***

The idea that you have infinite generations of lives and each one of them depends on the one before.

either(dead = 0 or alive = 1) we are gonna run some grid on the generation of zero and then this will determine the next generation , each rows has a lot of cells and each cell can be on or off (1 or 0) dead or alive so the next generation we are gonna take a look at its position in the pervious generation to look up at it neighbors, because each cell depends on them

in this game, each cell surrounds by 8 neighbors

    live cell < live neighbors ---> dies ---> under population
    live cell > 2 < 3 live neighbors live in the next generation
    live cell > 3 live neighbors dies ---> overpopulation
    live cell === 3 live neighbors , live in the next generation -->reproduction

example

                       live <--- [dead cell == 0] -> live
                                        |
                                        live

                    this cell will live in the next generation
                    due ro reproduction

                        live <---- [live cell = 1]  -> dies under population

                                    or
                                   ___

                                   live
                                    |
                        live <---- [live cell = 1] ---> live     -> dies
                                    |                              overpopulation
                                  live

                                    each cell made of
                                          |
                                          |
                                          |

                      top left cell    top cell     top right cell
                                  \       |         /
                                    \     |       /
                        left cell <--    cell     --> neighbor cell
                                    /     |       \
                                  /       |         \
                  bottom left cell    bottom cell     bottom right cell

                  total = 8
