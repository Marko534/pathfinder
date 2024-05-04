let ROWS;
let COLUMNS;

// Testing
let count = 0;

function getMatrixSize(matrix) {
  return {
    ROWS: matrix.length,
    COLUMNS: matrix[0].length,
  };
}

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
  //This is for testing
  count++;
  console.log("Count loops ", count);
  console.log("Prev Matrix");
  printMatrix(prev);
  console.log("Curr Matrix");
  printMatrix(curr);

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
function calcNextMoves(curr_posn, values, policies, power_cost, discount) {
  // Determine if neighboring positions are in range of the map
  let s_range = true;
  let w_range = true;
  let n_range = true;
  let e_range = true;

  if (curr_posn[0] + 1 > ROWS - 1) {
    s_range = false;
  }
  if (curr_posn[1] - 1 < 0) {
    w_range = false;
  }
  if (curr_posn[0] - 1 < 0) {
    n_range = false;
  }
  if (curr_posn[1] + 1 > COLUMNS - 1) {
    e_range = false;
  }
  let s_posn;
  let w_posn;
  let n_posn;
  let e_posn;

  if (s_range) {
    s_posn = [curr_posn[0] + 1, curr_posn[1]];
  } else {
    s_posn = curr_posn;
  }

  if (w_range) {
    w_posn = [curr_posn[0], curr_posn[1] - 1];
  } else {
    w_posn = curr_posn;
  }

  if (n_range) {
    n_posn = [curr_posn[0] - 1, curr_posn[1]];
  } else {
    n_posn = curr_posn;
  }

  if (e_range) {
    e_posn = [curr_posn[0], curr_posn[1] + 1];
  } else {
    e_posn = curr_posn;
  }

  // Calculate the utility at all neighboring positons while using no speed boost
  // direction_probability * (-1 * power_cost + (discount * values[next[y]][next[x]]))
  let s =
    0.7 * (-1 * power_cost + discount * values[s_posn[0]][s_posn[1]]) +
    0.15 * (-1 * power_cost + discount * values[w_posn[0]][w_posn[1]]) +
    0.15 * (-1 * power_cost + discount * values[e_posn[0]][e_posn[1]]);

  let w =
    0.7 * (-1 * power_cost + discount * values[w_posn[0]][w_posn[1]]) +
    0.15 * (-1 * power_cost + discount * values[n_posn[0]][n_posn[1]]) +
    0.15 * (-1 * power_cost + discount * values[s_posn[0]][s_posn[1]]);

  let n =
    0.7 * (-1 * power_cost + discount * values[n_posn[0]][n_posn[1]]) +
    0.15 * (-1 * power_cost + discount * values[w_posn[0]][w_posn[1]]) +
    0.15 * (-1 * power_cost + discount * values[e_posn[0]][e_posn[1]]);

  let e =
    0.7 * (-1 * power_cost + discount * values[e_posn[0]][e_posn[1]]) +
    0.15 * (-1 * power_cost + discount * values[n_posn[0]][n_posn[1]]) +
    0.15 * (-1 * power_cost + discount * values[s_posn[0]][s_posn[1]]);

  // Calculate the utility at all neighboring positions while using speed boost
  // direction_probability * (-2 * power_cost + (discount * values[next[y]][next[x]]))
  let ss =
    0.8 * (-2 * power_cost + discount * values[s_posn[0]][s_posn[1]]) +
    0.1 * (-2 * power_cost + discount * values[w_posn[0]][w_posn[1]]) +
    0.1 * (-2 * power_cost + discount * values[e_posn[0]][e_posn[1]]);

  let ww =
    0.8 * (-2 * power_cost + discount * values[w_posn[0]][w_posn[1]]) +
    0.1 * (-2 * power_cost + discount * values[n_posn[0]][n_posn[1]]) +
    0.1 * (-2 * power_cost + discount * values[s_posn[0]][s_posn[1]]);

  let nn =
    0.8 * (-2 * power_cost + discount * values[n_posn[0]][n_posn[1]]) +
    0.1 * (-2 * power_cost + discount * values[w_posn[0]][w_posn[1]]) +
    0.1 * (-2 * power_cost + discount * values[e_posn[0]][e_posn[1]]);

  let ee =
    0.8 * (-2 * power_cost + discount * values[e_posn[0]][e_posn[1]]) +
    0.1 * (-2 * power_cost + discount * values[n_posn[0]][n_posn[1]]) +
    0.1 * (-2 * power_cost + discount * values[s_posn[0]][s_posn[1]]);

  // Add all possible 8 moves to an list and find the move with the maximum utility
  // let moves = [s, w, n, e, ss, ww, nn, ee];
  let moves = [s, w, n, e];
  let max_val = Math.max(...moves);
  let max_move = moves.indexOf(max_val);

  // Set values at the current position to the maximum move value and policies at the current position to the maximum move direction
  values[curr_posn[0]][curr_posn[1]] = max_val;
  policies[curr_posn[0]][curr_posn[1]] = max_move + 1;
}

