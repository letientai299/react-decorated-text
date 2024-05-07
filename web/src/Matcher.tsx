import { ChangeEvent, useContext, useId, useState } from 'react';
import { TextContext } from './TextContext.ts';
import { FiCode, FiDelete } from 'react-icons/fi';

import { Decor } from '@letientai299/react-decorated-text';
import { allMatchers } from './matchers';
import { Highlight } from 'prism-react-renderer';

import styles from './Matchers.module.css';
import { IconType } from 'react-icons';
import { Tooltip } from 'react-tooltip';

interface MatcherProps {
  option?: string;
  query?: string;
  onRemove: () => void;
  setDecors: (ds: Decor[]) => void;
}

export function Matcher(props: MatcherProps) {
  const text = useContext(TextContext);

  const {
    query: initQuery = '',
    option: initOpt = 'error',
    onRemove,
    setDecors,
  } = props;

  const [query, setQuery] = useState(initQuery);
  const [option, setOption] = useState(initOpt);
  const m = allMatchers[option];

  const [showCode, setShowCode] = useState(false);

  const toggleCode = () => setShowCode((v) => !v);

  const options = Object.keys(allMatchers).map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ));

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
  };

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const opt = e.target.value;
    setOption(opt);
  };

  const createDecors = (q: string) => {
    if (!m) {
      return setDecors([]);
    }

    let ds;
    if (!q.startsWith('/')) {
      ds = m.fn(text, q);
    } else {
      const cutAt = q.lastIndexOf('/');
      const re = q.slice(1, cutAt);
      const flags = q.slice(cutAt + 1);
      ds = m.fn(text, new RegExp(re, flags));
    }

    setDecors(ds);
  };

  createDecors(query);

  return (
    <>
      <input
        type="text"
        defaultValue={query}
        onChange={onQueryChange}
        placeholder={'input query...'}
      />
      <select value={option} onChange={onSelect}>
        {options}
      </select>
      <Tool icon={FiCode} tip={'Toggle code example'} onClick={toggleCode} />
      <Tool icon={FiDelete} tip={'Remove matcher'} onClick={onRemove} />
      {showCode && <CodeBlock code={m.code} />}
    </>
  );
}

function Tool(props: { icon: IconType; tip: string; onClick: () => void }) {
  const { icon: Icon, tip, onClick } = props;
  const id = useId();
  return (
    <>
      <button onClick={onClick} data-tooltip-id={id}>
        <Icon />
        <Tooltip id={id} place={'bottom'}>
          {tip}
        </Tooltip>
      </button>
    </>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className={styles.gridFullRow}>
      <Highlight code={code} language={'tsx'}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre style={style} className={className}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
