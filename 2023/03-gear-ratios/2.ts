import { readLines, say } from '../../utils';

let sum = 0;
const lines = [];

readLines('input.txt').forEach((line: string) => {
  lines.push(line);
});

lines.forEach((line: string, rowIndex) => {
  const gearIndices = getGearIndices(line);
  gearIndices.forEach((index) => {
    const adjacentNumbers = getAdjacentNumbers(rowIndex, index);
    if (adjacentNumbers.length === 2) {
      sum += adjacentNumbers[0] * adjacentNumbers[1];
    }
    if (adjacentNumbers.length > 2) {
      say(adjacentNumbers);
    }
  })
});

function getAdjacentNumbers(rowIndex: number, gearIndex: number): number[] {
  const adjacentNumbers = getAdjacentNumbersOnLine(lines[rowIndex], gearIndex);
  const prevLine = lines[rowIndex - 1];
  if (prevLine) {
    const numbers: string[] = prevLine.match(/-?\d+/g);
    numbers?.forEach((number) => {
      const indexOfNumber = prevLine.indexOf(number, gearIndex-number.length);
      if (
        !prevLine[indexOfNumber - 1]?.match(/\d/)
        && !prevLine[indexOfNumber + number.length]?.match(/\d/)
        && (Math.abs(indexOfNumber - gearIndex) <= 1 || Math.abs(indexOfNumber + number.length - gearIndex - 1) <= 1)) {
        adjacentNumbers.push(parseInt(number));
      }
    })
  }
  const nextLine = lines[rowIndex + 1];
  if (nextLine) {
    const numbers: string[] = nextLine.match(/-?\d+/g);
    numbers?.forEach((number) => {
      const indexOfNumber = nextLine.indexOf(number, gearIndex-number.length);
      if (
        !nextLine[indexOfNumber - 1]?.match(/\d/)
        && !nextLine[indexOfNumber + number.length]?.match(/\d/)
        && (Math.abs(indexOfNumber - gearIndex) <= 1 || Math.abs(indexOfNumber + number.length - gearIndex - 1) <= 1)) {
          adjacentNumbers.push(parseInt(number));
      }
    })
  }
  // say(rowIndex, gearIndex, adjacentNumbers);
  return adjacentNumbers;
}

function getAdjacentNumbersOnLine(line: string, gearIndex: number): number[] {
  const adjacentNumbers: number[] = [];
  if (gearIndex > 0 && line[gearIndex-1].match(/-?\d/)) {
    adjacentNumbers.push(parseInt(line.substring(0, gearIndex).match(/-?(\d+)$/)[1]));
  }
  if (gearIndex < line.length - 1 && line[gearIndex+1].match(/-?\d/)) {
    adjacentNumbers.push(parseInt(line.substring(gearIndex+1).match(/^(-?\d+)/)[1]));
  }
  return adjacentNumbers;
}

function getGearIndices(inputString: string): number[] {
  const gearIndices: number[] = [];

  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i] === '*') {
      gearIndices.push(i);
    }
  }

  return gearIndices;
}

say(sum);
// 80432976 + 287 * 634 + 397 * 766 + 287 * 221
// 80982463 - 896 * 896
