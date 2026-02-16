import { Decor } from '@letientai299/react-decorated-text';
import { Fragment, useRef, useState } from 'react';
import styles from './Matchers.module.css';

import 'react-tooltip/dist/react-tooltip.css';
import { Matcher } from './Matcher.tsx';

interface MatcherData {
  id: string;
  query?: string;
  option?: string;
}

interface MatcherListProps {
  setDecors: (ds: Decor[]) => void;
}

export function MatcherList({ setDecors }: MatcherListProps) {
  const decorMap = useRef(new Map<string, Decor[]>());
  const [matchers, setMatchers] = useState<MatcherData[]>([
    { id: 'm0', query: `/p\\w+g/gi`, option: 'mark' },
    { id: 'm1', query: 'pub', option: 'error' },
  ]);

  const updateDecors = (id: string, ds: Decor[]) => {
    const m = decorMap.current;
    if (ds.length === 0) {
      m.delete(id);
    } else {
      m.set(id, ds);
    }
    setDecors([...m.values()].flatMap((v) => v));
  };

  const delMatcher = (delID: string) => {
    updateDecors(delID, []);
    setMatchers((ms) => ms.filter(({ id }) => id != delID));
  };

  const addMatcher = () => {
    const id = Math.random().toString();
    setMatchers((ms) => [...ms, { id }]);
  };

  return (
    <section>
      <header>
        <h2>Matchers</h2>
      </header>
      <Guide />

      <div className={styles.matcherList}>
        {matchers.map(({ id, query, option }) => (
          <Fragment key={id}>
            <Matcher
              query={query}
              option={option}
              onRemove={() => delMatcher(id)}
              setDecors={(ds) => updateDecors(id, ds)}
            />
          </Fragment>
        ))}
        <button className={styles.gridFullRow} onClick={addMatcher}>
          Add matcher
        </button>
      </div>
    </section>
  );
}

function Guide() {
  return (
    <ul>
      <li>
        <p>
          <strong>Query</strong>: can be normal string or a valid JS regular
          expression, e.g. <code>/p\w+g/ig</code>. Internally, the code
          construct the <code>RegExp</code> object by simple remove first{' '}
          <code>/</code>, then split the expression and flags at the last{' '}
          <code>/</code>.
        </p>
      </li>
      <li>
        <p>
          <strong>Options</strong>: Most option are simply an example usage of
          the provided <code>match</code> function, which will scan the text
          using the query to look for parts to apply different decorations.
        </p>
        <p>
          The exception is <code>typo</code>. It uses{' '}
          <a href="https://github.com/cfinke/Typo.js">Typo.js</a> to check for
          misspelled English words and add a tooltip to show suggestions. It's
          quite slow, will freeze the UI and the suggestions might be even
          wrong. Its purpose is to show an advanced use case of the library.
        </p>

        <p>
          If the query is not empty, <code>typo</code> will only spell-check
          those words match the query.
        </p>
      </li>
    </ul>
  );
}
