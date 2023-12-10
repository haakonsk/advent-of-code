import { readLinesSplit, say } from '../../utils';

const grid: string[][] = [];
let [startX, startY] = [-1, -1];

readLinesSplit('input.txt', '').forEach((lineArray: string[], i) => {
  grid.push(lineArray);
  const index = lineArray.join('').indexOf('S');
  if (index !== -1) {
    startX = lineArray.join('').indexOf('S');
    startY = i;
  }
});

let [posY, posX] = goDown(startY, startX);
let numSteps = 1;

do {
  [posY, posX] = goOneTile(posY, posX);
  numSteps++;
} while (posY !== startY || posX !== startX);

let str = '';
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    const val = ['S', '^', 'v', '<', '>'].includes(grid[i][j]) ? grid[i][j] : ' ';
    str += val === null ? ' ' : val;
  }
  str += '\n';
}

say(str); // Solved part 2 manually based on this output (see notes.txt - the solution is the number of 'I's)
say(numSteps / 2);

function goOneTile(y: number, x: number): [number, number] {
  const pipe = grid[y][x];
  switch (pipe) {
    case '|': return goUpOrDown(y, x);
    case 'J': return goUpOrLeft(y, x);
    case 'F': return goDownOrRight(y, x);
    case '-': return goLeftOrRight(y, x);
    case 'L': return goUpOrRight(y, x);
    case '7': return goLeftOrDown(y, x);
    default: say(pipe);
  }
}

function goUpOrDown(y: number, x: number): [number, number] {
  return canGoUp(y, x) ? goUp(y, x) : goDown(y, x);
}

function goUpOrLeft(y: number, x: number): [number, number] {
  return canGoUp(y, x) ? goUp(y, x) : goLeft(y, x);
}

function goDownOrRight(y: number, x: number): [number, number] {
  return canGoDown(y, x) ? goDown(y, x) : goRight(y, x);
}

function goLeftOrRight(y: number, x: number): [number, number] {
  return canGoLeft(y, x) ? goLeft(y, x) : goRight(y, x);
}

function goUpOrRight(y: number, x: number): [number, number] {
  return canGoUp(y, x) ? goUp(y, x) : goRight(y, x);
}

function goLeftOrDown(y: number, x: number): [number, number] {
  return canGoLeft(y, x) ? goLeft(y, x) : goDown(y, x);
}

function canGoUp(y, x): boolean {
  return ['|', 'F', '7'].includes(grid[y-1][x]);
}

function canGoDown(y, x): boolean {
  return ['|', 'L', 'J'].includes(grid[y+1][x]);
}

function canGoLeft(y, x): boolean {
  return ['-', 'L', 'F'].includes(grid[y][x-1]);
}

function goUp(y: number, x: number): [number, number] {
  grid[y][x] = '^';
  return [y-1, x];
}

function goDown(y: number, x: number): [number, number] {
  grid[y][x] = 'v';
  return [y+1, x];
}

function goLeft(y: number, x: number): [number, number] {
  grid[y][x] = '<';
  return [y, x-1];
}

function goRight(y: number, x: number): [number, number] {
  grid[y][x] = '>';
  return [y, x+1];
}
