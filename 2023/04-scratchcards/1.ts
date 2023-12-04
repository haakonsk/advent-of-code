import { readLines, say } from '../../utils';

let sum = 0;

readLines('input.txt').forEach((line: string) => {
  // say(line.replace(/Card\s+\d:\s*/, ''));
  const [yourNumbersString, winningNumbersString]
    = line.replace(/Card\s+\d:\s*/, '').split(/\s*\|\s*/);
  const yourNumbers = yourNumbersString.split(/\s+/);
  const winningNumbers = winningNumbersString.split(/\s+/)
  let pow = yourNumbers.filter((num) => winningNumbers.includes(num)).length - 1;
  if (pow < 0) {
    return;
  }
  say(pow);
  sum += Math.pow(2, pow);
  // say(yourNumbers, winningNumbers);
});

say(sum);
