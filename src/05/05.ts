export function parse(input: string) {
  const [rules, pages] = input.split('\n\n') as [string, string];

  const ruleMap = rules.split('\n').reduce(
    (obj, line) => {
      const [number, rule] = line.split('|').map(Number) as [number, number];
      const currArr = obj[number] ?? [];

      return {
        ...obj,
        [`${number}`]: [...currArr, rule],
      };
    },
    {} as Record<number, number[]>
  );

  return {
    rules: ruleMap,
    pages: pages.split('\n').map(line => line.split(',').map(Number)),
  };
}

function getMiddlePageElement(page: number[]) {
  const el = page[(page.length - 1) / 2];
  if (!el) return 0;
  return el;
}

function isPageCorrect(page: number[], rules: Record<number, number[]>) {
  let pageCorrect = true;
  for (let i = 1; i < page.length; i++) {
    const num = page[i]!;
    const ruleset = rules[num];
    if (!ruleset) continue;

    const pagesBeforeNum = page.slice(0, i);

    if (ruleset.some(rule => pagesBeforeNum.includes(rule))) {
      pageCorrect = false;
      break;
    }
  }

  return pageCorrect;
}

export function partOne({ rules, pages }: ReturnType<typeof parse>) {
  const sumOfMiddleElements = pages
    .map(page => {
      const pageCorrect = isPageCorrect(page, rules);
      return pageCorrect ? getMiddlePageElement(page) : 0;
    })
    .reduce((a, b) => a + b);

  return sumOfMiddleElements;
}

export function partTwo({ pages, rules }: ReturnType<typeof parse>) {
  const sumOfMiddleElements = pages
    .map(page => {
      const pageCorrect = isPageCorrect(page, rules);
      return pageCorrect ? [] : page;
    })
    .filter(page => page.length > 0)
    .map(page => {
      return page.sort((n1, n2) => {
        const ruleset = rules[n1];
        if (!ruleset) return 0;

        return ruleset.includes(n2) ? -1 : 1;
      });
    })
    .map(getMiddlePageElement)
    .reduce((a, b) => a + b);

  return sumOfMiddleElements;
}
