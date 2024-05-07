import { binarySearch } from './utils.ts';
import { describe, expect, test } from 'vitest';

const tens = new Array(10).fill(0).map((_, i) => i + 1);

const compareWith = (n: number) => (other: number) => other >= n;

describe.each([
  ...tens.map((i) => ({
    name: `found ${i}`,
    input: tens,
    cmp: compareWith(i),
    want: i - 1, // should insert after the equal position.
  })),

  {
    name: 'find 2.5',
    input: tens,
    cmp: compareWith(2.5),
    want: 2,
  },

  {
    name: 'not found, insert at beginning',
    input: tens,
    cmp: compareWith(-1),
    want: 0,
  },

  {
    name: 'not found, insert at the end',
    input: tens,
    cmp: compareWith(11),
    want: tens.length,
  },
])('binarySearch', function ({ name, want, input, cmp }) {
  test(name, () => {
    const actual = binarySearch(input, cmp);
    expect(actual).toEqual(want);
  });
});
