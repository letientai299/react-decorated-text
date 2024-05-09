import { Decor, RenderFn, split } from './core.ts';
import { HTMLAttributes, useMemo } from 'react';

export interface DecoratedTextProps extends HTMLAttributes<HTMLElement> {
  /** Body of text to the display. */
  text: string;
  /** List of {@link Decor} to render within. */
  decors?: Decor[];
  /** Use other HTML tag to render the {@link text} wrapper. */
  as?: keyof HTMLElementTagNameMap;
}

export const DecoratedText = (props: DecoratedTextProps) => {
  const { text, decors, as: As = 'span', ...rest } = props;
  const segments = useMemo(() => split(text, decors), [text, decors]);

  return (
    <As {...rest}>
      {segments.map((seg) => (
        <Segment
          text={text.slice(seg.range[0], seg.range[1])}
          renders={seg.renders}
          key={JSON.stringify(seg.range)}
        />
      ))}
    </As>
  );
};

export interface SegmentProps extends HTMLAttributes<HTMLElement> {
  text: string;
  renders: RenderFn[];
}

const Segment = (props: SegmentProps) => {
  const { text, renders } = props;
  // We're using wrapping elements to apply multiple decorations to a piece of
  // text, because we can't apply multiple text-decoration from different class
  // into one DOM element.
  //
  // We could work around that limitation by compute the final text-decoration
  // for our built-in DecorKind into one string and set it to the inline style.
  // However:
  //
  // - We can't merge built-in style with external/custom decorations.
  // - JS logic would be affected if we need to add more built-in kinds.
  //
  // Hence, we use wrapping method instead. JS will only need to create a new
  // element and set data-decoration-kind. CSS will handle the styling. More
  // built-in kind will require mostly CSS work.
  return renders.reduce((children, fn) => fn({ children }), <>{text}</>);
};
