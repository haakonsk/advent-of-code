import { readLinesSplit, say } from '../../utils';

let sum = 0;
let grid: string[][] = [];

interface Galaxy {
  yPos: number;
  xPos: number;
}

const galaxies: Galaxy[] = [];
let numRowsInserted = 0;
readLinesSplit('input.txt', '').forEach((lineArray: string[], y) => {
  if (!lineArray.includes('#')) {
    numRowsInserted++;
  }
  lineArray.forEach((str, x) => {
    if (str === '#') {
      galaxies.push({ yPos: y + 999_999 * numRowsInserted, xPos: x });
    }
  });
  grid.push(lineArray);
});

for (let x = grid[0].length - 1; x > 0; x--) {
  let columnIsEmpty = true;
  let colNum = -1;
  for (let y = 0; y < grid.length; y++) {
    if (grid[y][x] === '#') {
      columnIsEmpty = false;
      colNum = x;
    }
  }
  if (columnIsEmpty) {
    insertMillionMinusOneColumns(x);
  }
}

galaxies.forEach((galaxy1) => {
  galaxies.forEach((galaxy2) => {
    sum += Math.abs(galaxy2.yPos - galaxy1.yPos) + Math.abs(galaxy2.xPos - galaxy1.xPos);
  })
});

say(sum / 2);

function insertMillionMinusOneColumns(columnIndexToInsert: number): void {
  galaxies.forEach((galaxy) => {
    if (galaxy.xPos > columnIndexToInsert) {
      galaxy.xPos += 999_999;
    }
  })
}
