import { useLoaderData } from 'react-router-dom';
import type { Player } from '../../entities/season/model';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function PlayerPage() {
  const { t } = useAppSettings();
  const player = useLoaderData() as Player | undefined;
  if (!player) return <EmptyState title={t('player_not_found')} text={t('entity_slug_text')} />;

  return (
    <section className="panel">
      <h1>{player.nickname}</h1>
      <p>{player.team} • {player.role}</p>
      <div className="row">
        <span className="chip">K/D: {player.stats.kd}</span>
        <span className="chip">ADR: {player.stats.adr}</span>
        <span className="chip">MVP: {player.stats.mvp}</span>
      </div>
    </section>
  );
}
