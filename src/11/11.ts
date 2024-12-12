export function parse(input: string) {
  return input.trim().split(' ');
}

export function partOne(input: ReturnType<typeof parse>) {
  let res: string[] = input;
  for (let i = 0; i < 25; i++) {
    const curr: string[] = [];
    for (let j = 0; j < res.length; j++) {
      const stone = res[j]!;
      // first rule, stone = 0
      if (stone === '0') {
        curr.push('1');
        continue;
      }
      // second rule, stone has even number of digits
      if (stone.length % 2 === 0) {
        const firstHalf = stone.slice(0, stone.length / 2);
        const secondHalf = stone.slice(stone.length / 2, stone.length);
        // cut off zeroes
        curr.push(Number(firstHalf).toString(), Number(secondHalf).toString());
        continue;
      }
      // third rule, stone multiplied by 2024
      const newStone = Number(stone) * 2024;
      curr.push(newStone.toString());
    }
    res = curr;
  }
  return res.length;
}

type Stone = { val: string; quantity: number };

export function partTwo(input: ReturnType<typeof parse>) {
  let res: Stone[] = input.map(stone => ({ val: stone, quantity: 1 }));
  for (let i = 0; i < 75; i++) {
    const curr: Stone[] = [];

    for (let j = 0; j < res.length; j++) {
      const stone = res[j]!;

      // first rule, stone = 0
      if (stone.val === '0') {
        match({ val: '1', quantity: stone.quantity }, curr);
        continue;
      }

      // second rule, stone has even number of digits
      if (stone.val.length % 2 === 0) {
        const firstHalf = stone.val.slice(0, stone.val.length / 2);
        const secondHalf = stone.val.slice(
          stone.val.length / 2,
          stone.val.length
        );
        match(
          { val: parseInt(firstHalf).toString(), quantity: stone.quantity },
          curr
        );
        match(
          { val: parseInt(secondHalf).toString(), quantity: stone.quantity },
          curr
        );
        continue;
      }

      // third rule, stone multiplied by 2024
      match(
        {
          val: (parseInt(stone.val) * 2024).toString(),
          quantity: stone.quantity,
        },
        curr
      );
    }

    res = curr;
  }

  return res.reduce((a, b) => a + b.quantity, 0);
}

function match(stone: Stone, stones: Stone[]) {
  const m = stones.find(s => s.val === stone.val);
  if (m) m.quantity += stone.quantity;
  else stones.push(stone);
}
