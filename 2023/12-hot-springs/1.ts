import { addNumbers, readLinesSplit, say } from '../../utils';

let sum = 0;

readLinesSplit('input.txt', ' ').forEach(([pattern, numGroupsStr]) => {
  const numGroups = numGroupsStr.split(',').map((numStr) => parseInt(numStr));
  sum += getNumArrangements(pattern, numGroups);
});

say(sum);

function getNumArrangements(pattern: string, numGroups: number[]): number {
  let count = 0;
  // say(pattern, numGroups);
  const characters = pattern.split('');
  const numQuestionMarks = characters.filter((s) => s === '?').length;
  const numBrokenSprings = addNumbers(numGroups) - characters.filter((s) => s === '#').length;
  generatePossibleCombinations(numQuestionMarks, numBrokenSprings).forEach((combination) => {
    if (isValidArrangement(pattern, combination, numGroups)) {
      count++;
    }
  });
  return count;
}

function isValidArrangement(pattern: string, combination: string[], expectedNumGroups: number[]): boolean {
  pattern.split('').forEach((c, i) => {
    if (c === '?') {
      pattern = replaceCharAtPosition(pattern, i, combination.shift());
    }
  });
  const numGroups = Array.from(pattern.match(/#+/g)).map((p) => p.length);
  return numGroups.join(',') === expectedNumGroups.join(',');
}

function generatePossibleCombinations(numQuestionMarks: number, numBrokenSprings: number): string[][] {
  if (numQuestionMarks === 0) {
    return [];
  }
  if (numQuestionMarks === numBrokenSprings) {
    return ['#'.repeat(numQuestionMarks).split('')];
  }
  if (numBrokenSprings === 0) {
    return ['.'.repeat(numQuestionMarks).split('')];
  }
  const combinations: string[][] = [];
  for (let replaceValue of ['.', '#']) {
    const numRemainingBrokenSprings = replaceValue === '#' ? numBrokenSprings - 1 : numBrokenSprings;
    generatePossibleCombinations(numQuestionMarks-1, numRemainingBrokenSprings).forEach((combination) => {
      combinations.push([replaceValue, ...combination]);
    })
  }
  return combinations;
}

function replaceCharAtPosition(inputString: string, position: number, newChar: string): string {
  const characters = inputString.split('');
  characters[position] = newChar;
  return characters.join('');
}
