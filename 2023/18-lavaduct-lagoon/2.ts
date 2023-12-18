import { addNumbers, readLinesSplit, say } from '../../utils';

enum Direction {
  right,
  down,
  left,
  up,
}

class Corner {
  y: number;
  x: number;
}

class Line {
  corners: [Corner, Corner];
  direction: Direction;

  constructor(corners: [Corner, Corner], direction: Direction) {
    this.corners = corners;
    this.direction = direction;
  }

  getLength(): number {
    return [Direction.up, Direction.down].includes(this.direction)
      ? Math.abs(this.corners[0].y - this.corners[1].y) + 1
      : Math.abs(this.corners[0].x - this.corners[1].x) + 1;
  }
}

let previousCorner = new Corner();
previousCorner.y = 0;
previousCorner.x = 0

const verticalLines: Line[] = [];
const horizontalLines: Line[] = [];

let minY = Infinity;
let maxY = -Infinity;

readLinesSplit('input.txt', ' ').forEach(([directionStr, lengthStr, instruction]) => {
  instruction = instruction.match(/[\da-f]+/)[0];
  const direction = parseInt(instruction[instruction.length - 1]);
  const length = parseInt(instruction.substring(0, 5), 16);
  /*
  const length = parseInt(lengthStr);
  const direction = getDirection(directionStr);
  */
  const corner = new Corner();
  corner.y = previousCorner.y;
  corner.x = previousCorner.x;
  const line = new Line([previousCorner, corner], direction);
  if (direction === Direction.up) {
    corner.y -= length;
    if (corner.y < minY) {
      minY = corner.y;
    }
    verticalLines.push(line);
  } else if (direction === Direction.down) {
    corner.y += length;
    if (corner.y > maxY) {
      maxY = corner.y;
    }
    verticalLines.push(line);
  } else if (direction === Direction.left) {
    corner.x -= length;
    horizontalLines.push(line);
  } else if (direction === Direction.right) {
    corner.x += length;
    horizontalLines.push(line);
  }
  if (corner.x !== 0 || corner.y !== 0 || !previousCorner) {
    previousCorner = corner;
  }
});

const allLines = [...verticalLines, ...horizontalLines];

let sum = addNumbers(allLines.map((line) => line.getLength())) - allLines.length;

let prevNumInsideLine = 0;
for (let y = minY; y <= maxY; y++) {
  let numInsideLine = 0;
  const lines = getOrderedLinesCrossingY(y);
  while (lines.length) {
    const upLine = getLeadingUpLines(lines).pop();
    if (!upLine) {
      break;
    }
    const downLine = lines.shift();
    if (y === upLine.corners[1].y && isHorizontalLine(upLine.corners[1], downLine.corners[0]) || y === upLine.corners[0].y && isHorizontalLine(upLine.corners[0], downLine.corners[1])) {
      continue;
    }
    const numInside = downLine.corners[0].x - upLine.corners[0].x - 1;
    numInsideLine += numInside;
  }

  sum += numInsideLine;
  if (prevNumInsideLine !== numInsideLine) {
    say(y, numInsideLine);
  }
  prevNumInsideLine = numInsideLine;
}

say(sum);

function getOrderedLinesCrossingY(y: number): Line[] {
  return verticalLines
  .filter((line) => {
    const corner0y = line.corners[0].y;
    const corner1y = line.corners[1].y;
    return corner0y <= y && corner1y >= y || corner1y <= y && corner0y >= y;
  })
  .sort((a, b) => a.corners[0].x - b.corners[0].x);
}

function getDirection(directionStr: string): Direction {
  switch (directionStr) {
    case 'U': return Direction.up;
    case 'D': return Direction.down;
    case 'L': return Direction.left;
    case 'R': return Direction.right;
  }
}

function getLeadingUpLines(lines: Line[]): Line[] {
  removeLeadingDownLines(lines);
  let upLines: Line[] = [];
  while (lines.length && lines[0].direction === Direction.up) {
    upLines.push(lines.shift());
  }
  return upLines;
}

function removeLeadingDownLines(lines: Line[]): void {
  while (lines.length && lines[0].direction === Direction.down) {
    lines.shift();
  }
}

function isHorizontalLine(corner1: Corner, corner2: Corner): boolean {
  for (const line of horizontalLines) {
    if (line.corners[0].y === corner1.y && line.corners[0].x === corner1.x && line.corners[1].y === corner2.y && line.corners[1].x === corner2.x) {
      return true;
    }
    if (line.corners[1].y === corner1.y && line.corners[1].x === corner1.x && line.corners[0].y === corner2.y && line.corners[0].x === corner2.x) {
      return true;
    }
  }
  return false;
}
