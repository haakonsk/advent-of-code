import { readLinesSplit, say } from '../../utils';

let sum = 0;

const hands: Hand[] = [];

interface Hand {
  cards: number[];
  bid: number;
}

enum HandType {
  HighCard,
  Pair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind
}

readLinesSplit('input.txt').forEach(([hand, bid]) => {
  hands.push({
    cards: hand.split('').map((card: string) => {
        switch (card) {
          case 'A': return 14;
          case 'K': return 13;
          case 'Q': return 12;
          case 'J': return 11;
          case 'T': return 10;
          default: return parseInt(card);
        }
    }),
    bid: parseInt(bid),
  });
});

hands.sort((a: Hand, b: Hand) => {
  return getHandType(a) - getHandType(b) || getHandValue(a) - getHandValue(b);
})

hands.forEach((hand, i) => {
  sum += (i + 1) * hand.bid;
})

say(sum);

function getHandType(hand: Hand): HandType {
  const valueCounts: {[value: number]: number} = {};
  hand.cards.forEach((card) => {
    valueCounts[card] ? valueCounts[card]++ : valueCounts[card] = 1;
  });
  const numCardValues = Object.keys(valueCounts).length;
  if (numCardValues === 1) {
    return HandType.FiveOfAKind;
  }
  if (numCardValues === 5) {
    return HandType.HighCard;
  }
  const numOfAKinds = Object.values(valueCounts);
  const numOfAKind = numOfAKinds[0];
  if (numCardValues === 2 && [1, 4].includes(numOfAKind)) {
    return HandType.FourOfAKind;
  }
  if (numCardValues === 2 && [3, 2].includes(numOfAKind)) {
    return HandType.FullHouse;
  }
  if (numOfAKinds.includes(3)) {
    return HandType.ThreeOfAKind;
  }
  if (numOfAKinds.includes(2) && numCardValues === 3) {
    return HandType.TwoPair;
  }
  return HandType.Pair;
}

function getHandValue(hand: Hand): number {
  const cards = hand.cards;
  return 1_00_00_00_00 * cards[0] + 1_00_00_00 * cards[1] + 1_00_00 * cards[2] + 100 * cards[3] + cards[4];
}
