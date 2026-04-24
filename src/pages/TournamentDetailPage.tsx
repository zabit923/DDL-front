import { Link, useLoaderData } from 'react-router-dom';
import type { BracketSlotDTO, TournamentDetailDTO } from '../shared/api/contracts';
import { fillCounter, formatDateTime, slotStateLabels, statusLabels } from '../shared/lib/format';
import { useSession } from '../app/SessionContext';

export const TournamentDetailPage = () => {
  const tournament = useLoaderData() as TournamentDetailDTO;
  const { role } = useSession();

  return (
    <div className="stack-xl">
      <section className="detail-hero">
        <img src={tournament.imageUrl} alt="" />
        <div className="detail-hero__overlay" />
        <div className="detail-hero__content">
          <div className="card-topline">
            <span className={`status-pill ${tournament.status}`}>{statusLabels[tournament.status]}</span>
            <span>{tournament.boFormat}</span>
            <span>{fillCounter(tournament.registeredTeamsCount, tournament.maxTeamsCount)}</span>
          </div>
          <h1>{tournament.title}</h1>
          <p>{tournament.description}</p>
          <dl className="meta-grid">
            <div>
              <dt>Дата</dt>
              <dd>{formatDateTime(tournament.startsAt)}</dd>
            </div>
            <div>
              <dt>Призовой фонд</dt>
              <dd>{tournament.prizePool}</dd>
            </div>
            <div>
              <dt>Формат</dt>
              <dd>{tournament.boFormat}</dd>
            </div>
            <div>
              <dt>Команды</dt>
              <dd>{fillCounter(tournament.registeredTeamsCount, tournament.maxTeamsCount)}</dd>
            </div>
          </dl>
          <div className="hero-actions">
            {tournament.links.map((link) => (
              <a className="button ghost light" key={link.url} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <StatusPanel tournament={tournament} />

      <section className="content-grid">
        <div className="panel">
          <div className="section-head inline">
            <div>
              <p className="eyebrow">Bracket</p>
              <h2>Турнирная сетка</h2>
            </div>
            <span className="subtle">empty / pending / approved / live / finished</span>
          </div>
          <BracketGrid role={role} slots={tournament.bracket} tournamentSlug={tournament.slug} canApply={tournament.canApply} />
        </div>

        <aside className="panel side-panel" id="rules">
          <p className="eyebrow">Rules</p>
          <h2>Регламент</h2>
          <ul className="check-list">
            {tournament.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
};

const StatusPanel = ({ tournament }: { tournament: TournamentDetailDTO }) => {
  if (tournament.status === 'finished') {
    return (
      <section className="status-panel finished">
        <div>
          <p className="eyebrow">Finished</p>
          <h2>Победитель: {tournament.winnerTeam}</h2>
          <p>Финальный счет: {tournament.finalScore}</p>
        </div>
        <MatchList title="Завершенные серии" matches={tournament.completedMatches} />
      </section>
    );
  }

  if (tournament.status === 'live') {
    return (
      <section className="status-panel live">
        <div>
          <p className="eyebrow">Live now</p>
          <h2>{tournament.currentMatch?.title ?? 'Текущий матч'}</h2>
          <p>
            {tournament.currentMatch?.teamA} vs {tournament.currentMatch?.teamB} · счет {tournament.currentMatch?.score}
          </p>
          <div className="hero-actions">
            {tournament.streamLinks.map((link) => (
              <a className="button primary" key={link.url} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <MatchList title="Live-матчи" matches={tournament.liveMatches} />
      </section>
    );
  }

  return (
    <section className="status-panel upcoming">
      <div>
        <p className="eyebrow">Registration</p>
        <h2>Свободные слоты кликабельны</h2>
        <p>
          После отправки заявки команда появится в сетке сразу, но со статусом ожидания подтверждений и решения организатора.
        </p>
      </div>
      <Link className="button primary" to={`/tournaments/${tournament.slug}/apply/3`}>
        Быстрая заявка
      </Link>
    </section>
  );
};

const MatchList = ({ title, matches }: { title: string; matches: TournamentDetailDTO['liveMatches'] }) => (
  <div className="match-list">
    <h3>{title}</h3>
    {matches.map((match) => (
      <article key={match.id}>
        <span>{match.title}</span>
        <strong>
          {match.teamA} {match.score} {match.teamB}
        </strong>
        <small>{formatDateTime(match.startsAt)}</small>
      </article>
    ))}
  </div>
);

const BracketGrid = ({
  slots,
  tournamentSlug,
  canApply,
  role
}: {
  slots: BracketSlotDTO[];
  tournamentSlug: string;
  canApply: boolean;
  role: string;
}) => (
  <div className="bracket-grid">
    {slots.map((slot) => (
      <article className={`slot-card ${slot.state}`} key={slot.slotNo}>
        <div className="slot-card__header">
          <span>{slot.seed}</span>
          <span>{slotStateLabels[slot.state]}</span>
        </div>
        <h3>{slot.teamName ?? `Слот ${slot.slotNo}`}</h3>
        {slot.members?.length ? <p>{slot.members.join(' · ')}</p> : <p>Состав еще не закреплен.</p>}
        {slot.score ? <strong className="slot-score">{slot.score}</strong> : null}
        {slot.state === 'empty' && canApply ? (
          role === 'guest' ? (
            <Link
              className="button ghost"
              to={`/auth/login?returnTo=${encodeURIComponent(`/tournaments/${tournamentSlug}/apply/${slot.slotNo}`)}`}
            >
              Войти для заявки
            </Link>
          ) : (
            <Link className="button primary" to={`/tournaments/${tournamentSlug}/apply/${slot.slotNo}`}>
              Подать заявку
            </Link>
          )
        ) : null}
      </article>
    ))}
  </div>
);
