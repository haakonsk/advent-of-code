import { readLinesSplit, say } from '../../utils';

let sum = 0;
let grid: string[][] = [];

readLinesSplit('input.txt', '').forEach((lineArray: string[]) => {
  grid.push(lineArray);
  if (!lineArray.includes('#')) {
    grid.push([...lineArray]);
  }
});

for (let x = 0; x < grid[0].length; x++) {
  let columnIsEmpty = true;
  let colNum = -1;
  for (let y = 0; y < grid.length; y++) {
    if (grid[y][x] === '#') {
      columnIsEmpty = false;
      colNum = x;
    }
  }
  if (columnIsEmpty) {
    insertColumn(grid, x+1);
    x++;
  }
}

const galaxyPositions: [number, number][] = [];

for (let x = 0; x < grid[0].length; x++) {
  for (let y = 0; y < grid.length; y++) {
    if (grid[y][x] === '#') {
      galaxyPositions.push([y, x]);
    }
  }
}

galaxyPositions.forEach((galaxy1Position) => {
  galaxyPositions.forEach((galaxy2Position) => {
    sum += Math.abs(galaxy2Position[0] - galaxy1Position[0]) + Math.abs(galaxy2Position[1] - galaxy1Position[1]);
  })
});

say(sum / 2);

function insertColumn(grid: string[][], columnIndexToInsert): void {
  for (let i = 0; i < grid.length; i++) {
    grid[i].splice(columnIndexToInsert, 0, '.');
  }
}
