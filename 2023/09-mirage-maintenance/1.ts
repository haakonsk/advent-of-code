import { readLinesSplit, say } from '../../utils';

let sum = 0;

readLinesSplit('input.txt', ' ').forEach((sequenceStr: string[]) => {
  const sequence = sequenceStr.map((num) => parseInt(num));
  const diffLines: number[][] = getDiffLines(sequence);
  let isLastLine = true;
  diffLines.reverse().forEach((diffLine, i) => {
    if (isLastLine) {
      isLastLine = false;
      diffLine.push(0);
      return;
    }
    const nextDiffLine = diffLines[i-1];
    if (nextDiffLine) {
      diffLine.push(diffLine[diffLine.length - 1] + nextDiffLine[nextDiffLine.length - 1]);
    }
  });
  const nextNumberInSequence = sequence[sequence.length - 1] + diffLines[diffLines.length - 1][diffLines[diffLines.length - 1].length - 1];
  sum += nextNumberInSequence;
});

say(sum);

function getDiffLines(numbers: number[]): number[][] {
  const diffLines: number[][] = [];
  do {
    const diffs: number[] = [];
    for (let i = 1; i < numbers.length; i++) {
      diffs.push(numbers[i] - numbers[i - 1]);
    }
    diffLines.push([...diffs]);
    numbers = [...diffs];
  } while (diffLines[diffLines.length - 1].some((value) => !!value));
  return diffLines;
}
