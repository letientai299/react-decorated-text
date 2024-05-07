import { match } from '@letientai299/react-decorated-text';

export function error(text: string, query: string | RegExp) {
  return match(text, query, (p) => (
    <span style={{ color: 'red' }}>{p.children}</span>
  ));
}
