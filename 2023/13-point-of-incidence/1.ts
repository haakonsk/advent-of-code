import { readLines, say } from '../../utils';

let sum = 0;
let gridLines: string[] = [];

readLines('input.txt').forEach((line: string) => {
  if (!line) {
    sum += getReflectionSum(gridLines);
    gridLines = [];
    return;
  }
  gridLines.push(line);
});

sum += getReflectionSum(gridLines);
say(sum);

function getReflectionSum(lines: string[]): number {
  return getHorizontalReflectionSum(lines) + getVerticalReflectionSum(lines);
}

function getHorizontalReflectionSum(lines: string[]): number {
  let previousLine: string = '';
  let i = 0;
  for (const line of lines) {
    i++;
    if (line === previousLine && isHorizontalReflection(lines, i-2)) {
      return 100 * (i-1);
    }
    previousLine = line;
  }
  return 0;
}

function getVerticalReflectionSum(lines: string[]): number {
  lines = rotateLines(lines);
  return getHorizontalReflectionSum(lines) / 100;
}

function rotateLines(lines: string[]): string[] {
  const cols: string[] = [];
  for (let i = 0; i < lines[0].length; i++) {
    let col = '';
    for (const line of lines) {
      col += line[i];
    }
    cols.push(col);
  }
  return cols;
}

function isHorizontalReflection(lines: string[], y: number): boolean {
  for (let i = 0; i < lines.length/2; i++) {
    if (!lines[y-i] || !lines[y+i+1]) {
      return true;
    }
    if (lines[y-i] !== lines[y+i+1]) {
      return false;
    }
  }
  return true;
}
