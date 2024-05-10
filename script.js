// Enum to store cell values
const CELL_VALUES = {
  OBSTACLE: "obstacle",
  EMPTY: "empty",
  START: "start",
  END: "end",
  PATH: "path",
};

let selectedMode = "";
let isMouseDown = false;

let grid = [];

let ROWS;
let COLUMNS;
let deliveryPrice;
let powerCost;
let repairCost;
let discount;

let start;
let goal;
let rivals = [];

// Function to get values from input fields
function updateValues() {
  ROWS = parseInt(document.getElementById("rows").value);
  COLUMNS = parseInt(document.getElementById("cols").value);
  deliveryPrice = parseFloat(document.getElementById("deliveryPrice").value);
  powerCost = parseFloat(document.getElementById("powerCost").value);
  repairCost = parseFloat(document.getElementById("repairCost").value);
  discount = parseFloat(document.getElementById("discount").value);
  generateGrid();
}

function findElementIndexes(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    // Loop through ROWS
    for (let j = 0; j < arr[i].length; j++) {
      // Loop through columns in each row
      if (arr[i][j] === target) {
        return { i, j }; // Return indexes as an object if target is found
      }
    }
  }
  return null; // Return null if target is not found
}

//UI Functions

// Function to generate the Minesweeper-style grid
function generateGrid() {
  const gridContainer = document.getElementById("grid-container");

  // Preserve existing dark grid data
  const prevGrid = grid;

  // Clear grid container
  gridContainer.innerHTML = "";

  // Update dark grid matrix size
  grid = new Array(ROWS).fill(0).map(() => new Array(COLUMNS).fill(false));

  // Nested loop to create ROWS and cells
  for (let i = 0; i < ROWS; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < COLUMNS; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i; // Set row index as data attribute
      cell.dataset.col = j; // Set column index as data attribute
      cell.addEventListener("mousedown", (event) => {
        // console.log("mousedown");
        isMouseDown = true;
        paintCell(event);
      });
      cell.addEventListener("mouseover", (event) => {
        if (isMouseDown) {
          paintCell(event);
        }
      });

      // Preserve existing cell color if available
      if (prevGrid[i] && prevGrid[i][j]) {
        cell.classList.add(prevGrid[i][j]);
        grid[i][j] = prevGrid[i][j];
      }

      row.appendChild(cell);
    }

    // Add row to grid container
    gridContainer.appendChild(row);
  }

  document.addEventListener("mouseup", () => {
    isMouseDown = false; // Set isMouseDown to false when mouse is released
  });
}

function selectMode(mode) {
  selectedMode = mode;
  highlightSelectedMode();
}

function highlightSelectedMode() {
  const drawModeButtons = document.querySelectorAll(".button.draw-mode");
  drawModeButtons.forEach((drawModeButton) => {
    if (drawModeButton.value === selectedMode) {
      drawModeButton.classList.add("selected");
    } else {
      drawModeButton.classList.remove("selected");
    }
  });
}

// Function to toggle cell color and update dark grid matrix
function paintCell(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  // Toggle cell color based on mode
  if (selectedMode === CELL_VALUES.OBSTACLE) {
    cell.classList = "cell";
    cell.classList.add(CELL_VALUES.OBSTACLE);
    grid[row][col] = CELL_VALUES.OBSTACLE;
  } else if (selectedMode === CELL_VALUES.EMPTY) {
    cell.classList = "cell";
    grid[row][col] = CELL_VALUES.EMPTY;
  } else if (selectedMode === CELL_VALUES.START) {
    index = findElementIndexes(grid, CELL_VALUES.START);
    if (index) {
      const selector = `.cell[data-row="${index["i"]}"][data-col="${index["j"]}"]`;
      const specificCell = document.querySelector(selector);
      specificCell.classList = "cell";
      grid[index["i"]][index["j"]] = null;
    }
    cell.classList = "cell";
    cell.classList.add(CELL_VALUES.START);
    grid[row][col] = CELL_VALUES.START;
  } else if (selectedMode === CELL_VALUES.END) {
    index = findElementIndexes(grid, CELL_VALUES.END);
    if (index) {
      const selector = `.cell[data-row="${index["i"]}"][data-col="${index["j"]}"]`;
      const specificCell = document.querySelector(selector);
      specificCell.classList = "cell";
      grid[index["i"]][index["j"]] = null;
    }
    cell.classList = "cell";
    cell.classList.add(CELL_VALUES.END);
    grid[row][col] = CELL_VALUES.END;
  }
}

