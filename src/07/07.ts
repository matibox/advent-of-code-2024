export function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [result, numbers] = line.split(':') as [string, string];

      return {
        result: Number(result),
        numbers: numbers.trim().split(' ').map(Number),
      };
    });
}

type Operator = '+' | '*' | '||';

function generateOperatorCombinations(
  length: number,
  operators: Operator[]
): Operator[][] {
  const combinations: Operator[][] = [];

  function generate(curr: Operator[]) {
    if (curr.length === length) {
      combinations.push([...curr]);
      return;
    }

    for (const op of operators) {
      curr.push(op);
      generate(curr);
      curr.pop();
    }
  }

  generate([]);
  return combinations;
}

function evaluate(numbers: number[], operators: Operator[]): number {
  let res = numbers[0]!;
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i]!;
    switch (operator) {
      case '+':
        res += numbers[i + 1]!;
        break;
      case '*':
        res *= numbers[i + 1]!;
        break;
      case '||':
        let resStr = res.toString();
        resStr += numbers[i + 1]!.toString();
        res = Number(resStr);
    }
  }

  return res;
}

export function partOne(input: ReturnType<typeof parse>) {
  const result = input
    .map(({ result, numbers }) => {
      const operatorCombinations = generateOperatorCombinations(
        numbers.length - 1,
        ['*', '+']
      );

      for (const operators of operatorCombinations) {
        if (evaluate(numbers, operators) === result) return result;
      }

      return 0;
    })
    .reduce((a, b) => a + b);

  return result;
}

export function partTwo(input: ReturnType<typeof parse>) {
  const result = input
    .map(({ result, numbers }) => {
      const operatorCombinations = generateOperatorCombinations(
        numbers.length - 1,
        ['*', '+', '||']
      );

      for (const operators of operatorCombinations) {
        if (evaluate(numbers, operators) === result) return result;
      }

      return 0;
    })
    .reduce((a, b) => a + b);

  return result;
}
