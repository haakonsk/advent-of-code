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
  const origHSum = getHorizontalReflectionSum(lines);
  const origVSum = getVerticalReflectionSum(lines);

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      lines[y] = toggleAshRock(lines[y], x);
      const hSum = getHorizontalReflectionSum(lines, origHSum);
      const vSum = getVerticalReflectionSum(lines, origVSum);
      const sum = (hSum !== origHSum ? hSum : 0) + (vSum !== origVSum ? vSum : 0);
      if (sum > 0 && sum !== origHSum + origVSum) {
        return sum;
      }
      lines[y] = toggleAshRock(lines[y], x); // Toggle back
    }
  }
}

function toggleAshRock(line: string, x: number): string {
  const chars = line.split('');
  chars[x] = chars[x] === '#' ? '.' : '#';
  return chars.join('');
}

function getHorizontalReflectionSum(lines: string[], excludeSum = 0): number {
  let previousLine: string = '';
  let i = 0;
  for (const line of lines) {
    i++;
    const sum = 100 * (i-1);
    if (line === previousLine && isHorizontalReflection(lines, i-2) && sum !== excludeSum) {
      return sum;
    }
    previousLine = line;
  }
  return 0;
}

function getVerticalReflectionSum(lines: string[], excludeSum = 0): number {
  lines = rotateLines(lines);
  return getHorizontalReflectionSum(lines, excludeSum * 100) / 100;
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

