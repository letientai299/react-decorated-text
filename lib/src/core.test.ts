import { Decor, defaultRenderFn, match, overlap, Seg } from './core.ts';
import { describe, expect, test } from 'vitest';

describe.each([
  {
    seg: { range: [1, 3], renders: [] } as Seg,
    decor: { range: [2, 6], renders: defaultRenderFn } as Decor,
    want: [
      { range: [1, 2], renders: [] },
      { range: [2, 3], renders: [defaultRenderFn] },
    ] as Seg[],
  },

  {
    seg: { range: [1, 6], renders: [] } as Seg,
    decor: { range: [2, 6], kind: defaultRenderFn } as Decor,
    want: [
      { range: [1, 2], renders: [] },
      { range: [2, 6], renders: [defaultRenderFn] },
    ] as Seg[],
  },

  {
    seg: { range: [3, 6], renders: [] } as Seg,
    decor: { range: [2, 4], kind: defaultRenderFn } as Decor,
    want: [
      { range: [3, 4], renders: [defaultRenderFn] },
      { range: [4, 6], renders: [] },
    ] as Seg[],
  },

  {
    seg: { range: [2, 3], renders: [] } as Seg,
    decor: { range: [1, 6], kind: defaultRenderFn } as Decor,
    want: [{ range: [2, 3], renders: [defaultRenderFn] }] as Seg[],
  },

  {
    seg: { range: [1, 6], renders: [] } as Seg,
    decor: { range: [2, 3], kind: defaultRenderFn } as Decor,
    want: [
      { range: [1, 2], renders: [] },
      { range: [2, 3], renders: [defaultRenderFn] },
      { range: [3, 6], renders: [] },
    ] as Seg[],
  },
])('overlap', function ({ seg, decor, want }) {
  const name = `seg=[${seg.range}], decor=[${decor.range}]`;
  test(name, () => {
    const actual = overlap(seg, decor);
    expect(actual).toEqual(want);
  });
});

describe('match', () => {
  test('preserves regex flags when adding global', () => {
    const text = 'Hello HELLO hello';
    const decors = match(text, /hello/i);
    expect(decors).toHaveLength(3);
    expect(decors.map((d) => text.slice(d.range[0], d.range[1]))).toEqual([
      'Hello',
      'HELLO',
      'hello',
    ]);
  });

  test('works with already-global regex', () => {
    const text = 'ab ab ab';
    const decors = match(text, /ab/g);
    expect(decors).toHaveLength(3);
  });

  test('preserves multiline flag', () => {
    const text = 'start\nstart again';
    const decors = match(text, /^start/m);
    expect(decors).toHaveLength(2);
  });
});
