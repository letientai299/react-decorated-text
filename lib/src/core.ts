import { createElement, PropsWithChildren, ReactElement } from 'react';
import { binarySearch } from './utils.ts';

export type Range = [start: number, end: number];
export type RenderFn = (props: PropsWithChildren) => ReactElement;

export type Decor = {
  /**
   * Range to apply decoration, including the start and end position.
   * Invalid part of the range will be ignored.
   */
  range: Range;

  /**
   * A function to render the text segment denoted by this the {@link range}.
   * If not specify, the text will be rendered within `<mark>`.
   */
  render?: RenderFn;
};

/**
 * Finds and creates {@link Decor} for all segments in the text that match the
 * query.
 *
 * Query could be either {@link string} or {@link RegExp}. If it's a non-global
 * `RegExp`, it will be cloned with the global flag to support finding all
 * matches in the text.
 *
 * If the option {@link render}is not specified, use the default one which will
 * wrap text segment within `<mark>`.
 */
export function match(
  text: string,
  query: string | RegExp,
  render?: RenderFn,
): Decor[] {
  if (query === '' || query === null || query === undefined) {
    return [];
  }

  return query instanceof RegExp
    ? matchRegexp(text, query, render)
    : matchString(text, query, render);
}

function matchString(text: string, query: string, render?: RenderFn): Decor[] {
  const res: Decor[] = [];
  let n = 0;
  while (text.length > 0) {
    const i = text.indexOf(query);
    if (i < 0) {
      break;
    }

    const range: Range = [n + i, n + i + query.length];
    n = range[1];
    text = text.slice(i + query.length);
    res.push({ range: range, render: render });
  }

  return res;
}

function matchRegexp(text: string, re: RegExp, render?: RenderFn): Decor[] {
  if (!re.global) {
    re = new RegExp(re, 'g');
  }

  const res: Decor[] = [];
  for (const m of text.matchAll(re)) {
    res.push({ range: [m.index, m.index + m[0].length], render: render });
  }

  return res;
}

export function split(length: number, decors: Decor[] | undefined): Seg[] {
  if (decors === undefined || decors.length === 0) {
    return [{ range: [0, length], renders: [] }];
  }

  let segments: Seg[] = [{ range: [0, length], renders: [] }];

  for (const decor of decors) {
    const [a, b] = decor.range;
    if (a >= b) {
      continue; // skip invalid range
    }

    // find index of the first overlap with decor range
    const first = binarySearch(segments, (p: Seg) => {
      const [, y] = p.range;
      return a < y;
    });

    // find index of the last overlap with decor range
    const last =
      binarySearch(segments, (p: Seg) => {
        const [x] = p.range;
        return b < x;
      }) - 1;

    segments = [
      // all the segments at the beginning
      ...segments.slice(0, first),
      // first overlap, might not be fully covered by the current decor
      ...overlap(segments[first], decor),
      // all the segments in between first and last, which are fully covered,
      // hence, only needs to append the renders.
      ...segments.slice(first + 1, last).map((p) => ({
        range: p.range,
        renders: uniq(...p.renders, usableRenderFn(decor)),
      })),
      // last overlap, might not be fully covered by the current decor
      ...(first !== last && last < segments.length
        ? overlap(segments[last], decor)
        : []),
      // all the segments following the last overlap.
      ...segments.slice(last + 1, segments.length),
    ];
  }

  return segments;
}

// note that we deduplicate the renders, but not merge consecutive segment with
// the same set of renders, because the custom element might need to handle
// interaction differently per child content.
function uniq(...renders: RenderFn[]): RenderFn[] {
  return Array.from(new Set(renders));
}

export type Seg = {
  range: Range;
  renders: RenderFn[];
};

function usableRenderFn(d: Decor): RenderFn {
  return d.render ?? defaultRenderFn;
}

export function defaultRenderFn(p: PropsWithChildren) {
  return createElement('mark', null, p.children);
}

export function overlap(p: Seg, decor: Decor): Seg[] {
  const [a, b] = decor.range;
  const [x, y] = p.range;
  const newRenders = uniq(...p.renders, usableRenderFn(decor));

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
