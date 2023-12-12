import { readLinesSplit, say } from '../../utils';

console.time();

class HotSprings {
  firstSpring: Spring;

  getNumArrangements(numGroupsToMatch: number[]): number {
    return this.firstSpring.getNumArrangements('', numGroupsToMatch);
  }

  toString(): string {
    let str = '';
    let currentSpring = this.firstSpring;
    do {
      str += currentSpring.toString();
      currentSpring = currentSpring.nextSpring;
    } while (currentSpring);
    return str;
  }
}

class Spring {
  isUknownCondition: boolean = false;
  isDamaged: boolean | 'maybe';
  nextSpring?: Spring;
  currentArrangement: string = '';

  getNumArrangements(arrangement: string, numGroupsToMatch: number[]): number {
    this.currentArrangement = arrangement;
    if (this.isInvalidArrangement([...numGroupsToMatch])) {
      return 0;
    }
    if (!this.nextSpring) {
      // Got to the end
      // say(arrangement + this.toString());
      if (this.isValidArrangement([...numGroupsToMatch])) {
        // say(arrangement + this.toString(), true);
        return 1;
      }
      return 0;
    }

    const originalArrangement = this.currentArrangement;
    if (this.isUknownCondition) {
      this.isDamaged = true;
      let count = this.nextSpring.getNumArrangements(originalArrangement + '#', numGroupsToMatch);
      this.isDamaged = false;
      return count + this.nextSpring.getNumArrangements(originalArrangement + '.', numGroupsToMatch);
    }
    return this.nextSpring.getNumArrangements(originalArrangement + this.toString(), numGroupsToMatch);
  }

  isInvalidArrangement(numGroupsToMatch: number[]): boolean {
    const numGroups = Array.from(this.currentArrangement.match(/#+/g) || []).map((p) => p.length);
    if (!numGroups.length) {
      return false;
    }
    numGroups.pop();
    numGroupsToMatch.pop();
    return !numGroupsToMatch.join(',').startsWith(numGroups.join(','));
  }

  isValidArrangement(numGroupsToMatch: number[]): boolean {
    const arrangement = this.currentArrangement + this.toString();
    const numGroups = Array.from(arrangement.match(/#+/g) || []).map((p) => p.length);
    if (!numGroups.length) {
      return false;
    }
    return numGroupsToMatch.join(',') === numGroups.join(',');
  }

  toString(): string {
    return this.isDamaged ? '#' : '.';
  }
}

let sum = 0;

readLinesSplit('input.txt', ' ').forEach(([pattern, numGroupsStr], i) => {
  pattern = (pattern + '?').repeat(5);
  pattern = pattern.substring(0, pattern.length - 1);
  numGroupsStr = (numGroupsStr + ',').repeat(5);
  numGroupsStr = numGroupsStr.substring(0, numGroupsStr.length - 1);
  pattern += '.';
  const numGroups = numGroupsStr.split(',').map((numStr) => parseInt(numStr));
  say(pattern, numGroupsStr);

  const hotSprings = new HotSprings();
  let previousSpring: Spring;
  pattern.split('').forEach((springType) => {
    const spring = new Spring();
    switch (springType) {
      case '#': spring.isDamaged = true; break;
      case '?': spring.isDamaged = 'maybe'; spring.isUknownCondition = true; break;
      case '.': spring.isDamaged = false; break;
    }
    if (previousSpring) {
      previousSpring.nextSpring = spring;
    } else {
      hotSprings.firstSpring = spring;
    }
    previousSpring = spring;
  });
  // say(hotSprings.toString());
  const count = hotSprings.getNumArrangements(numGroups);
  sum += count;
  say(i, count, sum);
});

say(sum);

console.timeLog();
