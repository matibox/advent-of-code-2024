export function parse(input: string) {
  return input.trim();
}

function generateBlocks(input: ReturnType<typeof parse>) {
  let isFile = true;
  const blocks: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const value = Number(input[i]);
    for (let j = 0; j < value; j++) {
      if (isFile) {
        const id = i / 2;
        blocks.push(id.toString());
      } else {
        blocks.push('.');
      }
    }

    isFile = !isFile;
  }

  return blocks;
}

function getChecksum(blocks: string[]) {
  let checksum = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== '.') {
      checksum += Number(blocks[i]) * i;
    }
  }

  return checksum;
}

export function partOne(input: ReturnType<typeof parse>) {
  const blocks = [...generateBlocks(input)];
  let leftmostFree = blocks.findIndex(ch => ch === '.');

  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i] !== '.') {
      if (leftmostFree < i) {
        blocks[leftmostFree] = blocks[i]!;
        blocks[i] = '.';
        leftmostFree = blocks.findIndex(ch => ch === '.');
      }
    }
  }

  return getChecksum(blocks);
}

type Chunk = { start: number; end: number; id: string };

function generateChunks(blocks: ReturnType<typeof generateBlocks>) {
  const chunks: Chunk[] = [];

  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i]!;

    let j = 0;
    while (true) {
      const nextBlock = blocks[i + j];
      if (!nextBlock) break;
      if (nextBlock !== block) break;
      j++;
    }

    chunks.push({ start: i, end: i + j, id: block });
    i += j;
  }

  return chunks;
}

function debug(chunks: Chunk[]) {
  let res = '';
  for (const chunk of chunks.sort((a, b) => a.start - b.start)) {
    const l = chunk.end - chunk.start;
    res += chunk.id.repeat(l);
  }

  return res;
}

function chunksToBlocks(_chunks: Chunk[]) {
  const chunks = _chunks.sort((a, b) => a.start - b.start);
  const blocks: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const l = chunk.end - chunk.start;
    for (let j = 0; j < l; j++) {
      blocks.push(chunk.id);
    }
  }

  return blocks;
}

export function partTwo(input: ReturnType<typeof parse>) {
  const chunks = [...generateChunks(generateBlocks(input))];

  // console.log('pre', debug(chunks), '\n\n');

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i]!;
    const chunkLength = chunk.end - chunk.start;
    if (chunk.id === '.') continue;

    const leftmostFreeChunkIdx = chunks.findIndex(
      ch => ch.end - ch.start >= chunkLength && ch.id === '.'
    );
    if (leftmostFreeChunkIdx === -1) continue;

    const leftmostFreeChunk = chunks[leftmostFreeChunkIdx]!;

    if (chunk.start < leftmostFreeChunk.start) continue;

    chunks.push({
      start: leftmostFreeChunk.start,
      end: leftmostFreeChunk.start + chunkLength,
      id: chunk.id,
    });
    leftmostFreeChunk.start = leftmostFreeChunk.start + chunkLength;
    chunk.id = '.';

    leftmostFreeChunk.id = chunk.id;
    chunks[i]!.id = '.';

    // console.log(debug(chunks), '\n\n');
  }

  // console.log('post', debug(chunks), '\n\n');

  const blocks = chunksToBlocks(chunks);
  return getChecksum(blocks);
}