// Add event listeners to input elements
document.getElementById("rows").addEventListener("input", updateValues);
document.getElementById("cols").addEventListener("input", updateValues);
document
  .getElementById("deliveryPrice")
  .addEventListener("input", updateValues);
document.getElementById("powerCost").addEventListener("input", updateValues);
document.getElementById("repairCost").addEventListener("input", updateValues);
document.getElementById("discount").addEventListener("input", updateValues);

// Initial grid generation
window.onload = function () {
  updateValues();
  grid[1][1] = CELL_VALUES.START;
  grid[ROWS - 2][COLUMNS - 2] = CELL_VALUES.END;
  generateGrid();
  // startGoalHazardPositions();
  // console.log(start);
};

function toggleGrid() {
  const gridContainer = document.getElementById("grid-container");
  const toggleButton = document.getElementById("toggleGrid"); // Assuming the button has this ID

  // Log the button to confirm it is being selected correctly
  console.log(toggleButton);

  // Toggle the 'selected' class on the button
  toggleButton.classList.toggle("selected");

  // Toggle the 'no-border' class on the grid container
  gridContainer.classList.toggle("no-border");
}

function togglePath() {
  const generatedPath = document.getElementById("togglePath");

  generatedPath.classList.toggle("selected"); // Toggle the selected class for the button

  const pathCells = document.querySelectorAll(".cell.path"); // Select all cells with the .path class
  pathCells.forEach((cell) => {
    cell.classList.remove("path"); // Remove the .path class from each cell
  });

  if (generatedPath.classList.contains("selected")) {
    testDronePathPlanner();
  }
}

// LOGIC functions

function printMatrix(matrix) {
  let maxLength = 8;
  // Print the matrix with formatted numbers
  for (let row of matrix) {
    let rowString = "";
    for (let val of row) {
      const formattedVal = val.toFixed(4).padStart(maxLength + 1);
      rowString += formattedVal + " ";
    }
    console.log(rowString);
  }
  console.log("\n");
}

function copyValues(values) {
  let new_values = [];
  for (let i = 0; i < ROWS; i++) {
    new_values[i] = [];
    for (let j = 0; j < COLUMNS; j++) {
      new_values[i][j] = values[i][j];
    }
  }
  return new_values;
}

// Checks to see if the previous and current value boards converge by a factor of 0.1%
function converges(prev, curr, converge_factor = 0.01) {
  // //This is for testing
  // count++;
  // console.log("Count loops ", count);
  // console.log("Prev Matrix");
  // printMatrix(prev);
  // console.log("Curr Matrix");
  // printMatrix(curr);

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      if (Math.abs(prev[i][j] - curr[i][j]) > converge_factor) {
        return false;
      }
    }
  }
  return true;
}

