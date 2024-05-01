import { CSSProperties } from 'react';

export const DecoratedText = () => {
  const style: CSSProperties = {
    color: 'red',
  };
  return (
    <span style={style}>
      Decorated <mark>text</mark> is here
    </span>
  );
};
