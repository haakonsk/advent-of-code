import { readLines, say } from '../../utils';

let sum = 0;
const lines = [];

readLines('input.txt').forEach((line: string) => {
  lines.push(line);
});

let prevLine = '';
lines.forEach((line: string, i) => {
  const matches = line.split(/(\d+)/g);
  let matchPos = 0;
  matches.forEach((match, matchIndex) => {
    const prevMatch = matches[matchIndex - 1];
    if (match[0]?.match(/\d/)) {
      if (matchPos > 0 && prevMatch && !prevMatch.endsWith('.')
        || matchIndex < matches.length - 1 && matches[matchIndex + 1] && !matches[matchIndex + 1].startsWith(('.'))
        || isNextToSymbol(match, matchPos, prevLine)
        || isNextToSymbol(match, matchPos, lines[i+1])
      ) {
        say('yes', match);
        sum += parseInt(match);
      }
    }
    matchPos += match.length;
  })
  prevLine = line;
});

function isNextToSymbol(number: string, matchPos: number, line: string | undefined): boolean {
  let [minIndex, maxIndex] = [matchPos, matchPos + number.length];
  if (minIndex > 0) {
    minIndex--;
  }
  return !!line?.substring(minIndex, maxIndex + 1).match(/[^.\d]/);
}

say(sum);
