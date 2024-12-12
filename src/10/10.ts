export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split('').map(Number));
}

type Position = { x: number; y: number };
type Direction = 'top' | 'right' | 'bottom' | 'left';
type Move = { dir: Direction; num: number; newPos: Position };

const directions: Direction[] = ['top', 'left', 'bottom', 'right'] as const;

function getTrailheads(input: ReturnType<typeof parse>): Position[] {
  const trailheads: Position[] = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i]!.length; j++) {
      if (input[i]![j!] === 0) trailheads.push({ x: j, y: i });
    }
  }

  return trailheads;
}

const dirMap: Record<Direction, Position> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

function getPossibleMoves(
  input: ReturnType<typeof parse>,
  pos: Position,
  currNum: number
): Array<Move> {
  const data: Array<{ dir: Direction; num: number | null }> = [];

  for (const dir of directions) {
    const moveBy = dirMap[dir];
    data.push({
      dir,
      num: input[pos.y + moveBy.y]?.[pos.x + moveBy.x] ?? null,
    });
  }

  const possibleDirections = data.filter(el => el.num) as Array<{
    dir: Direction;
    num: number;
  }>;

  const possibleMoves = possibleDirections.filter(el => el.num === currNum + 1);

  return possibleMoves.map(move => ({
    ...move,
    newPos: {
      x: pos.x + dirMap[move.dir].x,
      y: pos.y + dirMap[move.dir].y,
    },
  }));
}

function posToKey(pos: Position) {
  return `${pos.x},${pos.y}`;
}

function traverse(
  partTwo: boolean,
  input: ReturnType<typeof parse>,
  curr: { pos: Position; num: number },
  score = 0,
  queue: Array<{
    newPos: Position;
    dir: Direction;
    num: number;
  }> = [],
  endsPos = new Set<string>()
) {
  const moves = getPossibleMoves(input, curr.pos, curr.num);

  // console.log(
  //   'state: ',
  //   curr,
  //   '\n moves: ',
  //   moves,
  //   '\n queue: ',
  //   queue,
  //   '\n score: ',
  //   score,
  //   '\n\n'
  // );

  if (moves.length === 0 && queue.length === 0) return score;

  if (moves.length > 1) {
    queue.push(...moves.slice(1));
  }

  const move = moves[0];
  if (!move) {
    const queueMove = queue[0]!;

    if (queueMove.num === 9 && !endsPos.has(posToKey(queueMove.newPos))) {
      return traverse(
        partTwo,
        input,
        {
          pos: queueMove.newPos,
          num: queueMove.num,
        },
        score + 1,
        queue.slice(1),
        !partTwo ? endsPos.add(posToKey(queueMove.newPos)) : endsPos
      );
    }

    return traverse(
      partTwo,
      input,
      {
        pos: queueMove.newPos,
        num: queueMove.num,
      },
      score,
      queue.slice(1),
      !partTwo ? endsPos.add(posToKey(queueMove.newPos)) : endsPos
    );
  }

  if (move.num === 9 && !endsPos.has(posToKey(move.newPos))) {
    return traverse(
      partTwo,
      input,
      { pos: move.newPos, num: move.num },
      score + 1,
      queue,
      !partTwo ? endsPos.add(posToKey(move.newPos)) : endsPos
    );
  }

  return traverse(
    partTwo,
    input,
    { pos: move.newPos, num: move.num },
    score,
    queue,
    endsPos
  );
}

export function partOne(input: ReturnType<typeof parse>) {
  const trailheads = getTrailheads(input);
  const totalScore = trailheads
    .map(trailhead => {
      return traverse(false, input, { pos: trailhead, num: 0 });
    })
    .reduce((a, b) => a + b);
  return totalScore;
}

export function partTwo(input: ReturnType<typeof parse>) {
  const trailheads = getTrailheads(input);

  const totalScore = trailheads
    .map(trailhead => {
      return traverse(true, input, { pos: trailhead, num: 0 });
    })
    .reduce((a, b) => a + b);

  return totalScore;
}
