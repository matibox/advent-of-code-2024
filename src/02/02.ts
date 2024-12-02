export function parse(input: string) {
  return input.trim().split('\n').map(line => line.split(' ').map(Number))
}

type Trend = 'up' | 'down' | 'stay';

function determineTrend(levels: number[]): Trend {
  const [first, second] = levels;

  if (!first || !second) return 'stay';

  if (second > first) return 'up'
  if (first > second) return 'down';
  return 'stay';
}

export function partOne(input: ReturnType<typeof parse>) {
  const safeReports = input.map(line => {
    const trend = determineTrend(line);
    if (trend === 'stay') return false;

    for (let i = 1; i < line.length; i++) {
      const first = line[i - 1]!;
      const second = line[i]!;
      if (trend !== determineTrend([line[i - 1]!, line[i]!])) return false;

      const difference = Math.abs(second - first);
      if (difference > 3) return false;
    }

    return true;
  }).filter(Boolean).length

  return safeReports;
}

function getPermutations(levels: number[]) {
  const permutations = [];

  for (let i = 0; i < levels.length; i++) {
    permutations.push(levels.filter((_, j) => i !== j))
  }

  return permutations;
}

export function partTwo(input: ReturnType<typeof parse>) {
  const safeReports = input.map(line => {
    const permutations = getPermutations(line);

    const isSafe = permutations.map(permutation => {
      const trend = determineTrend(permutation);
      if (trend === 'stay') return false;
  
      for (let i = 1; i < permutation.length; i++) {
        const first = permutation[i - 1]!;
        const second = permutation[i]!;
        if (trend !== determineTrend([permutation[i - 1]!, permutation[i]!])) return false;
  
        const difference = Math.abs(second - first);
        if (difference > 3) return false;
      }
  
      return true;
    }).some(v => v)

    return isSafe;
  }).filter(Boolean).length

  return safeReports;
}