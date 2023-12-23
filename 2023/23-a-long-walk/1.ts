import { readLinesSplit, say } from '../../utils';

class TrailLocation {
  y: number;
  x: number;
  type: '.' | '#' | '^' | 'v' | '>' | '<';
  currentTrailLengths: { [key: string ]: number } = {};

  constructor(type, y, x) {
    this.type = type;
    this.y = y;
    this.x = x;
  }

  enter(currentLength: number, enteredFrom: [number, number]): void {
    const key = this.getCacheKey(enteredFrom);
    const prevLongestPath = this.currentTrailLengths[key];
    const currentPathLength = currentLength + 1;
    if (currentLength <= prevLongestPath) {
      return;
    }
    if (this.y === trailMap.length - 1) {
      say(currentLength);
      return;
    }
    this.currentTrailLengths[key] = currentPathLength;
    for (let [y, x, allowedType] of [[this.y+1, this.x, 'v'], [this.y-1, this.x, '^'], [this.y, this.x-1, '<'], [this.y, this.x+1, '>']]) {
      if (y === enteredFrom[0] && x === enteredFrom[1] || !['.', allowedType].includes(trailMap[y][x].type)) {
        continue;
      }
      trailMap[y][x].enter(currentPathLength, [this.y, this.x]);
    }
  }

  getCacheKey(enteredFrom: [number, number]): string {
    return `${enteredFrom[0]},${enteredFrom[1]}`;
  }

  toString(): string {
    return this.type;
  }
}

const trailMap: TrailLocation[][] = [];

readLinesSplit('input.txt', '').forEach((lineArray: string[], y) => {
  const row: TrailLocation[] = [];
  lineArray.forEach((char, x) => {
    row.push(new TrailLocation(char, y, x));
  })
  trailMap.push(row);
});

trailMap[1][1].enter(1, [0, 1]);
