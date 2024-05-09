import { match } from '@letientai299/react-decorated-text';
import { PropsWithChildren } from 'react';

export function error(text: string, query: string | RegExp) {
  return match(text, query, redSpan);
}

function redSpan(p: PropsWithChildren) {
  return <span style={{ color: 'red' }}>{p.children}</span>;
}
