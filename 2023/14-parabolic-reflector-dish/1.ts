import { printGrid, readLinesSplit, say } from '../../utils';

const grid: string[][] = [];
readLinesSplit('input.txt', '').forEach((lineArray: string[]) => {
  grid.push(lineArray);
});

tiltNorth();
say(getTotalLoad());

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
