function transpose<T>(arr: T[][]) {
  if (arr.length === 0) return [];
  return arr[0]!.map((_, col) => arr.map(row => row[col]!));
}

function getDiagonals<T>(arr: T[][]) {
  if (arr.length === 0) return { first: [], second: [] };

  const rows = arr.length;
  const cols = arr[0]!.length;
  const first: T[][] = [];
  const second: T[][] = [];

  // first diagonal
  for (let i = 0; i < rows + cols - 1; i++) {
    const diagonal: T[] = [];
    for (let j = 0; j <= i; j++) {
      const k = i - j;
      if (j < rows && k < cols) {
        diagonal.push(arr[j]![k]!);
      }
    }
    if (diagonal.length > 0) first.push(diagonal);
  }

  // second diagonal
  for (let i = 0; i < rows + cols - 1; i++) {
    const diagonal: T[] = [];
    for (let j = 0; j <= i; j++) {
      const k = cols - 1 - (i - j);
      if (j < rows && k >= 0) {
        diagonal.push(arr[j]![k]!);
      }
    }
    if (diagonal.length > 0) second.push(diagonal);
  }

  return { first, second };
}

export function parse(input: string) {
  const normal = input
    .trim()
    .split('\n')
    .map(line => line.split(''));

  const vertical = transpose(normal);
  const { first, second } = getDiagonals(normal);

  return { normal, vertical, d1: first, d2: second };
}

function findOccurenciesQuantity(line: string[]) {
  const str = line.join('');
  const matches = str.matchAll(/XMAS/g);
  const backwardMatches = str.matchAll(/SAMX/g);

  return [...matches, ...backwardMatches].length;
}

export function partOne({
  normal,
  vertical,
  d1,
  d2,
}: ReturnType<typeof parse>) {
  return [...normal, ...vertical, ...d1, ...d2]
    .map(line => {
      return findOccurenciesQuantity(line);
    })
    .reduce((a, b) => a + b);
}

function getOppositeChar(ch: 'M' | 'S') {
  return ch === 'M' ? 'S' : 'M';
}

export function partTwo({ normal: input }: ReturnType<typeof parse>) {
  let occurencies = 0;

  for (let i = 0; i < input.length - 2; i++) {
    const row = input[i]!;

    for (let j = 0; j < row.length - 2; j++) {
      const topLeftCh = row[j]!;
      if (topLeftCh !== 'M' && topLeftCh !== 'S') continue;

      const topRightCh = row[j + 2];
      if (topRightCh !== 'M' && topRightCh !== 'S') continue;

      const middleCh = input[i + 1]![j + 1]!;
      if (middleCh !== 'A') continue;

      const botLeftCh = input[i + 2]![j]!;
      if (botLeftCh !== getOppositeChar(topRightCh)) continue;

      const botRightCh = input[i + 2]![j + 2]!;
      if (botRightCh !== getOppositeChar(topLeftCh)) continue;

      occurencies++;
    }
  }

  return occurencies;
}
