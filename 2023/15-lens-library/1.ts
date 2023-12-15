import { readLinesSplit, say } from '../../utils';

let sum = 0;

readLinesSplit('input.txt', ',').forEach((words: string[]) => {
  words.forEach((word) => {
    sum += getHashValue(word);
  })
});

say(sum);

function getHashValue(word: string): number {
  let value = 0;
  word.split('').forEach((char) => {
    value += char.charCodeAt(0);
    value *= 17;
    value %= 256;
  });

  return value;
}
