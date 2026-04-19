import { useLoaderData } from 'react-router-dom';
import { MarkdownView } from '../../shared/ui/MarkdownView';

export function FaqPage() {
  const markdown = useLoaderData() as string;
  return (
    <section className="panel">
      <MarkdownView markdown={markdown} />
    </section>
  );
}
