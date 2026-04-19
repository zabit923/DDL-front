import { useLoaderData } from 'react-router-dom';
import type { Team } from '../../entities/season/model';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function TeamPage() {
  const { t } = useAppSettings();
  const team = useLoaderData() as Team | undefined;
  if (!team) return <EmptyState title={t('team_not_found')} text={t('entity_slug_text')} />;
  return (
    <section className="panel">
      <h1>{team.name}</h1>
      <p>{t('team_region')}: {team.region}</p>
      <p>{t('team_points')}: {team.seasonPoints}</p>
      <h3>{t('team_roster')}</h3>
      <ul className="list">
        {team.roster.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </section>
  );
}
