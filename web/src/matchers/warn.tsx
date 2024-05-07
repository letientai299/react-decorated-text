import { match } from '@letientai299/react-decorated-text';
import { CSSProperties } from 'react';

export function warn(text: string, query: string | RegExp) {
  return match(text, query, (p) => {
    const style: CSSProperties = {
      textDecoration: 'underline orange wavy 2px',
      textUnderlineOffset: '4px',
    };
    return <span style={style}>{p.children}</span>;
  });
}
