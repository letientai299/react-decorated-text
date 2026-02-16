import { Decor, defaultRenderFn, match, overlap, Seg, split } from './core.ts';
import { describe, expect, test } from 'vitest';

describe.each([
  {
    seg: { range: [1, 3], renders: [] } as Seg,
    decor: { range: [2, 6], render: defaultRenderFn } as Decor,
    want: [
      { range: [1, 2], renders: [] },
      { range: [2, 3], renders: [defaultRenderFn] },
    ] as Seg[],
  },

  {
    seg: { range: [1, 6], renders: [] } as Seg,
    decor: { range: [2, 6], render: defaultRenderFn } as Decor,
    want: [
      { range: [1, 2], renders: [] },
      { range: [2, 6], renders: [defaultRenderFn] },
    ] as Seg[],
  },

  {
    seg: { range: [3, 6], renders: [] } as Seg,
    decor: { range: [2, 4], render: defaultRenderFn } as Decor,
    want: [
      { range: [3, 4], renders: [defaultRenderFn] },
      { range: [4, 6], renders: [] },
    ] as Seg[],
  },

  {
    seg: { range: [2, 3], renders: [] } as Seg,
    decor: { range: [1, 6], render: defaultRenderFn } as Decor,
    want: [{ range: [2, 3], renders: [defaultRenderFn] }] as Seg[],
  },

  {
    seg: { range: [1, 6], renders: [] } as Seg,
    decor: { range: [2, 3], render: defaultRenderFn } as Decor,
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

describe('split', () => {
  test('does not create zero-width segments for touching ranges', () => {
    // Decor [0,5] touching segment boundary at 5 in text of length 10
    const segs = split(10, [{ range: [0, 5] }]);
    const zeroWidth = segs.filter((s) => s.range[0] === s.range[1]);
    expect(zeroWidth).toHaveLength(0);
    // Should produce exactly 2 segments: [0,5] decorated and [5,10] plain
    expect(segs).toHaveLength(2);
    expect(segs[0].range).toEqual([0, 5]);
    expect(segs[0].renders).toHaveLength(1);
    expect(segs[1].range).toEqual([5, 10]);
    expect(segs[1].renders).toHaveLength(0);
  });

  test('adjacent decors do not produce zero-width segments', () => {
    const segs = split(10, [{ range: [0, 5] }, { range: [5, 10] }]);
    const zeroWidth = segs.filter((s) => s.range[0] === s.range[1]);
    expect(zeroWidth).toHaveLength(0);
    expect(segs).toHaveLength(2);
  });

  test('decor range past text length does not crash', () => {
    const segs = split(10, [{ range: [100, 200] }]);
    expect(segs).toHaveLength(1);
    expect(segs[0].range).toEqual([0, 10]);
  });

  test('decor range starting at text length does not crash', () => {
    const segs = split(10, [{ range: [10, 15] }]);
    expect(segs).toHaveLength(1);
    expect(segs[0].range).toEqual([0, 10]);
  });

  test('decor with negative start is skipped', () => {
    const segs = split(10, [{ range: [-5, 3] }]);
    expect(segs).toHaveLength(1);
    expect(segs[0].range).toEqual([0, 10]);
  });

  test('partially out-of-bounds decor is applied to valid portion', () => {
    const segs = split(10, [{ range: [8, 15] }]);
    expect(segs).toHaveLength(2);
    expect(segs[0].range).toEqual([0, 8]);
    expect(segs[0].renders).toHaveLength(0);
    expect(segs[1].range).toEqual([8, 10]);
    expect(segs[1].renders).toHaveLength(1);
  });
});
