export function parse(input: string) {
  return input.split('\n').map(line => line.split(''));
}

type Position = { x: number; y: number };
type Key = `${number},${number}`;

function posToKey(pos: Position): Key {
  return `${pos.x},${pos.y}`;
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
] as const;

export function partOne(input: ReturnType<typeof parse>) {
  const map: Record<`${string}:${Key}`, { perimeter: number; area: number }> =
    {};
  const visited = new Set<Key>();

  function calculate({ x, y }: Position, ch: string) {
    let area = 0;
    let perimeter = 0;
    const rows = input.length;
    const cols = input[0]!.length;
    const queue: Array<[number, number]> = [[x, y]];
    visited.add(posToKey({ x, y }));

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;

      if (input[cy]![cx]! === ch) area++;

      for (const [dx, dy] of directions) {
        const nx = cx + dx;
        const ny = cy + dy;

        if (
          nx < 0 ||
          ny < 0 ||
          nx >= rows ||
          ny >= cols ||
          input[ny]?.[nx] !== ch
        ) {
          // console.log('i:', x, y, 'c:', cx, cy, 'n:', nx, ny, input[ny]?.[nx]);
          perimeter++;
        } else if (
          !visited.has(posToKey({ x: nx, y: ny })) &&
          input[ny]?.[nx] === ch
        ) {
          visited.add(posToKey({ x: nx, y: ny }));
          queue.push([nx, ny]);
        }
      }

      // console.log('\n');
    }

    return { area, perimeter };
  }

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i]!.length; j++) {
      const ch = input[i]![j]!;
      const key = `${ch}:${posToKey({ x: j, y: i })}` as const;

      if (visited.has(posToKey({ x: j, y: i }))) continue;
      if (!map[key]) map[key] = { perimeter: 0, area: 0 };
      const { perimeter, area } = calculate({ x: j, y: i }, ch);
      map[key].area += area;
      map[key].perimeter += perimeter;
    }
  }

  // console.log(map);

  const totalPrice = Object.values(map)
    .map(region => {
      return region.area * region.perimeter;
    })
    .reduce((a, b) => a + b);

  return totalPrice;
}

export function partTwo(input: ReturnType<typeof parse>) {}
