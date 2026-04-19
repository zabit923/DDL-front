import { Link } from 'react-router-dom';
import type { Tournament } from '../../entities/season/model';
import { Badge } from '../../shared/ui/StateBlocks';
import { formatDate } from '../../shared/lib/format';
import { formatKeyMap, statusKeyMap } from '../../shared/lib/labels';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { t, locale } = useAppSettings();
  return (
    <article className="panel card">
      <div className="row split">
        <h3>{tournament.name}</h3>
        <Badge tone={tournament.status === 'live' ? 'live' : 'neutral'}>{t(statusKeyMap[tournament.status])}</Badge>
      </div>
      <p>{tournament.region} • {t(formatKeyMap[tournament.format])}</p>
      <p>{t('tournament_start')}: {formatDate(tournament.startsAt, locale)}</p>
      <p>{t('tournament_prize')}: {tournament.prizePool}</p>
      <Link className="btn" to={`/tournaments/${tournament.slug}`}>
        {t('tournament_open')}
      </Link>
    </article>
  );
}
