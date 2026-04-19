import { useLoaderData } from 'react-router-dom';
import type { TournamentBundle } from '../../entities/season/model';
import { StandingsTable } from '../../widgets/standings/StandingsTable';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function TournamentStandingsPage() {
  const { t } = useAppSettings();
  const bundle = useLoaderData() as TournamentBundle | undefined;
  if (!bundle?.standings.length) return <EmptyState title={t('standings_empty_title')} text={t('standings_empty_text')} />;
  return <StandingsTable rows={bundle.standings} />;
}
