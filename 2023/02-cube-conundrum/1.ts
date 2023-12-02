import { readLines, say } from '../../utils';

let sum = 0;

readLines('input.txt').forEach((line: string) => {
  const m = line.match(/Game (\d+):(.+)/);
  const id = parseInt(m[1]);
  const cubeSets = m[2].split(';');
  let shouldAdd = true;
  cubeSets.forEach((cubeSet) => {
    const numGreen = parseInt(cubeSet.match(/(\d+) green/)?.shift() ?? '0');
    const numRed = parseInt(cubeSet.match(/(\d+) red/)?.shift() ?? '0');
    const numBlue = parseInt(cubeSet.match(/(\d+) blue/)?.shift() ?? '0');
    if (numGreen > 13 || numRed > 12 || numBlue > 14) {
      shouldAdd = false;
    }
  });
  if (shouldAdd) {
    sum += id;
  }
});

say(sum);
