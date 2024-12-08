export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split(''));
}

type Position = { x: number; y: number };

function findAntennas(
  input: ReturnType<typeof parse>,
  frequency: string
): Position[] {
  const positions: Position[] = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i]!.length; j++) {
      const ch = input[i]![j!];
      if (ch === frequency) positions.push({ x: j, y: i });
    }
  }

  return positions;
}

function calculateVector(from: Position, to: Position): Position {
  return {
    x: to.x - from.x,
    y: to.y - from.y,
  };
}

function translateByVector(from: Position, vector: Position): Position {
  return {
    x: from.x + vector.x,
    y: from.y + vector.y,
  };
}

function multiplyVector(vector: Position, by: number): Position {
  return {
    x: vector.x * by,
    y: vector.y * by,
  };
}

function getPosKey(pos: Position): `${number},${number}` {
  return `${pos.x},${pos.y}`;
}

function generateAntinodes(
  mapSize: Position,
  antennas: Position[],
  isPart1: boolean
) {
  const antinodes = new Set<string>();

  const isOutOfBounds = (pos: Position) => {
    return pos.x < 0 || pos.x > mapSize.x || pos.y < 0 || pos.y > mapSize.y;
  };

  function getAntinodesInLine(
    pos: Position,
    vector: Position,
    antinodes: Position[] = []
  ) {
    const next = translateByVector(pos, vector);
    if (isOutOfBounds(next)) return antinodes;
    return getAntinodesInLine(next, vector, [...antinodes, next]);
  }

  for (let i = 0; i < antennas.length; i++) {
    const antenna = antennas[i]!;
    const targetAntennas = antennas.filter((_, idx) => idx !== i);
    const vectors: Position[] = [];

    for (const targetAntenna of targetAntennas) {
      vectors.push(calculateVector(antenna, targetAntenna));
    }

    for (const vector of vectors) {
      if (isPart1) {
        // part 1
        const antinodePosition = translateByVector(
          antenna,
          multiplyVector(vector, 2)
        );

        if (isOutOfBounds(antinodePosition)) continue;
        antinodes.add(getPosKey(antinodePosition));
      } else {
        // part 2

        const firstAntinode = translateByVector(
          antenna,
          multiplyVector(vector, 2)
        );
        if (isOutOfBounds(firstAntinode)) continue;

        const antinodesInLine = getAntinodesInLine(firstAntinode, vector, [
          firstAntinode,
        ]);

        for (const key of antinodesInLine.map(getPosKey)) antinodes.add(key);
      }
    }
  }

  return antinodes;
}

export function partOne(input: ReturnType<typeof parse>) {
  const antinodes = new Set<string>();
  const checkedFrequencies = new Set<string>();

  const mapSize: Position = { x: input[0]!.length - 1, y: input.length - 1 };

  input.forEach(line => {
    line.forEach(ch => {
      if (ch === '.') return;
      if (checkedFrequencies.has(ch)) return;

      const antennas = findAntennas(input, ch);
      const frequencyAntinodes = generateAntinodes(mapSize, antennas, true);
      frequencyAntinodes.forEach(antinode => {
        antinodes.add(antinode);
      });

      checkedFrequencies.add(ch);
    });
  });

  // console.log(input.map(line => line.join('')).join('\n'), '\n\n');

  // antinodes.forEach(antinode => {
  //   const [x, y] = antinode.split(',').map(Number) as [number, number];
  //   input[y]![x]! = '#';
  // });

  // console.log(input.map(line => line.join('')).join('\n'));

  return antinodes.size;
}

export function partTwo(input: ReturnType<typeof parse>) {
  const antinodes = new Set<string>();
  const checkedFrequencies = new Set<string>();

  const mapSize: Position = { x: input[0]!.length - 1, y: input.length - 1 };

  input.forEach(line => {
    line.forEach(ch => {
      if (ch === '.') return;
      if (checkedFrequencies.has(ch)) return;

      const antennas = findAntennas(input, ch);
      const frequencyAntinodes = generateAntinodes(mapSize, antennas, false);
      frequencyAntinodes.forEach(antinode => {
        antinodes.add(antinode);
      });

      checkedFrequencies.add(ch);
    });
  });

  // console.log(input.map(line => line.join('')).join('\n'), '\n\n');

  // antinodes.forEach(antinode => {
  //   const [x, y] = antinode.split(',').map(Number) as [number, number];
  //   input[y]![x]! = '#';
  // });

  // console.log(input.map(line => line.join('')).join('\n'));

  const antennasLeft = input
    .map(line => line.filter(ch => ch !== '.' && ch !== '#').length)
    .reduce((a, b) => a + b);

  return antinodes.size + antennasLeft;
}
