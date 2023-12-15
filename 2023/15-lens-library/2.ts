import { readLinesSplit, say } from '../../utils';

class Box {
  lenses: Lens[] = [];

  removeLens(label: string) {
    this.lenses = this.lenses.filter((lens) => lens.label !== label);
  }

  replaceOrAddLens(label: string, focalLength: number): void {
    const lens = this.lenses.find((lens) => lens.label === label);
    if (lens) {
      lens.focalLength = focalLength;
    } else {
      this.addLens(label, focalLength);
    }
  }

  addLens(label: string, focalLength: number): void {
    const lens = new Lens();
    lens.label = label;
    lens.focalLength = focalLength;
    this.lenses.push(lens);
  }

  toString(): string {
    let str = '';
    this.lenses.forEach((lens) => {
      str += lens.toString() + ' ';
    })
    return str;
  }
}

class Lens {
  label: string;
  focalLength: number;

  toString(): string {
    return `[${this.label} ${this.focalLength}]`;
  }
}

const boxes: { [boxNumber: number]: Box } = {};

readLinesSplit('input.txt', ',').forEach((instructions: string[]) => {
  instructions.forEach((instruction) => {
    let label = '';
    let focalLengthStr = '';
    if (instruction.includes('=')) {
      [label, focalLengthStr] = instruction.split('=');
      const focalLength = parseInt(focalLengthStr);
      const box = boxes[getHashValue(label)] ?? new Box();
      box.replaceOrAddLens(label, focalLength);
      boxes[getHashValue(label)] = box;
    } else if (instruction.endsWith('-')) {
      label = instruction.split('-')[0];
      const box = boxes[getHashValue(label)];
      box?.removeLens(label);
    }
  })
});

Object.keys(boxes).forEach((boxNumber) => {
  say(boxNumber, boxes[boxNumber].toString());
})
say(getFocusingPower());

function getHashValue(word: string): number {
  let value = 0;
  word.split('').forEach((char) => {
    value += char.charCodeAt(0);
    value *= 17;
    value %= 256;
  });

  return value;
}

function getFocusingPower(): number {
  let focusingPower = 0;
  Object.entries(boxes).forEach(([boxNumber, box]) => {
    box.lenses.forEach((lens, i) => {
      focusingPower += (parseInt(boxNumber) + 1) * (i + 1) * lens.focalLength;
    })
  })
  return focusingPower;
}
