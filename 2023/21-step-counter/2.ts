import { readLines, say } from '../../utils';

// TODO: Need a smart solution when 2 * numSteps (much) greater than grid.length

const grid: string[] = [];

readLines('input.txt').forEach((line: string, y) => {
  if (line.indexOf('S') !== -1) {
    line = line.replace('S', '.');
  }
  grid.push(line);
});

for (let i = 1; i <= 64; i++) {
  say(getNumPositions(i))
}

function getNumPositions(numSteps: number): number {
  let sum = 0;
  const startY = Math.floor((grid[0].length - 2 * numSteps) / 2);
  const endY = Math.ceil(grid[0].length / 2) + numSteps;
  const midPos = (grid.length - 1) / 2;
  let strLen = 1;
  for (let y = startY; y < endY; y++) {
    const [midStr, startIndex] = getMiddleSubstring(grid[y], strLen);
    const numObstacles = midStr
      .split('')
      .filter((char, i) => i % 2 === 0 && (char === '#' || !isReachable(y, i + startIndex, startIndex, midPos)))
      .length;
    const numPositions = Math.floor(strLen / 2) + 1 - numObstacles;
    // say(y, numPositions, numObstacles, midStr);
    sum += numPositions;
    y < midPos ? strLen += 2 : strLen -= 2;
  }
  return sum;
}

function getMiddleSubstring(inputString: string, len: number): [string, number] {
  const startIndex = Math.floor((inputString.length - len) / 2);
  return [inputString.substring(startIndex, startIndex + len), startIndex];
}

function isReachable(y: number, x: number, startX: number, midY): boolean {
  if (grid[y][x-1] === '#' && grid[y][x+1] === '#' && grid[y-1][x] === '#' && grid[y+1][x] === '#') {
    return false;
  }
  if (x < midY && grid[y][x+1] === '#' && grid[y+(y < midY ? 1 : -1)][x] === '#' && x-startX < 2) {
    return false;
  }
  if (x > midY && grid[y][x-1] === '#' && grid[y+(y < midY ? 1 : -1)][x] === '#' && grid[y].length - startX - x < 2) {
    return false;
  }
  // More TODO here
  return true;
}
