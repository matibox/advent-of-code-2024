export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split(''));
}

type Direction = 'top' | 'bottom' | 'left' | 'right';
type Position = { row: number; col: number };
type Move = { pos: Position; dir: Direction };

function getStartingPos(input: ReturnType<typeof parse>): Position {
  const row = input.findIndex(line => line.join('').includes('^'));
  const col = input[row]!.indexOf('^');

  return { row, col };
}

function getNextChar(
  input: ReturnType<typeof parse>,
  pos: Position,
  dir: Direction
) {
  switch (dir) {
    case 'top':
      return pos.row === 0 ? null : input[pos.row - 1]![pos.col];
    case 'right':
      return pos.col === input[0]!.length - 1
        ? null
        : input[pos.row]![pos.col + 1]!;
    case 'bottom':
      return pos.row === input.length - 1
        ? null
        : input[pos.row + 1]![pos.col]!;
    case 'left':
      return pos.col === 0 ? null : input[pos.row]![pos.col - 1]!;
  }
}

function move(pos: Position, dir: Direction): Position {
  switch (dir) {
    case 'top':
      return { row: pos.row - 1, col: pos.col };
    case 'right':
      return { row: pos.row, col: pos.col + 1 };
    case 'bottom':
      return { row: pos.row + 1, col: pos.col };
    case 'left':
      return { row: pos.row, col: pos.col - 1 };
  }
}

function rotate(dir: Direction): Direction {
  switch (dir) {
    case 'top':
      return 'right';
    case 'right':
      return 'bottom';
    case 'bottom':
      return 'left';
    case 'left':
      return 'top';
  }
}

export function partOne(input: ReturnType<typeof parse>) {
  let currentPos = getStartingPos(input);
  let currentDir: Direction = 'top';
  const moves: Position[] = [currentPos];

  while (true) {
    const nextCh = getNextChar(input, currentPos, currentDir);
    if (!nextCh) break;

    if (nextCh === '#') {
      currentDir = rotate(currentDir);
      continue;
    }

    const newPos = move(currentPos, currentDir);
    moves.push(newPos);
    currentPos = newPos;
  }

  const distinctReachedPositions: Position[] = [
    ...new Set(moves.map(pos => JSON.stringify(pos))),
  ].map(pos => JSON.parse(pos) as Position);

  return distinctReachedPositions.length;
}

function getObstaclePos(loopPos: Position, loopDir: Direction): Position {
  switch (loopDir) {
    case 'top':
      return { row: loopPos.row + 1, col: loopPos.col - 1 };
    case 'bottom':
      return { row: loopPos.row - 1, col: loopPos.col + 1 };
    case 'left':
      return { row: loopPos.row + 1, col: loopPos.col + 1 };
    case 'right':
      return { row: loopPos.row - 1, col: loopPos.col - 1 };
  }
}

function traverse(input: ReturnType<typeof parse>) {
  let currentPos = getStartingPos(input);
  let currentDir: Direction = 'top';
  const moves: Set<string> = new Set();

  while (true) {
    const nextCh = getNextChar(input, currentPos, currentDir);
    if (!nextCh) break;

    if (nextCh === '#') {
      currentDir = rotate(currentDir);
      continue;
    }

    const newPos = move(currentPos, currentDir);

    if (moves.has(JSON.stringify({ pos: newPos, dir: currentDir }))) {
      return 1;
    }

    moves.add(JSON.stringify({ pos: newPos, dir: currentDir }));
    currentPos = newPos;
  }

  return 0;
}

// Very inefficient but works
export function partTwo(input: ReturnType<typeof parse>) {
  let obstacles = 0;

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i]!.length; j++) {
      if (input[i]![j]! !== '.') continue;

      const newInput = input.map((line, i1) =>
        i1 === i ? line.map((ch, j2) => (j2 === j ? '#' : ch)) : line
      );

      obstacles += traverse(newInput);
    }
  }

  return obstacles;
}
