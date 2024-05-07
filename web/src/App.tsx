import DecoratedText, { Decor } from '@letientai299/react-decorated-text';
import { useContext, useState } from 'react';
import { MatcherList } from './MatcherList.tsx';
import { TextContext } from './TextContext.ts';
import data from './data.txt?raw';

interface InputProps {
  setText: (text: string) => void;
}

function App() {
  const [text, setText] = useState(data);
  const [decors, setDecors] = useState<Decor[]>([]);

  return (
    <TextContext.Provider value={text}>
      <main>
        <article>
          <header>
            <h1>React Decorated Text demo</h1>
          </header>
          <Input setText={setText} />
          <MatcherList setDecors={setDecors} />
          <Output text={text} decors={decors} />
        </article>
      </main>
    </TextContext.Provider>
  );
}

function Input({ setText }: InputProps) {
  const text = useContext(TextContext);
  return (
    <section>
      <header>
        <h2>Input</h2>
      </header>
      <textarea
        style={{ width: '100%', minHeight: '6rem' }}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
    </section>
  );
}

function Output(props: { text: string; decors: Decor[] }) {
  return (
    <section>
      <header>
        <h2>Output</h2>
      </header>

      <DecoratedText
        text={props.text}
        decors={props.decors}
        style={{ whiteSpace: 'pre-line' }}
      />
    </section>
  );
}

export default App;
