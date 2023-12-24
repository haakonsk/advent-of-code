import { readLinesSplit, say } from '../../utils';

class Line {
  constructor(id: number, px: number, py: number, vx: number, vy: number) {
    this.id = id;
    this.px = px;
    this.py = py;
    this.vx = vx;
    this.vy = vy;
    this.slope = vy / vx;
  }

  id: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  slope: number;

  getY(x: number): number {
    return this.slope * (x - this.px) + this.py;
  }

  intersectsInsideTestAreaInTheFutureWith(otherLine: Line): boolean {
    if (this.id === otherLine.id) {
      return false;
    }

    const xIntersect = ((this.slope * this.px) - (otherLine.slope * otherLine.px) + otherLine.py - this.py) / (this.slope - otherLine.slope);
    const yIntersect = this.getY(xIntersect);
    const t1 = (xIntersect - this.px) / this.vx;
    const t2 = (xIntersect - otherLine.px) / otherLine.vx;
    if (t1 < 0 || t2 < 0) {
      return false;
    }
    return xIntersect >= testAreaMin && xIntersect <= testAreaMax && yIntersect >= testAreaMin && yIntersect <= testAreaMax;
  }
}

let sum = 0;

const testAreaMin = 200000000000000;
const testAreaMax = 400000000000000;

const lines: Line[] = [];

readLinesSplit('input.txt', ' @ ').forEach(([positionsStr, velocitiesStr]: [string, string], i) => {
  const [px, py, ] = positionsStr.split(', ').map((posStr) => parseInt(posStr));
  const [vx, vy, ] = velocitiesStr.split(', ').map((posStr) => parseInt(posStr));
  lines.push(new Line(i, px, py, vx, vy));
});

lines.forEach((line1) => {
  lines.forEach((line2) => {
    if (line1.intersectsInsideTestAreaInTheFutureWith(line2)) {
      sum++;
    }
  });
});

say(sum / 2);
