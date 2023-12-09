const fs = require('fs');

export type Grid = number[][] | boolean[][] | string[][] | any[][];

export function readLines(filePath: string) {
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
  lines.pop();
  return lines;
}

export function sortNumeric(array: number[]): number[] {
  return array.sort((n1,n2) => n1 - n2);
}

export function readLineGroups(filePath: string, numLines: number | null): string[][] {
  const lineGroups = [];
  const content = readLines(filePath);
  let lineNum = 0;
  content.forEach((line) => {
    lineNum++;
    const groupNum: number = Math.floor((lineNum - 1) / numLines);
    if (!lineGroups[groupNum]) {
      lineGroups[groupNum] = [];
    }
    lineGroups[groupNum].push(line);
  });
  return lineGroups;
}

export function readLinesSplit(filePath: string, separator = ' ') {
  const lines = readLines(filePath);
  const lineArrays = [];
  lines.forEach((line) => {
    lineArrays.push(line.split(separator));
  });
  return lineArrays;
}

export function reverseString(s: string) {
  return s.split('').reverse().join('');
}

export function captureIntegers(s: string, num: number): number[] {
  const matches = new RegExp('[^\\d]*(\\d+)[^\\d]*'.repeat(num)).exec(s) as unknown as number[];
  matches.shift();
  return matches;
}

export function getRowToTheLeft(grid: number[][], rowIdx: number, colIdx: number): number[] {
  const row: number[] = [];
  for (let i = colIdx-1; i >= 0; i--) {
    row.push(grid[rowIdx][i]);
  }
  return row;
}

export function getRowToTheRight(grid: number[][], rowIdx: number, colIdx: number): number[] {
  const row: number[] = [];
  for (let i = colIdx+1; i <= grid.length - 1; i++) {
    row.push(grid[rowIdx][i]);
  }
  return row;
}

export function getColToTheUp(grid: number[][], rowIdx: number, colIdx: number): number[] {
  const col: number[] = [];
  for (let i = rowIdx-1; i >= 0; i--) {
    col.push(grid[i][colIdx]);
  }
  return col;
}

export function getColToTheDown(grid: number[][], rowIdx: number, colIdx: number): number[] {
  const col: number[] = [];
  for (let i = rowIdx+1; i <= grid[0].length - 1; i++) {
    col.push(grid[i][colIdx]);
  }
  return col;
}

export function printGrid(grid: Grid): void {
  let str = '';
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const val = grid[i][j];
      str += typeof val === "boolean" ? (val ? '#' : ' ') : val === null ? ' ' : val;
    }
    str += '\n';
  }
  console.log(str);
}

export function printGridTrim(grid: Grid, ignore = ''): void {
  grid = trimGrid(grid, true, ignore);
  printGrid(grid);
}

function trimGrid(grid: Grid, allowZero: boolean, ignore: string): Grid {
  let [firstRow, firstCol, lastRow, lastCol] = [0, 0, grid.length - 1, grid[0].length - 1];

  for (let i = 0; i < grid.length; i++) {
    if (rowIsNull(grid, i, allowZero, ignore)) {
      firstRow++;
    } else {
      break;
    }
  }
  for (let i = 0; i < 2000; i++) {
    if (colIsNull(grid, i, allowZero, ignore)) {
      firstCol++;
    } else {
      break;
    }
  }
  for (let i = grid.length - 1; i >= 0; i--) {
    if (rowIsNull(grid, i, allowZero, ignore)) {
      lastRow--;
    } else {
      break;
    }
  }
  for (let i = grid[0].length - 1; i >= 0; i--) {
    if (colIsNull(grid, i, allowZero, ignore)) {
      lastCol--;
    } else {
      break;
    }
  }

  const newGrid: Grid = [];
  for (let i = firstRow; i <= lastRow; i++) {
    newGrid.push(Array(lastRow - firstRow).fill(null));
    for (let j = firstCol; j <= lastCol; j++) {
      newGrid[i - firstRow][j - firstCol] = grid[i][j];
    }
  }
  return newGrid;
}

function rowIsNull(grid: Grid, rowIdx, allowZero: boolean, ignore: string): boolean {
  for (let i = 0; i < grid[rowIdx].length; i++) {
    if (!valueIsNull(grid[rowIdx][i], allowZero, ignore)) {
      return false;
    }
  }
  return true;
}

function colIsNull(grid: Grid, colIdx: number, allowZero: boolean, ignore: string): boolean {
  for (let i = 0; i < grid[0].length; i++) {
    if (!valueIsNull(grid[i][colIdx], allowZero, ignore)) {
      return false;
    }
  }
  return true;
}

function valueIsNull(value: number | string | boolean, allowZero: boolean, ignore: string): boolean {
  if (ignore && value === ignore) {
    return true;
  }
  return !(value || value === 0 && allowZero);
}

export function fillGrid(numRows: number, numCols: number, defaultValue: any) {
  const grid: Grid = [];
  for (let i = 0; i < numRows; i++) {
    grid.push(Array(numCols).fill(defaultValue));
  }
  return grid;
}

export function say(...data: any[]): void {
  console.log(...data);
}

export function sayIndent(indent: number, ...data: any[]): void {
  console.log(' '.repeat(indent), ...data);
}

export function numCmp(a: number, b: number): number {
  return a-b;
}

export function multiplyNumbers(numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc * curr, 1);
}

export function factorizeIntoPrimes(number: number): number[] {
  const primes: number[] = [];

  // Divide by 2 until it's odd
  while (number % 2 === 0) {
    primes.push(2);
    number /= 2;
  }

  // Try dividing by odd numbers starting from 3
  for (let i = 3; i <= Math.sqrt(number); i += 2) {
    while (number % i === 0) {
      primes.push(i);
      number /= i;
    }
  }

  if (number > 2) {
    primes.push(number);
  }

  return primes;
}

/*
// Warn if overriding existing method
if(Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;
  // if the argument is the same array, we can be sure the contents are same as well
  if(array === this)
    return true;
  // compare lengths - can save a lot of time
  if (this.length != array.length)
    return false;

  for (var i = 0, l=this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
*/
