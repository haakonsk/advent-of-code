import { fillGrid, printGrid, readLinesSplit, say } from '../../utils';

let sum = 0;
let size = 400;
let y = size;
let x = size;

const grid = fillGrid(size*2, size*2, '.');
grid[y][x] = '#';

readLinesSplit('input.txt', ' ').forEach(([direction, length, _]) => {
  length = parseInt(length);
  switch (direction) {
    case 'U': digUpwards(length); break;
    case 'D': digDownwards(length); break;
    case 'L': digLeftwards(length); break;
    case 'R': digRightwards(length); break;
  }
});

for (let y = 0; y < size*2; y++) {
  let hasSeenHash = false;
  for (let x = 0; x < size * 2; x++) {
    if (hasSeenHash && grid[y][x] === '.' && isInsideDitch(y, x)) {
      grid[y][x] = '#';
      sum++;
    }
    if (!hasSeenHash) {
      hasSeenHash = grid[y][x] !== '.' && grid[y][x] !== 'v';
    }
  }
}

printGrid(grid)
say(sum);

function digUpwards(length: number): void {
  for (let i = 0; i < length; i++) {
    sum++;
    grid[--y][x] = '^';
  }
}

function digDownwards(length: number): void {
  for (let i = 0; i < length; i++) {
    sum++;
    grid[++y][x] = 'v';
  }
}

function digLeftwards(length: number): void {
  for (let i = 0; i < length; i++) {
    sum++;
    grid[y][--x] = '<';
  }
}

function digRightwards(length: number): void {
  for (let i = 0; i < length; i++) {
    sum++;
    grid[y][++x] = '>';
  }
}

function isInsideDitch(y: number, x: number): boolean {
  const [nextNonEmpty, i] = getNextNonEmpty(y, x);
  if (nextNonEmpty === 'v') {
    return true;
  }
  if (nextNonEmpty === '<' && grid[y+1][i] === 'v') {
    return true;
  }
  if (nextNonEmpty === '>' && grid[y-1][i] === 'v') {
    return true;
  }
  return false;
}

function getNextNonEmpty(y: number, x: number): [string, number] {
  for (let i = x+1; i < grid[0].length; i++) {
    if (grid[y][i] !== '.') {
      return [grid[y][i], i];
    }
  }
  return ['', 0];
}

