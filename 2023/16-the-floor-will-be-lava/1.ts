import { printGrid, readLinesSplit, say } from '../../utils';

enum Direction {
  up,
  down,
  left,
  right,
}

class Tile {
  y: number;
  x: number;
  type: string;
  visitedDirections: Direction[] = [];
  isEnergized: boolean;

  getNextTile(direction: Direction): Tile | undefined {
    switch (direction) {
      case Direction.down: return grid[this.y+1] ? grid[this.y+1][this.x] : undefined;
      case Direction.right: return grid[this.y][this.x+1];
      case Direction.left: return grid[this.y][this.x-1];
      case Direction.up: return grid[this.y-1] ? grid[this.y-1][this.x] : undefined;
    }
  }

  enter(direction: Direction): void {
    if (this.visitedDirections.includes(direction)) {
      return;
    }
    if (!this.isEnergized) {
      sum++;
    }
    this.isEnergized = true;
    this.visitedDirections.push(direction);

    switch (this.type) {
      case '.':
        this.getNextTile(direction)?.enter(direction);
        break;
      case '-':
        switch (direction) {
          case Direction.right:
          case Direction.left:
            this.getNextTile(direction)?.enter(direction);
            break;
          case Direction.down:
          case Direction.up:
            this.getNextTile(Direction.left)?.enter(Direction.left);
            this.getNextTile(Direction.right)?.enter(Direction.right);
            break;
        }
        break;
      case '|':
        switch (direction) {
          case Direction.right:
          case Direction.left:
            this.getNextTile(Direction.up)?.enter(Direction.up);
            this.getNextTile(Direction.down)?.enter(Direction.down);
            break;
          case Direction.down:
          case Direction.up:
            this.getNextTile(direction)?.enter(direction);
            break;
        }
        break;
      case '/':
        switch (direction) {
          case Direction.right:
            this.getNextTile(Direction.up)?.enter(Direction.up);
            break;
          case Direction.left:
            this.getNextTile(Direction.down)?.enter(Direction.down);
            break;
          case Direction.down:
            this.getNextTile(Direction.left)?.enter(Direction.left);
            break;
          case Direction.up:
            this.getNextTile(Direction.right)?.enter(Direction.right);
            break;
        }
        break;
      case '\\':
        switch (direction) {
          case Direction.right:
            this.getNextTile(Direction.down)?.enter(Direction.down);
            break;
          case Direction.left:
            this.getNextTile(Direction.up)?.enter(Direction.up);
            break;
          case Direction.down:
            this.getNextTile(Direction.right)?.enter(Direction.right);
            break;
          case Direction.up:
            this.getNextTile(Direction.left)?.enter(Direction.left);
            break;
        }
        break;
    }
  }

  toString(): string {
    if (this.type !== '.') {
      return this.type;
    }
    if (this.visitedDirections.length > 1) {
      return this.visitedDirections.length.toString();
    }
    if (this.visitedDirections.length === 0) {
      return '.';
    }
    say(this.visitedDirections[0]);
    switch (this.visitedDirections[0]) {
      case Direction.left: return '<';
      case Direction.right: return '>';
      case Direction.down: return 'v';
      case Direction.up: return '^';
    }
  }
}

let sum = 0;
const grid: Tile[][] = [];

readLinesSplit('input.txt', '').forEach((lineArray: string[], y) => {
  const tileArray: Tile[] = [];
  lineArray.forEach((char, x) => {
    const tile = new Tile();
    tile.type = char;
    tile.y = y;
    tile.x = x;
    tileArray.push(tile);
  })
  grid.push(tileArray);
});

grid[0][0].enter(Direction.right);

printGrid(grid);

say(sum);
