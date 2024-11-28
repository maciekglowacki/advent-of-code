import run from "aocrunner";
import { range } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split("\n");
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // Regular expressions as constants
  const AT_LEAST_ONE_DIGIT_REGEX = /\d+/g;
  const NOT_A_DOT_OR_DIGIT_REGEX = /[^.\d]/g;

  // Helper function to calculate the start and end indices for slicing
  const getSliceIndices = (matchIndex: number, matchLength: number, lineLength: number) => {
    const startIndex = Math.max(matchIndex - 1, 0);
    const endIndex = Math.min(matchIndex + matchLength, lineLength) + 1;
    return { startIndex, endIndex };
  };

  // Helper function to check if a range has symbol in a given line
  const hasSymbolInRange = (line: string | undefined, start: number, end: number) => {
    return line ? NOT_A_DOT_OR_DIGIT_REGEX.test(line.slice(start, end)) : false;
  };

  const getResult = () => {
    return input.reduce((acc, line, i) => {
      const digitsMatches = line.matchAll(AT_LEAST_ONE_DIGIT_REGEX);
      for (const match of digitsMatches) {
        const matchedString = match[0];
        const { startIndex, endIndex } = getSliceIndices(match.index, matchedString.length, line.length);
        const hasSymbolPrevLine = hasSymbolInRange(input[i - 1], startIndex, endIndex);
        const hasSymbolCurrLine = hasSymbolInRange(input[i], startIndex, endIndex);
        const hasSymbolNextLine = hasSymbolInRange(input[i + 1], startIndex, endIndex);
        if (hasSymbolPrevLine || hasSymbolCurrLine || hasSymbolNextLine) {
          acc += Number(matchedString);
        }
      }
      return acc;
    }, 0);
  };
  const result = getResult();
  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const AT_LEAST_ONE_DIGIT_REGEX = /\d+/g;
  const ASTERISK_REGEX = /\*/g;

  // Helper function to calculate the start and end indices for slicing
  const getSliceIndicesPart2 = (matchIndex: number, matchLength: number, lineLength: number) => {
    const startIndex = Math.max(matchIndex - 1, 0);
    const endIndex = Math.min(matchIndex + matchLength, lineLength);
    return { startIndex, endIndex };
  };

  const getMatchingNumbersByLine = (line: string, startIndex: number, endIndex: number) => {
    const results = [];
    const matches = line.matchAll(AT_LEAST_ONE_DIGIT_REGEX);
    const starMatchingIndexes = range(startIndex, endIndex);
    for (const match of matches) {
      const matchedString = match[0];
      const matchStartIndex = match.index;
      const matchEndIndex = match.index + matchedString.length - 1;
      const matchIndexes = range(matchStartIndex, matchEndIndex);

      // Check if any of the match indexes overlap with the star matching indexes
      const isIndexOverlap = matchIndexes.some((index) => starMatchingIndexes.includes(index));
      if (isIndexOverlap) {
        results.push(Number(matchedString));
      }
    }
    return results;
  };

  const getMatchingNumbers = (lineIndex: number, startIndex: number, endIndex: number) => {
    const results: Array<number> = [];
    const prevLine = lineIndex > 0 ? input[lineIndex - 1] : "";
    const currLine = input[lineIndex];
    const nextLine = lineIndex < input.length - 1 ? input[lineIndex + 1] : "";

    // Collect results from all three lines
    results.push(...getMatchingNumbersByLine(prevLine, startIndex, endIndex));
    results.push(...getMatchingNumbersByLine(currLine, startIndex, endIndex));
    results.push(...getMatchingNumbersByLine(nextLine, startIndex, endIndex));
    return results;
  };

  const result = input.reduce((acc, curr, index) => {
    const matches = curr.matchAll(ASTERISK_REGEX);
    for (const match of matches) {
      const { startIndex, endIndex } = getSliceIndicesPart2(match.index, match[0].length, curr.length);

      const matchingNumbers = getMatchingNumbers(index, startIndex, endIndex);
      if (matchingNumbers.length === 2) {
        acc += matchingNumbers[0] * matchingNumbers[1];
      }
    }
    return acc;
  }, 0);

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
