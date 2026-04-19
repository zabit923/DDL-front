import { useLoaderData } from 'react-router-dom';
import type { TournamentBundle } from '../../entities/season/model';
import { MarkdownView } from '../../shared/ui/MarkdownView';
import { EmptyState } from '../../shared/ui/StateBlocks';

export function TournamentRulesPage() {
  const bundle = useLoaderData() as TournamentBundle | undefined;
  if (!bundle) return <EmptyState title="No rules" text="Нет данных турнира." />;
  return (
    <section className="panel">
      <MarkdownView markdown={bundle.rulesMarkdown} />
    </section>
  );
}
