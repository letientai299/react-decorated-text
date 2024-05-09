import { createElement, PropsWithChildren, ReactElement } from 'react';
import { binarySearch } from './utils.ts';

export type Range = [start: number, end: number];
export type RenderFn = (props: PropsWithChildren) => ReactElement;

export type Decor = {
  /**
   * Range to apply decoration. Invalid part of the range will be ignored.
   */
  range: Range;
  render?: RenderFn;
};

export function match(
  s: string,
  part: string | RegExp,
  render?: RenderFn,
): Decor[] {
  if (part === '' || part === null || part === undefined) {
    return [];
  }

  if (part instanceof RegExp) {
    return matchRegexp(s, part, render);
  }

  const res: Decor[] = [];
  let n = 0;
  while (s.length > 0) {
    const i = s.indexOf(part);
    if (i < 0) {
      break;
    }

    const range: Range = [n + i, n + i + part.length];
    n = range[1];
    s = s.slice(i + part.length);
    res.push({ range: range, render: render });
  }

  return res;
}

function matchRegexp(s: string, re: RegExp, render?: RenderFn): Decor[] {
  if (!re.global) {
    re = new RegExp(re, 'g');
  }

  const res: Decor[] = [];
  for (const m of s.matchAll(re)) {
    res.push({ range: [m.index, m.index + m[0].length], render: render });
  }

  return res;
}

export function split(text: string, decors: Decor[] | undefined): Seg[] {
  if (decors === undefined || decors.length === 0) {
    return [{ range: [0, text.length], renders: [] }];
  }

  let segments: Seg[] = [
    {
      range: [0, text.length],
      renders: [],
    },
  ];

  for (const decor of decors) {
    const [a, b] = decor.range;
    if (a >= b) {
      continue; // skip invalid range
    }

    // find index of the first pair that overlaps with decor range
    const first = binarySearch(segments, (p: Seg) => {
      const [, y] = p.range;
      return a < y;
    });

    // find index of the last pair that overlaps with decor range
    const last =
      binarySearch(segments, (p: Seg) => {
        const [x] = p.range;
        return b < x;
      }) - 1;

    segments = [
      ...segments.slice(0, first),
      ...overlap(segments[first], decor),
      ...segments.slice(first + 1, last).map((p) => ({
        range: p.range,
        renders: [...p.renders, usableRenderFn(decor)],
      })),
      ...(first !== last && last < segments.length
        ? overlap(segments[last], decor)
        : []),
      ...segments.slice(last + 1, segments.length),
    ];
  }

  return segments;
}

export type Seg = {
  range: Range;
  renders: RenderFn[];
};

function usableRenderFn(d: Decor): RenderFn {
  return d.render ?? ((p) => createElement('mark', null, p.children));
}

export function overlap(p: Seg, decor: Decor): Seg[] {
  const [a, b] = decor.range;
  const [x, y] = p.range;
  const newRenders = [...p.renders, usableRenderFn(decor)];

  // ----a--------b------
  // ------x---y---------
  if (a <= x && y <= b) {
    return [{ range: p.range, renders: newRenders }];
  }

  // ----a--------b------
  // --x--------------y--
  if (x < a && b < y) {
    return [
      { range: [x, a], renders: p.renders },
      { range: [a, b], renders: newRenders },
      { range: [b, y], renders: p.renders },
    ];
  }

  // ----a--------b------
  // --x----y------------
  if (y <= b) {
    return [
      { range: [x, a], renders: p.renders },
      { range: [a, y], renders: newRenders },
    ];
  }

  return [
    { range: [x, b], renders: newRenders },
    { range: [b, y], renders: p.renders },
  ];
}
