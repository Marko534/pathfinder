// Enum to store cell values
const CELL_VALUES = {
  OBSTACLE: "obstacle",
  EMPTY: "empty",
  START: "start",
  END: "end",
};

let selectedMode = "";
let isMouseDown = false;

// Initialize dark grid matrix
let grid = [];

function findElementIndexes(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    // Loop through rows
    for (let j = 0; j < arr[i].length; j++) {
      // Loop through columns in each row
      if (arr[i][j] === target) {
        return { i, j }; // Return indexes as an object if target is found
      }
    }
  }
  return null; // Return null if target is not found
}

// Function to generate the Minesweeper-style grid
function generateGrid() {
  const rows = parseInt(document.getElementById("rows").value);
  const cols = parseInt(document.getElementById("cols").value);
  const gridContainer = document.getElementById("grid-container");

  // Preserve existing dark grid data
  const prevGrid = grid;

  // Clear grid container
  gridContainer.innerHTML = "";

  // Update dark grid matrix size
  grid = new Array(rows).fill(0).map(() => new Array(cols).fill(false));

  // Nested loop to create rows and cells
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i; // Set row index as data attribute
      cell.dataset.col = j; // Set column index as data attribute
      cell.addEventListener("mousedown", (event) => {
        console.log("mousedown");
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

  const row1 = 10;
  const col1 = 10;

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
// Function to update grid when input values change
function updateGrid() {
  generateGrid();
}

// Add event listeners to input elements
document.getElementById("rows").addEventListener("input", updateGrid);
document.getElementById("cols").addEventListener("input", updateGrid);

// Initial grid generation
window.onload = function () {
  generateGrid();
};

function toggleGrid() {
  const gridContainer = document.getElementById("grid-container");
  gridContainer.classList.toggle("no-border");
}
