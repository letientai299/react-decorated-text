/**
 * {@link binarySearch} finds and return the smallest index `i` in `[0, n)`
 * at which `f(v)` is true, where `v = arr[i]`, assuming that on the range
 * `[0, n)`, `f(arr[i]) == true` implies `f(i+1) == true`.
 *
 * That is, {@link binarySearch} requires that `f` is `false` for some (possibly
 * empty) prefix of the input range `[0, n)` and then `true` for the (possibly
 * empty) remainder.
 *
 * This returns the first true index. If there is no such index, this
 * returns `n`.
 *
 * Note that the _not found_ return value is not -1.
 *
 * @param arr the input array, which should be sorted based on some
 * conditions.
 *
 * @param f a function that inspects the given value with the array to
 * see if the searching should move to left or right.
 */
export function binarySearch<T, Arr extends readonly T[]>(
  arr: Arr,
  f: (elem: T) => boolean,
): number {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const elem = arr[mid];
    if (f(elem)) {
      right = mid;
      continue;
    }

    left = mid + 1;
  }

  return left;
}
