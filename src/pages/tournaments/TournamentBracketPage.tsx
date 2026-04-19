import { useLoaderData } from 'react-router-dom';
import type { TournamentBundle } from '../../entities/season/model';
import { BracketView } from '../../widgets/bracket/BracketView';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function TournamentBracketPage() {
  const { t } = useAppSettings();
  const bundle = useLoaderData() as TournamentBundle | undefined;
  if (!bundle?.bracket.length) {
    return <EmptyState title={t('bracket_empty_title')} text={t('bracket_empty_text')} />;
  }
  return <BracketView nodes={bundle.bracket} />;
}
