import { Range } from '@letientai299/react-decorated-text';
import { PropsWithChildren, useId } from 'react';
import { Tooltip } from 'react-tooltip';
import Typo from 'typo-js';

const dictionary = new Typo('en_US');

export function typo(text: string, query: string | RegExp) {
  const wordBreak = /\w+/g;
  const res = [];
  try {
    for (const m of text.matchAll(wordBreak)) {
      const range: Range = [m.index, m.index + m[0].length];
      const word = text.slice(range[0], range[1]);
      if (!!query && !word.match(query)) {
        continue;
      }

      if (!dictionary.check(word)) {
        const suggestions = dictionary.suggest(word);
        res.push({
          range: range,
          render: (p: PropsWithChildren) => (
            <Mistake children={p.children} words={suggestions} />
          ),
        });
      }
    }
  } catch (ignored) {
    /* empty */
  }
  return res;
}

// eslint-disable-next-line react-refresh/only-export-components
function Mistake(props: PropsWithChildren<{ words: string[] }>) {
  const { words, children } = props;
  const id = useId();
  const tip = getTip(words);
  return (
    <>
      <span
        style={{ textDecoration: 'underline dashed green 2px' }}
        data-tooltip-id={id}
      >
        {children}
      </span>
      <Tooltip id={id} place={'bottom'}>
        {tip}
      </Tooltip>
    </>
  );
}

function getTip(words: string[]) {
  if (words.length === 0) {
    return 'Misspelled, no suggestions found.';
  }

  if (words.length === 1) {
    return `Did you mean: ${words[0]}?`;
  }

  const [first, ...rest] = words;
  return `Did you mean: ${rest.join(', ')} or ${first}`;
}
