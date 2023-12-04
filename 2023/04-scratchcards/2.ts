import { readLines, say } from '../../utils';

let sum = 0;
// const numCards: number[] = [];
const cards: Card[] = [];

interface Card {
  id: number;
  yourNumbers: string;
  winningNumbers: string;
  numCopies: number;
}

let cardNum = 0;
readLines('input.txt').forEach((line: string) => {
  const [yourNumbersString, winningNumbersString]
    = line.replace(/Card\s+\d:\s*/, '').split(/\s*\|\s*/);
  cards.push({ id: cardNum++, yourNumbers: yourNumbersString, winningNumbers: winningNumbersString, numCopies: 1 } as Card);
});
say(cards);

cards.forEach((card) => {
  say(card.id);
  const yourNumbers = card.yourNumbers.split(/\s+/);
  const winningNumbers = card.winningNumbers.split(/\s+/);
  let i = 0;
  yourNumbers.forEach((num) => {
    if (winningNumbers.includes(num)) {
      cards[card.id + i + 1].numCopies += card.numCopies;
      i++;
    }
  });
});

say(cards);

cards.forEach((card) => {
  sum += card.numCopies;
});

say(sum);
