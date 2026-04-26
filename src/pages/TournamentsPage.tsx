import { Link, useLoaderData, useSearchParams } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import type { TournamentDetailDTO, TournamentStatus } from '../shared/api/contracts';
import { localizeTournament } from '../shared/lib/contentLocalization';
import { fillCounter, formatDateTime } from '../shared/lib/format';

const filters: Array<{ value: TournamentStatus | 'all'; labelKey: 'all' | 'upcomingPlural' | 'livePlural' | 'finishedPlural' }> = [
  { value: 'all', labelKey: 'all' },
  { value: 'upcoming', labelKey: 'upcomingPlural' },
  { value: 'live', labelKey: 'livePlural' },
  { value: 'finished', labelKey: 'finishedPlural' }
];

interface TournamentsLoaderData {
  items: TournamentDetailDTO[];
  latestLiveTournament: TournamentDetailDTO | null;
}

export const TournamentsPage = () => {
  const { items: tournaments, latestLiveTournament } = useLoaderData() as TournamentsLoaderData;
  const [searchParams] = useSearchParams();
  const { t, language } = useSession();
  const localizedTournaments = tournaments.map((item) => localizeTournament(item, language));
  const localizedLatestLiveTournament = latestLiveTournament ? localizeTournament(latestLiveTournament, language) : null;
  const active = searchParams.get('status') ?? 'all';
  const statusLabels: Record<TournamentStatus, string> = {
    upcoming: t('statusUpcoming'),
    live: t('statusLive'),
    finished: t('statusFinished')
  };

  return (
    <div className="stack-xl">
      {localizedLatestLiveTournament ? (
        <section className="live-tournament-hero">
          <img src={localizedLatestLiveTournament.imageUrl} alt="" />
          <div className="live-tournament-hero__shade" />
          <div className="live-tournament-hero__content">
            <div className="card-topline">
              <span className="status-pill live">{t('liveNow')}</span>
              <span>{localizedLatestLiveTournament.boFormat}</span>
              <span>{fillCounter(localizedLatestLiveTournament.registeredTeamsCount, localizedLatestLiveTournament.maxTeamsCount)}</span>
            </div>
            <p className="eyebrow">{t('latestLiveTournament')}</p>
            <h1>{localizedLatestLiveTournament.title}</h1>
            <p>{localizedLatestLiveTournament.description}</p>
            <dl className="meta-grid">
              <div>
                <dt>{t('start')}</dt>
                <dd>{formatDateTime(localizedLatestLiveTournament.startsAt, language)}</dd>
              </div>
              <div>
                <dt>{t('prizePool')}</dt>
                <dd>{localizedLatestLiveTournament.prizePool}</dd>
              </div>
              <div>
                <dt>{t('currentMatch')}</dt>
                <dd>
                  {localizedLatestLiveTournament.currentMatch
                    ? `${localizedLatestLiveTournament.currentMatch.teamA} ${localizedLatestLiveTournament.currentMatch.score} ${localizedLatestLiveTournament.currentMatch.teamB}`
                    : t('bracketUpdating')}
                </dd>
              </div>
              <div>
                <dt>{t('stream')}</dt>
                <dd>{localizedLatestLiveTournament.streamLinks[0]?.label ?? t('soon')}</dd>
              </div>
            </dl>
            <div className="hero-actions">
              <Link className="button primary" to={`/tournaments/${localizedLatestLiveTournament.slug}`}>
                {t('openLivePage')}
              </Link>
              {localizedLatestLiveTournament.streamLinks[0] ? (
                <a className="button ghost light" href={localizedLatestLiveTournament.streamLinks[0].url} target="_blank" rel="noreferrer">
                  {t('watchStream')}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <section className="page-hero compact">
          <p className="eyebrow">{t('tournamentHub')}</p>
          <h1>{t('allTournaments')}</h1>
          <p>{t('noLive')}</p>
        </section>
      )}

      <div className="filter-row" aria-label={t('navTournaments')}>
        {filters.map((filter) => (
          <Link
            key={filter.value}
            className={active === filter.value ? 'selected' : undefined}
            to={filter.value === 'all' ? '/tournaments' : `/tournaments?status=${filter.value}`}
          >
            {t(filter.labelKey)}
          </Link>
        ))}
      </div>

      <section className="tournament-grid">
        {localizedTournaments.map((tournament) => (
          <Link className="tournament-card" key={tournament.id} to={`/tournaments/${tournament.slug}`}>
            <img src={tournament.imageUrl} alt="" />
            <div className="tournament-card__body">
              <div className="card-topline">
                <span className={`status-pill ${tournament.status}`}>{statusLabels[tournament.status]}</span>
                <span>{tournament.boFormat}</span>
              </div>
              <h2>{tournament.title}</h2>
              <p>{tournament.description}</p>
              <dl className="meta-grid mini">
                <div>
                  <dt>{t('date')}</dt>
                  <dd>{formatDateTime(tournament.startsAt, language)}</dd>
                </div>
                <div>
                  <dt>{t('prizes')}</dt>
                  <dd>{tournament.prizePool}</dd>
                </div>
                <div>
                  <dt>{t('slots')}</dt>
                  <dd>{fillCounter(tournament.registeredTeamsCount, tournament.maxTeamsCount)}</dd>
                </div>
              </dl>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};
