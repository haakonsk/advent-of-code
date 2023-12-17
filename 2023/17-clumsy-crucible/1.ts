import { readLinesSplit, say } from '../../utils';

enum Direction {
  down,
  right,
  up,
  left,
}

let minimumTotaltHeatLoss = Infinity;

class CityBlock {
  y: number;
  x: number;
  heatLoss: number;
  minimumTotalHeatLoss: { [key: string]: number } = {};

  enter(currentTotalHeatLoss: number, direction: Direction, numStepsInDirection: number): void {
    const minHeatLoss = this.minimumTotalHeatLoss[this.getKey(direction, numStepsInDirection)];
    if (currentTotalHeatLoss + this.heatLoss >= minHeatLoss) {
      return;
    }
    if (currentTotalHeatLoss >= minimumTotaltHeatLoss) {
      return;
    }
    if (currentTotalHeatLoss + (grid.length - 1 - this.y) - (grid[0].length - 1 - this.x) > minimumTotaltHeatLoss) {
      return;
    }
    const newMinHeatLoss = currentTotalHeatLoss + this.heatLoss;
    this.minimumTotalHeatLoss[this.getKey(direction, numStepsInDirection)] = newMinHeatLoss;

    if (this.y === grid.length - 1 && this.x === grid[0].length - 1) {
      minimumTotaltHeatLoss = newMinHeatLoss;
      say(this.minimumTotalHeatLoss);
      return;
    }

    const rightDirection = this.turnRight(direction);
    const leftDirection = this.turnLeft(direction);
    const directions = [rightDirection, leftDirection];
    if (numStepsInDirection < 3) {
      directions.push(direction);
    }
    directions.sort((a, b) => a - b).forEach((direction) => {
      this.nextBlock(direction)?.enter(newMinHeatLoss, direction, [leftDirection, rightDirection].includes(direction) ? 1 : numStepsInDirection+1)
    })
  }

  nextBlock(direction: Direction): CityBlock | undefined {
    switch (direction) {
      case Direction.down: return grid[this.y+1] ? grid[this.y+1][this.x] : undefined;
      case Direction.up: return grid[this.y-1] ? grid[this.y-1][this.x] : undefined;
      case Direction.left: return grid[this.y][this.x-1];
      case Direction.right: return grid[this.y][this.x+1];
    }
  }

  turnLeft(direction: Direction): Direction {
    switch (direction) {
      case Direction.left: return Direction.down;
      case Direction.right: return Direction.up;
      case Direction.down: return Direction.right;
      case Direction.up: return Direction.left;
    }
  }

  turnRight(direction: Direction): Direction {
    switch (direction) {
      case Direction.left: return Direction.up;
      case Direction.right: return Direction.down;
      case Direction.down: return Direction.left;
      case Direction.up: return Direction.right;
    }
  }

  getKey(direction: Direction, numStepsInDirection: number): string {
    return `${direction} ${numStepsInDirection}`;
  }

  toString(): string {
    return this.heatLoss.toString();
  }
}

const grid: CityBlock[][] = [];

readLinesSplit('input.txt', '').forEach((lineArray: string[], y) => {
  grid.push(lineArray.map((s, x) => {
    const cityBlock = new CityBlock();
    cityBlock.y = y;
    cityBlock.x = x;
    cityBlock.heatLoss = parseInt(s);
    return cityBlock;
  }));
});

grid[0][1].enter(0, Direction.right, 1);
// grid[1][0].enter(0, Direction.down, 1);
