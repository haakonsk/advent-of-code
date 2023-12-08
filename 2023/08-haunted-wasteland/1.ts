import { readLines, say } from '../../utils';

let sum = 0;

const directions = 'LRLRLLRLLRRRLRLLRRLRLRRLRRLLLLRRLLRLRRLRRLRLRLRRLRLLRLRLRLRRRLLRLRLRLRRLRRLRRRLRRLRRLRRLRRLRRRLRRLRLLRLLRRRLRLRLLRRRLLRRLLLLRLRRRLLRLRLRRLRRRLRLRRLRLRRLLRLRRLLRLLRRLRLLRLLRRLRRRLLRRLRLRLRRLRRLRRRLRRLRRRLLRRLRLRRRLRRRLRLRRRLRRLRRLRRLRRRLRRLRLRRRLRLRRLLRRLRRRLRLRRRLLRLRRRLRRRLRLRLRRRLLRRLLRLRRRLRRLRRRLLLRRRR'.split('');
const map: { [currentPosition: string]: [string, string] } = {};

readLines('input.txt').forEach((line: string) => {
  const [currentPosition, leftPosition, rightPosition] = line.match(/\w+/g);
  map[currentPosition] = [leftPosition, rightPosition];
});

let currentPosition = 'AAA';
while (true) {
  directions.forEach((direction) => {
    if (direction === 'L') {
      currentPosition = map[currentPosition][0];
    } else {
      currentPosition = map[currentPosition][1];
    }
    sum++;
  });

  if (currentPosition === 'ZZZ') {
    break;
  }
}

say(sum);
