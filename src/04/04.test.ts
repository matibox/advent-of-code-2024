import { describe, expect, test } from 'bun:test';
import { parse } from './04';

const testInput = `
MMMSX
MSAMX
AMXSX
MSAMA
`;

describe('Day 4', () => {
  describe('Input parse', () => {
    const { vertical, d1, d2 } = parse(testInput);

    test('Vertical input is correct', () => {
      expect(vertical).toEqual([
        'MMAM'.split(''),
        'MSMS'.split(''),
        'MAXA'.split(''),
        'SMSM'.split(''),
        'XXXA'.split(''),
      ]);
    });

    test('Diagonal inputs are correct', () => {
      expect(d1).toEqual([
        ['M'],
        'MM'.split(''),
        'MSA'.split(''),
        'SAMM'.split(''),
        'XMXS'.split(''),
        'XSA'.split(''),
        'XM'.split(''),
        ['A'],
      ]);

      expect(d2).toEqual([
        ['X'],
        'SX'.split(''),
        'MMX'.split(''),
        'MASA'.split(''),
        'MSXM'.split(''),
        'MMA'.split(''),
        'AS'.split(''),
        ['M'],
      ]);
    });

    expect();
  });

  describe('Part One', () => {});

  describe('Part Two', () => {});
});
