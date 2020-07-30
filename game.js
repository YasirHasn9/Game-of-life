/*
world that made of 2 dimensional which programmatically means 2 arrays
that made of columns and rows --> Grid
The idea that you have generations
so we are gonna run some grid on the generation of zero and then this will
determine the next generation , each rows has a lot of cells and each
cell can be on or off (1 or 0) dead or alive
so the next generation we are gonna take a look at its position in the pervious
generation to look up at it neighbors, because each cell depends on them

in this game, each cell surrounds by 8 neighbors

*/


// rows and columns
let rows = 40;
let cols = 40;

// when it true do the game
let starter = false;

let grid = new Array(rows);
let nextGrid = new Array(rows);

let timer;
let reproductionTime = 100;

function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

function copyAndResetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

// Lay out the board
function createTable() {
  let world = document.getElementById("world");
  let tbl = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", i + "_" + j);
      cell.setAttribute("class", "dead");
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }
    tbl.appendChild(tr);
  }
  world.appendChild(tbl);
}

function cellClickHandler() {
  let rowCol = this.id.split("_");
  let row = Number(rowCol[0]);
  let col = Number(rowCol[1]);

  let classes = this.getAttribute("class");
  if (classes.indexOf("live") > -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }
}

function updateView() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(i + "_" + j);
      if (grid[i][j] == 0) {
        cell.setAttribute("class", "dead");
      } else {
        cell.setAttribute("class", "live");
      }
    }
  }
}

function setupControlButtons() {
  // button to start
  let startButton = document.getElementById("start");
  startButton.onclick = startButtonHandler;

  // button to clear
  let clearButton = document.getElementById("clear");
  clearButton.onclick = clearButtonHandler;

  // button to set random initial state
  let randomButton = document.getElementById("random");
  randomButton.onclick = randomButtonHandler;
}
// Initialize
function initialize() {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

function randomButtonHandler() {
  if (starter) return;
  clearButtonHandler();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let isLive = Math.round(Math.random());
      if (isLive == 1) {
        let cell = document.getElementById(i + "_" + j);
        cell.setAttribute("class", "live");
        grid[i][j] = 1;
      }
    }
  }
}

// clear the grid
function clearButtonHandler() {
  starter = false;
  let startButton = document.getElementById("start");
  startButton.innerHTML = "Start";
  clearTimeout(timer);

  let cellsList = document.getElementsByClassName("live");
  // convert to array first, otherwise, you're working on a live node list
  // and the update doesn't work!
  let cells = [];
  for (let i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]);
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
  }
  resetGrids;
}

// start/pause/continue the game
function startButtonHandler() {
  if (starter) {
    console.log("Pause the game");
    starter = false;
    this.innerHTML = "Continue";
    clearTimeout(timer);
  } else {
    console.log("Continue the game");
    starter = true;
    this.innerHTML = "Pause";
    play();
  }
}

// run the life game
function play() {
  computeNextGen();

  if (starter) {
    timer = setTimeout(play, reproductionTime);
  }
}

function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }

  // copy NextGrid to grid, and reset nextGrid
  copyAndResetGrid();
  // copy all 1 values to "live" in the table
  updateView();
}


//  1. live cell < live neighbors ---> dies ---> under population
//  2. live cell > 2 < 3 live neighbors live in the next generation
//  3. live cell > 3 live neighbors dies ---> overpopulation
//  4. live cell === 3 live neighbors , live in the next generation -->reproduction

/*
RULES
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
 */
function applyRules(row, col) {
  let numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
  }
}


//                          top left cell    top cell     top right cell
//                                       \       |         /
//                                         \     |       /
//                             left cell <--    cell     --> neighbor cell
//                                         /     |       \
//                                       /       |         \
//                       bottom left cell    bottom cell     bottom right cell
// 

function countNeighbors(row, col) {
  let count = 0;
  let neighborRow = Number(row);
  let neighborCol = Number(col);

  // Make sure we are not at the first row
  if (neighborRow - 1 >= 0) {
    // Check top neighbor
    if (grid[neighborRow - 1][neighborCol] == 1) count++;
  }
  // Make sure we are not in the first cell
  // Upper left corner
  if (neighborRow - 1 >= 0 && neighborCol - 1 >= 0) {
    //Check upper left neighbor
    if (grid[neighborRow - 1][neighborCol - 1] == 1) count++;
  } // Make sure we are not on the first row last column
  // Upper right corner
  if (neighborRow - 1 >= 0 && neighborCol + 1 < cols) {
    //Check upper right neighbor
    if (grid[neighborRow - 1][neighborCol + 1] == 1) count++;
  } // Make sure we are not on the first column
  if (neighborCol - 1 >= 0) {
    //Check left neighbor
    if (grid[neighborRow][neighborCol - 1] == 1) count++;
  }
  // Make sure we are not on the last column
  if (neighborCol + 1 < cols) {
    //Check right neighbor
    if (grid[neighborRow][neighborCol + 1] == 1) count++;
  } // Make sure we are not on the bottom left corner
  if (neighborRow + 1 < rows && neighborCol - 1 >= 0) {
    //Check bottom left neighbor
    if (grid[neighborRow + 1][neighborCol - 1] == 1) count++;
  } // Make sure we are not on the bottom right
  if (neighborRow + 1 < rows && neighborCol + 1 < cols) {
    //Check bottom right neighbor
    if (grid[neighborRow + 1][neighborCol + 1] == 1) count++;
  }

  // Make sure we are not on the last row
  if (neighborRow + 1 < rows) {
    //Check bottom neighbor
    if (grid[neighborRow + 1][neighborCol] == 1) count++;
  }

  return count;
}


// Start everything
window.onload = initialize();