// Calculates the next possible 8 moves and then sets values to the max of that move and policies to the direction of the max move
function calcNextMoves(currPosn, values, policies) {
  // Determine if neighboring positions are in range of the map
  let s_range = true;
  let w_range = true;
  let n_range = true;
  let e_range = true;

  if (currPosn[0] + 1 > ROWS - 1) {
    s_range = false;
  }
  if (currPosn[1] - 1 < 0) {
    w_range = false;
  }
  if (currPosn[0] - 1 < 0) {
    n_range = false;
  }
  if (currPosn[1] + 1 > COLUMNS - 1) {
    e_range = false;
  }
  let s_posn;
  let w_posn;
  let n_posn;
  let e_posn;

  if (s_range) {
    s_posn = [currPosn[0] + 1, currPosn[1]];
  } else {
    s_posn = currPosn;
  }

  if (w_range) {
    w_posn = [currPosn[0], currPosn[1] - 1];
  } else {
    w_posn = currPosn;
  }

  if (n_range) {
    n_posn = [currPosn[0] - 1, currPosn[1]];
  } else {
    n_posn = currPosn;
  }

  if (e_range) {
    e_posn = [currPosn[0], currPosn[1] + 1];
  } else {
    e_posn = currPosn;
  }

  // Calculate the utility at all neighboring positons while using no speed boost
  // direction_probability * (-1 * powerCost + (discount * values[next[y]][next[x]]))
  let s =
    0.7 * (-1 * powerCost + discount * values[s_posn[0]][s_posn[1]]) +
    0.15 * (-1 * powerCost + discount * values[w_posn[0]][w_posn[1]]) +
    0.15 * (-1 * powerCost + discount * values[e_posn[0]][e_posn[1]]);

  let w =
    0.7 * (-1 * powerCost + discount * values[w_posn[0]][w_posn[1]]) +
    0.15 * (-1 * powerCost + discount * values[n_posn[0]][n_posn[1]]) +
    0.15 * (-1 * powerCost + discount * values[s_posn[0]][s_posn[1]]);

  let n =
    0.7 * (-1 * powerCost + discount * values[n_posn[0]][n_posn[1]]) +
    0.15 * (-1 * powerCost + discount * values[w_posn[0]][w_posn[1]]) +
    0.15 * (-1 * powerCost + discount * values[e_posn[0]][e_posn[1]]);

  let e =
    0.7 * (-1 * powerCost + discount * values[e_posn[0]][e_posn[1]]) +
    0.15 * (-1 * powerCost + discount * values[n_posn[0]][n_posn[1]]) +
    0.15 * (-1 * powerCost + discount * values[s_posn[0]][s_posn[1]]);

  // Calculate the utility at all neighboring positions while using speed boost
  // direction_probability * (-2 * powerCost + (discount * values[next[y]][next[x]]))
  let ss =
    0.8 * (-2 * powerCost + discount * values[s_posn[0]][s_posn[1]]) +
    0.1 * (-2 * powerCost + discount * values[w_posn[0]][w_posn[1]]) +
    0.1 * (-2 * powerCost + discount * values[e_posn[0]][e_posn[1]]);

  let ww =
    0.8 * (-2 * powerCost + discount * values[w_posn[0]][w_posn[1]]) +
    0.1 * (-2 * powerCost + discount * values[n_posn[0]][n_posn[1]]) +
    0.1 * (-2 * powerCost + discount * values[s_posn[0]][s_posn[1]]);

  let nn =
    0.8 * (-2 * powerCost + discount * values[n_posn[0]][n_posn[1]]) +
    0.1 * (-2 * powerCost + discount * values[w_posn[0]][w_posn[1]]) +
    0.1 * (-2 * powerCost + discount * values[e_posn[0]][e_posn[1]]);

  let ee =
    0.8 * (-2 * powerCost + discount * values[e_posn[0]][e_posn[1]]) +
    0.1 * (-2 * powerCost + discount * values[n_posn[0]][n_posn[1]]) +
    0.1 * (-2 * powerCost + discount * values[s_posn[0]][s_posn[1]]);

  // Add all possible 8 moves to an list and find the move with the maximum utility
  // let moves = [s, w, n, e, ss, ww, nn, ee];
  let moves = [e, n, w, s];
  let max_val = Math.max(...moves);
  let max_move = moves.indexOf(max_val);

  // Set values at the current position to the maximum move value and policies at the current position to the maximum move direction
  values[currPosn[0]][currPosn[1]] = max_val;
  policies[currPosn[0]][currPosn[1]] = max_move + 1;
}

