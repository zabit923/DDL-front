import { useLoaderData } from 'react-router-dom';
import type { TournamentBundle } from '../../entities/season/model';
import { MatchCard } from '../../widgets/tournament-overview/MatchCard';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function TournamentSchedulePage() {
  const { t } = useAppSettings();
  const bundle = useLoaderData() as TournamentBundle | undefined;
  if (!bundle?.schedule.length) return <EmptyState title={t('schedule_empty_title')} text={t('schedule_empty_text')} />;

  return (
    <section className="stack">
      <h2>{t('schedule_title')}</h2>
      {bundle.schedule.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </section>
  );
}
