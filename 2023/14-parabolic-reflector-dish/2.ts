import { readLinesSplit, say } from '../../utils';

let grid: string[][] = [];
readLinesSplit('input.txt', '').forEach((lineArray: string[]) => {
  grid.push(lineArray);
});

let previousLoad = 0;
let i: number;
for (i = 1; i <= 300; i++) {
  rotateOneCycle();
  const load = getTotalLoad();
  previousLoad = load;
  if (i % 18 === 10) {
    // "18" because the same number repeats every 18 rotations starting somewhere before 200 rotations
    // "10" because 1_000_000_000 % 18 === 10
    say(i, getTotalLoad());
  }
}

function rotateOneCycle(): void {
  // North
  tiltNorth();
  // West
  grid = rotateGridClockwise(grid);
  tiltNorth();
  // South
  grid = rotateGridClockwise(grid);
  tiltNorth();
  // East
  grid = rotateGridClockwise(grid);
  tiltNorth();
  grid = rotateGridClockwise(grid);
}

function tiltNorth(): void {
  for (let y = 1; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 'O') {
        let y1 = 0;
        let foundEmpty = false;
        for (y1 = y-1; y1 >= 0; y1--) {
          if (grid[y1][x] !== '.') {
            break;
          } else {
            foundEmpty = true;
          }
        }
        if (foundEmpty) {
          grid[y1+1][x] = 'O';
          grid[y][x] = '.'
        }
      }
    }
  }
}

function getTotalLoad(): number {
  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    sum += grid[y].filter((item) => item === 'O').length * (grid.length - y);
  }
  return sum;
}

function rotateGridClockwise(grid: string[][]): string[][] {
  const numRows = grid.length;
  const numCols = grid[0].length;

  // Create a new grid filled with empty strings
  const rotatedGrid: string[][] = Array.from({ length: numCols }, () => Array(numRows).fill(''));

  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const newRow = x;
      const newCol = numRows - 1 - y;

      rotatedGrid[newRow][newCol] = grid[y][x]; // Assign the value to the rotated grid
    }
  }

  return rotatedGrid;
}