// map : nxn matrix containing the positions of the start, goal, and hazard positions (denoted with 1,2,3 respectively)
// policies : empty nxn matrix that is updated with the best possible move after the function call
// values : empty nxn matrix that is updated with the utility value at each position on the board after the function call
// deliveryPrice : the utility earned for completing the robot delivery
// powerCost : the cost of power by the robot at each step
// repairCost : the negative utility that is earned when the robot ends up in a hazardous position
// discount : the discount at each step in the operation (gamma value)
// size : the n value for the nxn matrices provided by map, policies, and values
// --> returns the utility value at the start position

function startGoalHazardPositions() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      if (grid[i][j] === CELL_VALUES.START) {
        start = [i, j];
      }
      if (grid[i][j] === CELL_VALUES.END) {
        goal = [i, j];
      }
      if (grid[i][j] === CELL_VALUES.OBSTACLE) {
        rivals.push([i, j]);
      }
    }
  }
}

function dronePathPlanner(policies, values) {
  let prev = copyValues(values);

  startGoalHazardPositions();

  values[goal[0]][goal[1]] = deliveryPrice;
  for (let r of rivals) {
    values[r[0]][r[1]] = repairCost * -1;
  }

  // Loop Until Board Converges
  while (true) {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        let currPosn = [i, j];
        // Posible error here
        if (
          (currPosn[0] !== goal[0] || currPosn[1] !== goal[1]) &&
          !rivals.some(
            (pos) => currPosn[0] === pos[0] && currPosn[1] === pos[1]
          )
        ) {
          calcNextMoves(currPosn, values, policies);
        }
      }
    }
    if (converges(prev, values)) {
      // Stop looping and return if board converges
      break;
    } else {
      // Else, continue looping and keep track of previous values nxn matrix
      prev = copyValues(values);
    }
  }
  return values[start[0]][start[1]]; // Returns utility values at the start position
}

function testDronePathPlanner() {
  let policies = [];
  let values = [];

  for (let i = 0; i < ROWS; i++) {
    policies[i] = [];
    values[i] = [];
    // Initialize each value in the row to 0
    for (let j = 0; j < COLUMNS; j++) {
      policies[i][j] = 0;
      values[i][j] = 0;
    }
  }

  // Run the dronePathPlanner function
  let utilityAtStart = dronePathPlanner(policies, values);

  // console.log(policies);

  // printMatrix(values);

  colorPath(policies);
}

function colorPath(policies) {
  const gridContainer = document.getElementById("grid-container"); // Assuming you have a grid container element

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      if (grid[i][j] === CELL_VALUES.PATH) {
        grid[i][j] = CELL_VALUES.EMPTY;
      }
    }
  }

  let currentRow = start[0];
  let currentCol = start[1];

  while (policies[currentRow][currentCol] !== 0) {
    // Move to the next cell based on the policy
    switch (policies[currentRow][currentCol]) {
      case 1:
        currentCol++; // Move right
        grid[currentRow][currentCol] = CELL_VALUES.PATH;
        break;
      case 2:
        currentRow--; // Move up
        grid[currentRow][currentCol] = CELL_VALUES.PATH;
        break;
      case 3:
        currentCol--; // Move left
        grid[currentRow][currentCol] = CELL_VALUES.PATH;
        break;
      case 4:
        currentRow++; // Move down
        grid[currentRow][currentCol] = CELL_VALUES.PATH;
        break;
      default:
        // Invalid policy
        return null;
    }
    const selector = `.cell[data-row="${currentRow}"][data-col="${currentCol}"]`;
    const cell = gridContainer.querySelector(selector);
    if (cell) {
      cell.classList.add("path"); // Add the "path" class to the current cell
    }
  }

  grid[currentRow][currentCol] = CELL_VALUES.END;

  // console.log(grid);
}
