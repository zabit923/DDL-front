import { useLoaderData } from 'react-router-dom';
import type { Match } from '../../entities/season/model';
import { Badge, EmptyState } from '../../shared/ui/StateBlocks';
import { formatDate } from '../../shared/lib/format';
import { matchStatusKeyMap } from '../../shared/lib/labels';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function MatchPage() {
  const { t, locale } = useAppSettings();
  const match = useLoaderData() as Match | undefined;
  if (!match) return <EmptyState title={t('match_not_found')} text={t('match_not_found_text')} />;

  return (
    <section className="stack">
      <article className="panel">
        <div className="row split">
          <h1>{match.teamA} vs {match.teamB}</h1>
          <Badge tone={match.status === 'live' ? 'live' : match.status === 'under_review' ? 'warn' : 'neutral'}>
            {t(matchStatusKeyMap[match.status])}
          </Badge>
        </div>
        <p>{match.phase} • {match.round}</p>
        <p>{match.scoreA}:{match.scoreB} • {formatDate(match.startsAt, locale)}</p>
        <p>{t('match_map')}: {match.map ?? t('match_tbd')}</p>
        <p>{t('match_pickban')}: {match.pickBan ?? t('match_pending')}</p>
      </article>
      <article className="panel">
        <h3>{t('match_result_history')}</h3>
        <ul className="list">
          {match.resultHistory.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </article>
      <article className="panel">
        <h3>{t('match_broadcast')}</h3>
        <p>{t('match_stream')}: {match.streamUrl ?? t('match_no_stream')}</p>
        <p>{t('match_vod')}: {match.vodUrl ?? t('match_no_vod')}</p>
      </article>
    </section>
  );
}
