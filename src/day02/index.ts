import run from "aocrunner";

const parseReveal = (revealString: string) => {
  const regex = /(\d+)\s(\w+)/;
  return revealString.split(";").map((group) => {
    return group.split(",").reduce((acc, el) => {
      const match = el.match(regex);
      if (match) {
        const num = Number(match[1]);
        const color = match[2];
        acc[color] = num;
      }
      return acc;
    }, {} as Record<string, number>);
  });
};

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => {
    const [_, part2] = line.split(":");
    const revealed = parseReveal(part2.trim());
    return revealed;
  });
};

const RED_CUBES = 12;
const GREEN_CUBES = 13;
const BLUE_CUBES = 14;

const checkIsRevealPossible = (red: number, green: number, blue: number) => {
  return red <= RED_CUBES && green <= GREEN_CUBES && blue <= BLUE_CUBES;
};

const checkIsGameValid = (game: Array<Record<string, number>>) => {
  return game.every(({ red = 0, green = 0, blue = 0 }) =>
    checkIsRevealPossible(red, green, blue),
  );
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = input.reduce((acc, curr, index) => {
    const isGameValid = checkIsGameValid(curr);
    if (isGameValid) {
      return acc + index + 1;
    }
    return acc;
  }, 0);
  return result;
};

const getMaxValuesForColors = (game: Array<Record<string, number>>) => {
  return game.reduce(
    (acc, { red = 0, green = 0, blue = 0 }) => {
      acc.red = Math.max(acc.red, red);
      acc.green = Math.max(acc.green, green);
      acc.blue = Math.max(acc.blue, blue);
      return acc;
    },
    { red: 0, green: 0, blue: 0 } as Record<string, number>,
  );
};

const getMinimalValidGamePower = (game: Array<Record<string, number>>) => {
  const { red, green, blue } = getMaxValuesForColors(game);
  return red * green * blue;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = input.reduce((acc, curr) => {
    const power = getMinimalValidGamePower(curr);
    return acc + power;
  }, 0);
  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
