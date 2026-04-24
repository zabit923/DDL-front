import { Link, useLoaderData } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import type { NewsDTO, TournamentDetailDTO } from '../shared/api/contracts';
import { fillCounter, formatDateTime } from '../shared/lib/format';

interface HomeLoaderData {
  featuredTournament: TournamentDetailDTO;
  latestNews: NewsDTO[];
  counters: {
    tournaments: number;
    users: number;
    applications: number;
  };
}

export const HomePage = () => {
  const { featuredTournament, latestNews, counters } = useLoaderData() as HomeLoaderData;
  const { t, language } = useSession();
  const statusLabels = {
    upcoming: t('statusUpcoming'),
    live: t('statusLive'),
    finished: t('statusFinished')
  };

  return (
    <div className="stack-xl">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">{t('mvpMode')}</p>
          <h1>{t('homeTitle')}</h1>
          <p>{t('homeText')}</p>
          <div className="hero-actions">
            <Link className="button primary" to="/tournaments">
              {t('watchTournaments')}
            </Link>
            <Link className="button ghost" to="/auth/register">
              {t('register')}
            </Link>
          </div>
        </div>

        <Link className="featured-card" to={`/tournaments/${featuredTournament.slug}`}>
          <img src={featuredTournament.imageUrl} alt="" />
          <div className="featured-card__content">
            <span className={`status-pill ${featuredTournament.status}`}>{statusLabels[featuredTournament.status]}</span>
            <h2>{featuredTournament.title}</h2>
            <dl className="meta-grid">
              <div>
                <dt>{t('date')}</dt>
                <dd>{formatDateTime(featuredTournament.startsAt, language)}</dd>
              </div>
              <div>
                <dt>{t('format')}</dt>
                <dd>{featuredTournament.boFormat}</dd>
              </div>
              <div>
                <dt>{t('prizePool')}</dt>
                <dd>{featuredTournament.prizePool}</dd>
              </div>
              <div>
                <dt>{t('teams')}</dt>
                <dd>{fillCounter(featuredTournament.registeredTeamsCount, featuredTournament.maxTeamsCount)}</dd>
              </div>
            </dl>
          </div>
        </Link>
      </section>

      <section className="metric-strip" aria-label="Метрики мокового состояния">
        <article>
          <strong>{counters.tournaments}</strong>
          <span>{t('tournamentsInCatalog')}</span>
        </article>
        <article>
          <strong>{counters.users}</strong>
          <span>{t('playersForAutocomplete')}</span>
        </article>
        <article>
          <strong>{counters.applications}</strong>
          <span>{t('applicationInProgress')}</span>
        </article>
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">{t('navNews')}</p>
          <h2>{t('latestNews')}</h2>
        </div>
        <Link className="text-link" to="/news">
          {t('allNews')}
        </Link>
      </section>

      <div className="news-grid">
        {latestNews.map((item) => (
          <Link className="news-card" key={item.id} to={`/news/${item.slug}`}>
            <img src={item.imageUrl} alt="" />
            <span>{formatDateTime(item.publishedAt, language)}</span>
            <h3>{item.title}</h3>
            <p>{item.teaser}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
