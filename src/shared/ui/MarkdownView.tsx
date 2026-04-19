import type { ReactNode } from 'react';

export function MarkdownView({ markdown }: { markdown: string }) {
  const lines = markdown.split('\n');
  const nodes: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (keyBase: number) => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul className="list" key={`list-${keyBase}`}>
        {listBuffer.map((item, idx) => (
          <li key={`${keyBase}-${idx}`}>{item}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
      return;
    }

    flushList(i);

    if (line.startsWith('# ')) {
      nodes.push(<h2 key={i}>{line.slice(2)}</h2>);
      return;
    }

    if (line.startsWith('## ')) {
      nodes.push(<h3 key={i}>{line.slice(3)}</h3>);
      return;
    }

    if (!line.trim()) {
      nodes.push(<br key={i} />);
      return;
    }

    nodes.push(<p key={i}>{line}</p>);
  });

  flushList(lines.length + 1);

  return (
    <div className="markdown">
      {nodes}
    </div>
  );
}
