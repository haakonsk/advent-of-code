import { printGrid, readLinesSplit, say } from '../../utils';

const grid: string[][] = [];
let currentPositions: [number, number][] = [];

readLinesSplit('input.txt', '').forEach((lineArray: string[], y) => {
  if (lineArray.includes('S')) {
    currentPositions.push([y, lineArray.join('').indexOf('S')]);
  }
  grid.push(lineArray);
});

for (let i = 0; i < 64; i++) {
  const newCurrentPositions: { [key: string]: boolean } = {};
  currentPositions.forEach(([y, x]) => {
    getNewPositions(y, x).forEach(([y_, x_]) => {
      newCurrentPositions[`${y_},${x_}`] = true;
    })
  });
  currentPositions = Object.keys(newCurrentPositions).map((posStr) => {
    const [yStr, xStr] = posStr.split(',');
    return [parseInt(yStr), parseInt(xStr)];
  });
  for (const [y, x] of currentPositions) {
    grid[y][x] = 'O';
  }
  printGrid(grid);
  for (const [y, x] of currentPositions) {
    grid[y][x] = '.';
  }
  say(currentPositions.length)
}

function getNewPositions(y: number, x: number): [number, number][] {
  const positions: { [key: string]: boolean } = {};
  if (canGoTo(y-1, x)) {
    positions[`${y-1},${x}`] = true;
  }
  if (canGoTo(y+1, x)) {
    positions[`${y+1},${x}`] = true;
  }
  if (canGoTo(y, x-1)) {
    positions[`${y},${x-1}`] = true;
  }
  if (canGoTo(y, x+1)) {
    positions[`${y},${x+1}`] = true;
  }
  return Object.keys(positions).map((posStr) => {
    const [yStr, xStr] = posStr.split(',');
    return [parseInt(yStr), parseInt(xStr)];
  })
}

function canGoTo(y: number, x: number): boolean {
  return y >= 0 && x >= 0 && y < grid.length && x < grid[0].length && grid[y][x] && ['.', 'S'].includes(grid[y][x]);
}
