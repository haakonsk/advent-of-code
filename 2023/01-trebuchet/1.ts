import { readLines, say } from '../../utils';

let sum = 0;

readLines('input.txt').forEach((line: string) => {
  const digits = line.replace(/\D/g, '').split('');
  sum += parseInt(digits[0] + digits.pop());
});

say(sum);