// map : nxn matrix containing the positions of the start, goal, and hazard positions (denoted with 1,2,3 respectively)
// policies : empty nxn matrix that is updated with the best possible move after the function call
// values : empty nxn matrix that is updated with the utility value at each position on the board after the function call
// delivery_price : the utility earned for completing the robot delivery
// power_cost : the cost of power by the robot at each step
// drone_repair_cost : the negative utility that is earned when the robot ends up in a hazardous position
// discount : the discount at each step in the operation (gamma value)
// size : the n value for the nxn matrices provided by map, policies, and values
// --> returns the utility value at the start position
function dronePathPlanner(
  map,
  policies,
  values,
  delivery_price,
  power_cost,
  drone_repair_cost,
  discount
) {
  // Find Start, Goal, & Hazard Positions
  let prev = copyValues(values);
  let start;
  let goal;
  let rivals = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      if (map[i][j] === 1) {
        start = [i, j];
      }
      if (map[i][j] === 2) {
        goal = [i, j];
      }
      if (map[i][j] === 3) {
        rivals.push([i, j]);
      }
    }
  }
  values[goal[0]][goal[1]] = delivery_price;
  for (let r of rivals) {
    values[r[0]][r[1]] = drone_repair_cost * -1;
  }

  // Loop Until Board Converges
  while (true) {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        let curr_posn = [i, j];
        // Posible error here
        if (
          (curr_posn[0] !== goal[0] || curr_posn[1] !== goal[1]) &&
          !rivals.some(
            (pos) => curr_posn[0] === pos[0] && curr_posn[1] === pos[1]
          )
        ) {
          calcNextMoves(
            curr_posn,
            values, // Calculate the next moves for positions...
            policies,
            power_cost,
            discount
          ); // ...that are not goal or hazard positions
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
  // Sample map 1 start 2 end 3 hazard
  let sample_map = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0],
    [1, 0, 3, 0, 2, 0],
    [0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  // Parameters
  ({ ROWS, COLUMNS } = getMatrixSize(sample_map));
  let delivery_price = 100; // Utility earned for completing the robot delivery
  let power_cost = 10; // Cost of power by the robot at each step
  let drone_repair_cost = 500;
  let discount = 0.9; // Discount at each step in the operation (gamma value)

  // Initialize policies and values matrices with zeros
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
  let utilityAtStart = dronePathPlanner(
    sample_map,
    policies,
    values,
    delivery_price,
    power_cost,
    drone_repair_cost,
    discount
  );

  // Assert the utility value at the start position
  // assert utilityAtStart == 0  // Adjust this value based on your expectations

  console.log("\nPrintg the utility values at each position on the board");

  printMatrix(values);

  printMatrix(policies);

  // Add more test cases as needed

  // Run the test case
}

testDronePathPlanner();
