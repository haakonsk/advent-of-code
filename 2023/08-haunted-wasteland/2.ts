import { readLines, say } from '../../utils';

let sum = 0;

const directions = 'LRLRLLRLLRRRLRLLRRLRLRRLRRLLLLRRLLRLRRLRRLRLRLRRLRLLRLRLRLRRRLLRLRLRLRRLRRLRRRLRRLRRLRRLRRLRRRLRRLRLLRLLRRRLRLRLLRRRLLRRLLLLRLRRRLLRLRLRRLRRRLRLRRLRLRRLLRLRRLLRLLRRLRLLRLLRRLRRRLLRRLRLRLRRLRRLRRRLRRLRRRLLRRLRLRRRLRRRLRLRRRLRRLRRLRRLRRRLRRLRLRRRLRLRRLLRRLRRRLRLRRRLLRLRRRLRRRLRLRLRRRLLRRLLRLRRRLRRLRRRLLLRRRR'.split('');
const map: { [currentPosition: string]: [string, string] } = {};

readLines('input.txt').forEach((line: string) => {
  const [currentPosition, leftPosition, rightPosition] = line.match(/\w+/g);
  map[currentPosition] = [leftPosition, rightPosition];
});

const currentPositions = getStartingPositions();
say(currentPositions);

let maxZs = 0;

OUTER:
while (true) {
  for (const direction of directions) {
    currentPositions.forEach((currentPosition, i) => {
      if (direction === 'L') {
        currentPositions[i] = map[currentPosition][0];
      } else {
        currentPositions[i] = map[currentPosition][1];
      }
    })
    sum++;
    const endingPositions = currentPositions.filter((position) => position.endsWith('Z'));
    if (endingPositions.length > maxZs) {
      maxZs = endingPositions.length;
      say(maxZs, sum);
      /*
      The script didn't terminate, but this was printed (I've added prime factorization):
      1 13201      (=         43*307)
      2 778859     (=      59*43*307)
      3 52183553   (=   67*59*43*307)
      4 3705032263 (=71*67*59*43*307)
      So I was able to guess the next two:
      5 270467355199   (=   73*71*67*59*43*307)
      6 21366921060721 (=79*73*71*67*59*43*307)
      So the final answer was: 21366921060721 (since there were 6 starting positions)
      */
    }
    if (!currentPositions.some((currentPosition) => !currentPosition.endsWith('Z'))) {
      break OUTER;
    }
  }
}

say(sum);

function getStartingPositions(): string[] {
  return Object
  .keys(map)
  .map((startingPosition) => startingPosition)
  .filter((startingPosition) => startingPosition.endsWith('A'));
}
