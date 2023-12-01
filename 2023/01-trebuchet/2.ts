import { readLines, reverseString, say } from '../../utils';

let sum = 0;
const numberStrings = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

readLines('input.txt').forEach((line: string) => {
  let [firstNumberStringIndex, firstNumberString, firstNumber, lastNumberStringIndex, lastNumberString, lastNumber]
    = [Infinity, '', -1, -1, '', -1];

  numberStrings.forEach((numberString, i) => {
    let index = line.indexOf(numberString);
    if (index !== -1 && index < firstNumberStringIndex) {
      [firstNumberStringIndex, firstNumberString, firstNumber] = [index, numberString, i + 1];
    }
    index = line.lastIndexOf(numberString);
    if (index !== -1 && index > lastNumberStringIndex) {
      [lastNumberStringIndex, lastNumberString, lastNumber] = [index, numberString, i + 1];
    }
  })

  const firstRealDigitIndex = line.match(/[1-9]/)?.index ?? -1;
  if (firstRealDigitIndex < lastNumberStringIndex) {
    line = replaceLastNumberString(line, lastNumberString, lastNumber);
    line = replaceFirstNumberString(line, firstNumberString, firstNumber);
  } else {
    line = replaceFirstNumberString(line, firstNumberString, firstNumber);
    line = replaceLastNumberString(line, lastNumberString, lastNumber);
  }

  const digits = line.replace(/\D/g, '').split('');
  sum += parseInt(digits[0] + digits.pop());
});

say(sum);

function replaceFirstNumberString(line: string, firstNumberString: string, firstNumber: number): string {
  return firstNumberString ? line.replace(firstNumberString, firstNumber.toString()) : line;
}

function replaceLastNumberString(line: string, lastNumberString: string, lastNumber: number): string {
  return lastNumberString
    ? reverseString(reverseString(line).replace(reverseString(lastNumberString), lastNumber.toString()))
    : line;
}
