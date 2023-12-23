import { beep, readLinesSplit, say } from '../../utils';

console.time();

enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}

class TrailLocation {
  y: number;
  x: number;
  type: '.' | '#';
  beenHereBefore = false;

  constructor(type, y, x) {
    this.type = type;
    this.y = y;
    this.x = x;
  }

  enter(currentLength: number, direction: Direction): void {
    if (this.beenHereBefore) {
      return;
    }
    this.beenHereBefore = true;
    if (this.y === trailMap.length - 2 && this.x === trailMap[0].length - 2) {
      this.beenHereBefore = false;
      if (currentLength + 1 > longestPath) {
        longestPath = currentLength + 1;
        say(longestPath);
      }
      return;
    }
    for (let dir of [Direction.down, Direction.left, Direction.right, Direction.up]) {
      const [y, x] = getNextCoordinates(dir, this.y, this.x);
      if (dir === getOppositeDirection(direction) || trailMap[y][x].type === '#') {
        continue;
      }
      const [nextJunctionY, nextJunctionX, distance] = jumpToNextTurnOrCrossroads(y, x, dir); // Can't enter every location, will be too much recursion
      if (nextJunctionY === this.y && nextJunctionX === this.x) {
        continue;
      }
      trailMap[nextJunctionY][nextJunctionX].enter(currentLength + distance + 1, dir);
    }
    this.beenHereBefore = false;
  }

  toString(): string {
    return this.type;
  }
}

const trailMap: TrailLocation[][] = [];

readLinesSplit('input.txt', '').forEach((lineArray: string[], y) => {
  const row: TrailLocation[] = [];
  lineArray.forEach((char, x) => {
    row.push(new TrailLocation(char === '#' ? '#' : '.', y, x));
  })
  trailMap.push(row);
});

let longestPath = 0;
trailMap[1][1].enter(1, Direction.down);
beep();
console.timeLog();

function jumpToNextTurnOrCrossroads(y: number, x: number, direction: Direction): [number, number, number] {
  for (let i = 1; i < trailMap.length; i++) {
    [y, x] = getNextCoordinates(direction, y, x);
    const isCrossroads = [Direction.up, Direction.down].includes(direction) ? canGoLeftOrRight(y, x) : canGoUpOrDown(y, x);
    if (isCrossroads) {
      return [y, x, i];
    }
  }
}

function canGoInDirection(direction: Direction, y: number, x: number): boolean {
  [y, x] = getNextCoordinates(direction, y, x);
  return trailMap[y][x].type !== '#';
}

function canGoUpOrDown(y: number, x: number): boolean {
  return canGoInDirection(Direction.up, y, x) || canGoInDirection(Direction.down, y, x);
}

function canGoLeftOrRight(y: number, x: number): boolean {
  return canGoInDirection(Direction.left, y, x) || canGoInDirection(Direction.right, y, x);
}

function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case Direction.up: return Direction.down;
    case Direction.down: return Direction.up;
    case Direction.left: return Direction.right;
    case Direction.right: return Direction.left;
  }
}

function getNextCoordinates(direction: Direction, y: number, x: number): [number, number] {
  y = direction === Direction.up ? y - 1 : direction === Direction.down ? y + 1 : y;
  x = direction === Direction.left ? x - 1 : direction === Direction.right ? x + 1 : x;
  return [y, x];
}
