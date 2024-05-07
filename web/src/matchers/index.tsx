import { Decor } from '@letientai299/react-decorated-text';

import { error } from './error.tsx';
import errorCode from './error.tsx?raw';

import { warn } from './warn.tsx';
import warnCode from './warn.tsx?raw';

import { mark } from './mark.tsx';
import markCode from './mark.tsx?raw';

import { typo } from './typo.tsx';
import typoCode from './typo.tsx?raw';

type Matcher = (text: string, query: string | RegExp) => Decor[];

interface MatcherConfig {
  fn: Matcher;
  code: string;
}

export const allMatchers: { [index: string]: MatcherConfig } = {
  error: { fn: error, code: errorCode },
  warn: { fn: warn, code: warnCode },
  mark: { fn: mark, code: markCode },
  typo: { fn: typo, code: typoCode },
};
