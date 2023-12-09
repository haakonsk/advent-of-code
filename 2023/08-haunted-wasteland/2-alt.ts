import { factorizeIntoPrimes, multiplyNumbers, readLines, say } from '../../utils';

const directions = 'LRLRLLRLLRRRLRLLRRLRLRRLRRLLLLRRLLRLRRLRRLRLRLRRLRLLRLRLRLRRRLLRLRLRLRRLRRLRRRLRRLRRLRRLRRLRRRLRRLRLLRLLRRRLRLRLLRRRLLRRLLLLRLRRRLLRLRLRRLRRRLRLRRLRLRRLLRLRRLLRLLRRLRLLRLLRRLRRRLLRRLRLRLRRLRRLRRRLRRLRRRLLRRLRLRRRLRRRLRLRRRLRRLRRLRRLRRRLRRLRLRRRLRLRRLLRRLRRRLRLRRRLLRLRRRLRRRLRLRLRRRLLRRLLRLRRRLRRLRRRLLLRRRR'.split('');
const map: { [currentPosition: string]: [string, string] } = {};

readLines('input.txt').forEach((line: string) => {
  const [currentPosition, leftPosition, rightPosition] = line.match(/\w+/g);
  map[currentPosition] = [leftPosition, rightPosition];
});

const startingPositions = getStartingPositions();
const currentPositions = [...startingPositions];
say(startingPositions);
const primes: Set<number> = new Set();

startingPositions.forEach((_, i) => {
  let count = 0;
  FOREVER:
    while (true) {
      for (const direction of directions) {
        if (direction === 'L') {
          currentPositions[i] = map[currentPositions[i]][0];
        } else {
          currentPositions[i] = map[currentPositions[i]][1];
        }
        count++;
        if (currentPositions[i].endsWith('Z')) {
          factorizeIntoPrimes(count).forEach((prime) => (primes.add(prime)));
          break FOREVER;
        }
      }
    }
});

say(primes);
say(multiplyNumbers(Array.from(primes)));

function getStartingPositions(): string[] {
  return Object
  .keys(map)
  .map((startingPosition) => startingPosition)
  .filter((startingPosition) => startingPosition.endsWith('A'));
}
