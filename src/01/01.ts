export function parse(input: string) {
  const lines = input.trim().split('\n')
  const firstList = []
  const secondList = []

  for (const line of lines) {
    const [n1, n2] = line.trim().split('   ')
    firstList.push(n1)
    secondList.push(n2)
  }

  return { left: firstList.map(Number), right: secondList.map(Number) }
}

export function partOne({ left, right }: ReturnType<typeof parse>) {
  const leftList = left.sort()
  const rightList = right.sort()
  let total = 0

  for (let i = 0; i < leftList.length; i++) {
    const distance = Math.abs(leftList[i]! - rightList[i]!)
    total += distance
  }

  return total
}

export function partTwo({ left, right }: ReturnType<typeof parse>) {
  return left
    .map(num => {
      let occurencies = 0
      for (const rightNum of right) {
        if (num == rightNum) occurencies++
      }

      return num * occurencies
    })
    .reduce((a, b) => a + b)
}
