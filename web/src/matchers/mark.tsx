import { match } from '@letientai299/react-decorated-text';

export function mark(text: string, query: string | RegExp) {
  return match(text, query, (p) => (
    <mark style={{ color: 'inherit' }}>{p.children}</mark>
  ));
}
