import { fillGrid, printGrid, readLinesSplit, say } from '../../utils';

class Point {
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  x: number;
  y: number;
  z: number;

  toString(): string {
    return `x=${this.x},y=${this.y},z=${this.z}`;
  }
}

class Brick {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }

  startPoint: Point;
  endPoint: Point;

  getHeight(): number {
    return this.endPoint.z - this.startPoint.z + 1;
  }

  toString(): string {
    const x = `x=${this.startPoint.x}` + (this.startPoint.x === this.endPoint.x ? '' : `-${this.endPoint.x}`);
    const y = `y=${this.startPoint.y}` + (this.startPoint.y === this.endPoint.y ? '' : `-${this.endPoint.y}`);
    const z = `z=${this.startPoint.z}` + (this.startPoint.z === this.endPoint.z ? '' : `-${this.endPoint.z}`);
    return `${x} ${y} ${z}`
  }
}

class Stack {
  bricks: Brick[] = [];
  zGrid = fillGrid(10, 10, 0);

  addBrick(brick: Brick): void {
    this.bricks.splice(this.getNumBricksWithLowerZ(brick.startPoint.z), 0, brick);
  }

  fall(returnEarly = false): boolean {
    let didFall = false;
    for (const brick of this.bricks) {
      let zValueOfsupportingBrick = 0;
      for (let x = brick.startPoint.x; x <= brick.endPoint.x; x++) {
        for (let y = brick.startPoint.y; y <= brick.endPoint.y; y++) {
          zValueOfsupportingBrick = Math.max(this.zGrid[y][x], zValueOfsupportingBrick);
        }
      }
      for (let x = brick.startPoint.x; x <= brick.endPoint.x; x++) {
        for (let y = brick.startPoint.y; y <= brick.endPoint.y; y++) {
          const height = brick.getHeight();
          const origBrickStr = brick.toString();
          if (brick.startPoint.z > this.zGrid[y][x] + 1) {
            brick.startPoint.z = zValueOfsupportingBrick + 1;
            brick.endPoint.z = zValueOfsupportingBrick + height;
            if (origBrickStr !== brick.toString()) {
              if (returnEarly) {
                return true;
              }
              didFall = true;
            }
          }
          this.zGrid[y][x] = zValueOfsupportingBrick + height;
        }
      }
    }
    return didFall;
  }

  toString(): string {
    return this.bricks.map((brick) => brick.toString()).join('\n');
  }

  private getNumBricksWithLowerZ(z: number): number {
    return this.bricks.filter((brick) => brick.startPoint.z < z).length;
  }
}

const stack: Stack = new Stack();

readLinesSplit('input.txt', '~').forEach(([point1Str, point2Str]: [string, string]) => {
  const [x1, y1, z1] = point1Str.split(',').map((s) => parseInt(s));
  const [x2, y2, z2] = point2Str.split(',').map((s) => parseInt(s));
  const startPoint = new Point(x1, y1, z1 > z2 ? z2 : z1);
  const endPoint = new Point(x2, y2, z1 > z2 ? z1 : z2);
  stack.addBrick(new Brick(startPoint, endPoint));
});

stack.fall();

let numBricksThatCanBeDisintegrated = 0;

for (let i = 0; i < stack.bricks.length; i++) {
  const newStack = copyStack();
  newStack.bricks.splice(i, 1);
  if (!newStack.fall(true)) {
    numBricksThatCanBeDisintegrated++;
  }
}
say(numBricksThatCanBeDisintegrated)

function copyStack(): Stack {
  const newStack = new Stack();
  newStack.bricks = copyBricks(stack.bricks);
  return newStack;
}

function copyBricks(bricks: Brick[]): Brick[] {
  const newBricks: Brick[] = [];
  bricks.forEach((brick) => {
    const newStartPoint = new Point(brick.startPoint.x, brick.startPoint.y, brick.startPoint.z);
    const newEndPoint = new Point(brick.endPoint.x, brick.endPoint.y, brick.endPoint.z);
    newBricks.push(new Brick(newStartPoint, newEndPoint));
  });
  return newBricks;
}
