export function parse(input: string) {
  return { input, mulMatches: input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)};
}

export function partOne({ mulMatches }: ReturnType<typeof parse>) {
  return [...mulMatches].map(match => {
    const firstNum = Number(match[1]!);
    const secondNum = Number(match[2]!);
    return [firstNum, secondNum]
  }).map(match => match.reduce((a, b) => a * b, 1)).reduce((a, b) => a + b);
}

export function partTwo({ mulMatches, input }: ReturnType<typeof parse>) {
  const doMatches = input.matchAll(/do\(\)/g);
  const dontMatches = input.matchAll(/don't\(\)/g);

  const instructions = [...mulMatches, ...doMatches, ...dontMatches]
    .map(match => ({ idx: match.index, body: match[0] }))
    .sort((a, b) => a.idx - b.idx);

  let run = true;

  const sum = instructions.map(({ body }) => {
    if (body.startsWith('mul(')) {
      if (!run) return 0;
      const [firstNum, secondNum] = body.slice(4, -1).split(',').map(Number);
      return firstNum! * secondNum!;
    } else if (body.startsWith('do()')) {
      run = true;
    } else if (body.startsWith('don\'t()')) {
      run = false;
    }

    return 0;
  }).reduce((a, b) => a + b);

  return sum;
}