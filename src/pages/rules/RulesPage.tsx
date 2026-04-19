import { useLoaderData } from 'react-router-dom';
import { MarkdownView } from '../../shared/ui/MarkdownView';

export function RulesPage() {
  const markdown = useLoaderData() as string;
  return (
    <section className="panel">
      <MarkdownView markdown={markdown} />
    </section>
  );
}
