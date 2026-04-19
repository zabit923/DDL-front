import { useLoaderData } from 'react-router-dom';
import type { TournamentBundle } from '../../entities/season/model';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function TournamentParticipantsPage() {
  const { t } = useAppSettings();
  const bundle = useLoaderData() as TournamentBundle | undefined;
  if (!bundle?.participants.length) return <EmptyState title={t('participants_empty_title')} text={t('participants_empty_text')} />;

  return (
    <section className="panel">
      <h3>{t('participants_title')}</h3>
      <ul className="list">
        {bundle.participants.map((team) => (
          <li key={team.slug}>{team.name} ({team.region})</li>
        ))}
      </ul>
    </section>
  );
}
