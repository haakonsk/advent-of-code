import { multiplyNumbers, say } from '../../utils';

const races = {
  40: 277,
  82: 1338,
  91: 1349,
  66: 1063,
}

const numWaysToWinPerRace: number[] = [];
Object.keys(races).forEach((durationStr) => {
  const duration = parseInt(durationStr);
  const record = races[duration];
  let numWaysToWin = 0;
  for (let i = 0; i < duration; i++) {
    if (getDistance(i, duration) > record) {
      numWaysToWin++;
    }
  }
  numWaysToWinPerRace.push(numWaysToWin);
})

say(multiplyNumbers(numWaysToWinPerRace));

function getDistance(chargeDuration: number, totalDuration: number): number {
  return (totalDuration - chargeDuration) * chargeDuration;
}
