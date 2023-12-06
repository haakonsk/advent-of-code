import { say } from '../../utils';

const duration = 40829166;
const record = 277133813491063;

let [minDuration, maxDuration] = [0, 0];
for (let i = 0; i < duration; i++) {
  if (getDistance(i, duration) > record) {
    minDuration = i;
    break;
  }
}
for (let i = duration; i > 0; i--) {
  if (getDistance(i, duration) > record) {
    maxDuration = i;
    break;
  }
}

say(maxDuration - minDuration + 1);

function getDistance(chargeDuration: number, totalDuration: number): number {
  return (totalDuration - chargeDuration) * chargeDuration;
}

