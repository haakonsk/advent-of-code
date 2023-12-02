import { readLines, say } from '../../utils';

let sum = 0;

readLines('input.txt').forEach((line: string) => {
  const m = line.match(/:(.+)/);
  const cubeSets = m[1].split(';');
  let [minGreen, minRed, minBlue] = [0, 0, 0];
  cubeSets.forEach((cubeSet) => {
    const numGreen = parseInt(cubeSet.match(/(\d+) green/)?.shift() ?? '0');
    const numRed = parseInt(cubeSet.match(/(\d+) red/)?.shift() ?? '0');
    const numBlue = parseInt(cubeSet.match(/(\d+) blue/)?.shift() ?? '0');
    if (numGreen > minGreen) {
      minGreen = numGreen;
    }
    if (numRed > minRed) {
      minRed = numRed;
    }
    if (numBlue > minBlue) {
      minBlue = numBlue;
    }
  });
  sum += minGreen * minRed * minBlue;
});

say(sum);
