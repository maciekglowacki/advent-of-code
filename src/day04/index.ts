import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) =>
    line
      .split(":")[1]
      .split("|")
      .map((nums) => nums.trim().split(" ").filter(Boolean).map(Number)),
  );
const part1 = (rawInput: string) => {
  const getPoints = (numbersLength: number) => {
    if (numbersLength === 1) {
      return 1;
    }
    if (numbersLength > 1) {
      return Math.pow(2, numbersLength - 1);
    }
    return 0;
  };

  const input = parseInput(rawInput);
  const points = input.reduce((acc, curr) => {
    const [winningNumbers, selectedNumbers] = curr;
    const winningSelectedNumbers = selectedNumbers.filter((number) => winningNumbers.includes(number));
    const points = getPoints(winningSelectedNumbers.length);
    acc += points;
    return acc;
  }, 0);
  return points;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const distributeCopiesToNextCards = (copies: number, index: number, originalCardCopies: number) => {
    if (copies < 0) {
      return;
    }
    if (index >= winningCopiesPerCard.length) {
      return;
    }
    finalCopiesPerCard[index] = finalCopiesPerCard[index] + originalCardCopies;
    return distributeCopiesToNextCards(copies - 1, index + 1, originalCardCopies);
  };

  const winningCopiesPerCard: Array<number> = [];
  const finalCopiesPerCard = Array<number>(input.length).fill(1);

  // Calculate the number of winning selected numbers for each card
  for (const [index, card] of input.entries()) {
    const [winningNumbers, selectedNumbers] = card;
    const winningSelectedNumbers = selectedNumbers.filter((number) => winningNumbers.includes(number));
    const copies = winningSelectedNumbers.length;
    winningCopiesPerCard[index] = copies;
  }

  // Distribute copies to subsequent cards
  for (const [index, copies] of winningCopiesPerCard.entries()) {
    distributeCopiesToNextCards(copies - 1, index + 1, finalCopiesPerCard[index]);
  }
  const totalCopiesSum = finalCopiesPerCard.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  return totalCopiesSum;
};

run({
  part1: {
    tests: [
      {
        input: `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
                `,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
