import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const parseNumber1 = (input: string) => {
  const digits = input.match(/\d/g)!;
  const first = digits[0];
  const last = digits.at(-1);
  return Number(`${first}${last}`);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = input.reduce((acc, curr) => {
    const number = parseNumber1(curr);
    return acc + number;
  }, 0);
  return result;
};

const stringToNumberMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const;

const parseValue = (value: string) => {
  return (
    stringToNumberMap[value as keyof typeof stringToNumberMap] || Number(value)
  );
};

const parseNumber2 = (input: string) => {
  const digits = [
    ...input.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g),
  ].map(([_, matchedVal]) => parseValue(matchedVal));
  const first = digits[0];
  const last = digits.at(-1);
  return Number(`${first}${last}`);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = input.reduce((acc, curr) => {
    const number = parseNumber2(curr);
    return acc + number;
  }, 0);

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
