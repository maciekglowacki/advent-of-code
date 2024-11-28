import run from "aocrunner";

const parseInput = (rawInput: string) => {
  // Helper to parse a single section
  const parseSection = (section: string) => {
    return section
      .trim()
      .split("\n")
      .slice(1) // Skip the first line (header like "seed-to-soil map")
      .map((line) => line.trim().split(/\s+/).map(Number));
  };

  const sections = rawInput.split(/\n\n/);
  // Extract and parse each part
  const seeds = sections[0].split("\n")[0].replace("seeds:", "").trim().split(/\s+/).map(Number);

  const seedToSoilMap = parseSection(sections[1]);
  const soilToFertilizerMap = parseSection(sections[2]);
  const fertilizerToWaterMap = parseSection(sections[3]);
  const waterToLightMap = parseSection(sections[4]);
  const lightToTemperatureMap = parseSection(sections[5]);
  const temperatureToHumidityMap = parseSection(sections[6]);
  const humidityToLocationMap = parseSection(sections[7]);

  // Return as an organized object
  return {
    seeds,
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  };
};

const part1 = (rawInput: string) => {
  const {
    seeds,
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  } = parseInput(rawInput);

  const getMapping = (value: number, map: number[][]) => {
    for (const [destinationRangeStart, sourceRangeStart, range] of map) {
      const sourceRangeEnd = sourceRangeStart + range - 1;
      // Check if the value falls in the source range
      if (value >= sourceRangeStart && value <= sourceRangeEnd) {
        const difference = value - sourceRangeStart;
        return destinationRangeStart + difference;
      }
    }
    return value;
  };

  const mapSeedToLocation = (value: number) => {
    const maps = [
      seedToSoilMap,
      soilToFertilizerMap,
      fertilizerToWaterMap,
      waterToLightMap,
      lightToTemperatureMap,
      temperatureToHumidityMap,
      humidityToLocationMap,
    ];

    return maps.reduce((mappedValue, currentMap) => {
      mappedValue = getMapping(mappedValue, currentMap);
      return mappedValue;
    }, value);
  };

  const lowestLocation = seeds.reduce((lowestLocation, seed) => {
    const seedToLocationMapping = mapSeedToLocation(seed);
    return Math.min(lowestLocation, seedToLocationMapping);
  }, Infinity);

  return lowestLocation;
};

const part2 = (rawInput: string) => {
  const {
    seeds,
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  } = parseInput(rawInput);

  const getMapping = (value: number, map: number[][]) => {
    for (const [destinationRangeStart, sourceRangeStart, range] of map) {
      const sourceRangeEnd = sourceRangeStart + range - 1;
      // Check if the value falls in the source range
      if (value >= sourceRangeStart && value <= sourceRangeEnd) {
        const difference = value - sourceRangeStart;
        return destinationRangeStart + difference;
      }
    }
    return value;
  };

  const getSeedsRange = (seeds: number[]): Generator<number> => {
    function* range(start: number, length: number) {
      for (let i = 0; i < length; i++) {
        yield start + i;
      }
    }

    function* seedsRange() {
      for (let i = 0; i < seeds.length; i += 2) {
        yield* range(seeds[i], seeds[i + 1]);
      }
    }

    return seedsRange();
  };

  const mapSeedToLocation = (value: number) => {
    let mappedValue = value;
    for (const map of [
      seedToSoilMap,
      soilToFertilizerMap,
      fertilizerToWaterMap,
      waterToLightMap,
      lightToTemperatureMap,
      temperatureToHumidityMap,
      humidityToLocationMap,
    ]) {
      mappedValue = getMapping(mappedValue, map);
    }
    return mappedValue;
  };

  const seedsRange = getSeedsRange(seeds);

  let lowestLocation = Infinity;
  for (const seed of seedsRange) {
    const seedToLocationMapping = mapSeedToLocation(seed);
    if (seedToLocationMapping < lowestLocation) {
      lowestLocation = seedToLocationMapping;
    }
  }

  return lowestLocation;
};

run({
  part1: {
    tests: [
      {
        input: `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
