import { Link } from 'react-router-dom';
import type { Match } from '../../entities/season/model';
import { Badge } from '../../shared/ui/StateBlocks';
import { formatDate } from '../../shared/lib/format';
import { matchStatusKeyMap } from '../../shared/lib/labels';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function MatchCard({ match }: { match: Match }) {
  const { t, locale } = useAppSettings();
  const tone = match.status === 'live' ? 'live' : match.status === 'under_review' ? 'warn' : 'neutral';
  return (
    <article className="panel compact">
      <div className="row split">
        <strong>{match.teamA} vs {match.teamB}</strong>
        <Badge tone={tone}>{t(matchStatusKeyMap[match.status])}</Badge>
      </div>
      <p>{match.phase} • {match.round}</p>
      <p>{match.scoreA}:{match.scoreB} • {formatDate(match.startsAt, locale)}</p>
      <Link className="link" to={`/matches/${match.id}`}>{t('match_open_screen')}</Link>
    </article>
  );
}
