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
  cache: { [key: string]: number } = {};

  getNumArrangements(arrangement: string, numGroupsToMatch: number[]): number {
    this.currentArrangement = arrangement;
    if (this.isInvalidArrangement([...numGroupsToMatch])) {
      return 0;
    }
    if (!this.nextSpring) { // Got to the end
      return this.isValidArrangement([...numGroupsToMatch]) ? 1 : 0;
    }

    if (this.isUknownCondition) {
      const cacheKey = this.getCacheKey(arrangement);
      if (this.cache[cacheKey] !== undefined) {
        return this.cache[cacheKey];
      }

      this.isDamaged = true;
      let count = this.nextSpring.getNumArrangements(this.currentArrangement + '#', numGroupsToMatch);
      this.isDamaged = false;
      count += this.nextSpring.getNumArrangements(this.currentArrangement + '.', numGroupsToMatch);
      this.cache[cacheKey] = count;
      return count;
    }
    return this.nextSpring.getNumArrangements(this.currentArrangement + this.toString(), numGroupsToMatch);
  }

  isInvalidArrangement(numGroupsToMatch: number[]): boolean {
    const numGroups = Array.from(this.currentArrangement.match(/#+/g) || []).map((p) => p.length);
    if (!numGroups.length) {
      return false;
    }
    if (numGroups[numGroups.length - 1] > numGroupsToMatch[numGroups.length - 1]) {
      return true;
    }
    numGroups.pop();
    numGroupsToMatch.pop();
    return !numGroupsToMatch.join(',').startsWith(numGroups.join(','));
  }

  isValidArrangement(numGroupsToMatch: number[]): boolean {
    const arrangement = this.currentArrangement + this.toString();
    const numGroups = Array.from(arrangement.match(/#+/g) || []).map((p) => p.length);
    return numGroups.length ? numGroupsToMatch.join(',') === numGroups.join(',') : false;
  }

  getCacheKey(arrangement: string): string {
    const numDamagedJustBefore = arrangement.length - arrangement.replace(/#+$/, '').length;
    return [
      arrangement.split('').filter((c) => c === '#').length.toString(),
      numDamagedJustBefore.toString()
    ].join('-');
  }

  toString(): string {
    return this.isUknownCondition ? '?' : this.isDamaged ? '#' : '.';
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
  say(hotSprings.toString(), numGroups.join(','));
  const count = hotSprings.getNumArrangements(numGroups);
  sum += count;
  say(count);
});

say(sum);

console.timeLog();
