import { Link, useLoaderData } from 'react-router-dom';
import type { BracketSlotDTO, TournamentDetailDTO } from '../shared/api/contracts';
import { localizeTournament } from '../shared/lib/contentLocalization';
import { fillCounter, formatDateTime } from '../shared/lib/format';
import { useSession } from '../app/SessionContext';

export const TournamentDetailPage = () => {
  const tournament = useLoaderData() as TournamentDetailDTO;
  const { role, user, t, language } = useSession();
  const localizedTournament = localizeTournament(tournament, language);
  const isGuest = role === 'guest';
  const needsTelegramConfirmation = !isGuest && user?.telegramConfirmed === false;
  const statusLabels = {
    upcoming: t('statusUpcoming'),
    live: t('statusLive'),
    finished: t('statusFinished')
  };
  const slotStateLabels = {
    empty: t('slotStateEmpty'),
    pending_members: t('slotStatePendingMembers'),
    pending_admin: t('slotStatePendingAdmin'),
    approved: t('slotStateApproved'),
    live: t('slotStateLive'),
    finished: t('slotStateFinished')
  };
  const myApplication = localizedTournament.myApplication;
  const hasActiveApplication = Boolean(myApplication && myApplication.status !== 'rejected');
  const applicationStateLabels = {
    draft: 'Draft',
    pending_members: t('slotStatePendingMembers'),
    pending_admin: t('slotStatePendingAdmin'),
    approved: t('slotStateApproved'),
    rejected: t('statusFinished')
  };

  return (
    <div className="stack-xl">
      <section className="detail-hero">
        <img src={localizedTournament.imageUrl} alt="" />
        <div className="detail-hero__overlay" />
        <div className="detail-hero__content">
          <div className="card-topline">
            <span className={`status-pill ${localizedTournament.status}`}>{statusLabels[localizedTournament.status]}</span>
            <span>{localizedTournament.boFormat}</span>
            <span>{fillCounter(localizedTournament.registeredTeamsCount, localizedTournament.maxTeamsCount)}</span>
          </div>
          <h1>{localizedTournament.title}</h1>
          <p>{localizedTournament.description}</p>
          <dl className="meta-grid">
            <div>
              <dt>{t('date')}</dt>
              <dd>{formatDateTime(localizedTournament.startsAt, language)}</dd>
            </div>
            <div>
              <dt>{t('prizePool')}</dt>
              <dd>{localizedTournament.prizePool}</dd>
            </div>
            <div>
              <dt>{t('format')}</dt>
              <dd>{localizedTournament.boFormat}</dd>
            </div>
            <div>
              <dt>{t('teams')}</dt>
              <dd>{fillCounter(localizedTournament.registeredTeamsCount, localizedTournament.maxTeamsCount)}</dd>
            </div>
          </dl>
          <div className="hero-actions">
            {localizedTournament.links.map((link) => (
              <a className="button ghost light" key={link.url} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <StatusPanel
        tournament={localizedTournament}
        hasActiveApplication={hasActiveApplication}
        applicationStateLabel={myApplication ? applicationStateLabels[myApplication.status] : null}
        isGuest={isGuest}
        needsTelegramConfirmation={needsTelegramConfirmation}
      />

      <section className="content-grid">
        <div className="panel">
          <div className="section-head inline">
            <div>
              <p className="eyebrow">{t('bracket')}</p>
              <h2>{t('tournamentBracket')}</h2>
            </div>
            <span className="subtle">{t('tournamentLegend')}</span>
          </div>
          <BracketGrid
            isGuest={isGuest}
            needsTelegramConfirmation={needsTelegramConfirmation}
            slots={localizedTournament.bracket}
            tournamentSlug={localizedTournament.slug}
            canApply={localizedTournament.canApply}
            hasActiveApplication={hasActiveApplication}
            slotStateLabels={slotStateLabels}
          />
        </div>

        <aside className="panel side-panel" id="rules">
          <p className="eyebrow">{t('rules')}</p>
          <h2>{t('rulebook')}</h2>
          <ul className="check-list">
            {localizedTournament.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
};

const StatusPanel = ({
  tournament,
  hasActiveApplication,
  applicationStateLabel,
  isGuest,
  needsTelegramConfirmation
}: {
  tournament: TournamentDetailDTO;
  hasActiveApplication: boolean;
  applicationStateLabel: string | null;
  isGuest: boolean;
  needsTelegramConfirmation: boolean;
}) => {
  const { t } = useSession();

  if (tournament.status === 'finished') {
    return (
      <section className="status-panel finished">
        <div>
          <p className="eyebrow">{t('statusFinished')}</p>
          <h2>
            {t('winner')}: {tournament.winnerTeam}
          </h2>
          <p>
            {t('finalScore')}: {tournament.finalScore}
          </p>
        </div>
        <MatchList title={t('completedSeries')} matches={tournament.completedMatches} />
      </section>
    );
  }

  if (tournament.status === 'live') {
    return (
      <section className="status-panel live">
        <div>
          <p className="eyebrow">{t('statusLive')}</p>
          <h2>{tournament.currentMatch?.title ?? t('currentMatch')}</h2>
          <p>
            {tournament.currentMatch?.teamA} vs {tournament.currentMatch?.teamB} · {t('score')} {tournament.currentMatch?.score}
          </p>
          <div className="hero-actions">
            {tournament.streamLinks.map((link) => (
              <a className="button primary" key={link.url} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <MatchList title={t('liveMatches')} matches={tournament.liveMatches} />
      </section>
    );
  }

  return (
    <section className="status-panel upcoming">
      <div>
        <p className="eyebrow">{t('registration')}</p>
        <h2>{t('openSlotsTitle')}</h2>
        <p>{t('openSlotsText')}</p>
      </div>
      {hasActiveApplication && tournament.myApplication ? (
        <div className="stack-xl">
          <p className="eyebrow">{t('myApplicationTitle')}</p>
          <p>{t('myApplicationWaiting')}</p>
          <p>
            {t('myApplicationSlot')}: {tournament.myApplication.slotNo}
          </p>
          <p>
            {t('myApplicationStatus')}: {applicationStateLabel}
          </p>
        </div>
      ) : (
        <Link
          className="button primary"
          to={
            needsTelegramConfirmation
              ? '/profile'
              : isGuest
                ? `/auth/login?returnTo=${encodeURIComponent(`/tournaments/${tournament.slug}/apply/3`)}`
                : `/tournaments/${tournament.slug}/apply/3`
          }
        >
          {needsTelegramConfirmation ? t('confirmTelegramToApply') : isGuest ? t('loginToApply') : t('quickApply')}
        </Link>
      )}
    </section>
  );
};

const MatchList = ({ title, matches }: { title: string; matches: TournamentDetailDTO['liveMatches'] }) => {
  const { language } = useSession();

  return (
    <div className="match-list">
      <h3>{title}</h3>
      {matches.map((match) => (
        <article key={match.id}>
          <span>{match.title}</span>
          <strong>
            {match.teamA} {match.score} {match.teamB}
          </strong>
          <small>{formatDateTime(match.startsAt, language)}</small>
        </article>
      ))}
    </div>
  );
};

const BracketGrid = ({
  slots,
  tournamentSlug,
  canApply,
  hasActiveApplication,
  isGuest,
  needsTelegramConfirmation,
  slotStateLabels
}: {
  slots: BracketSlotDTO[];
  tournamentSlug: string;
  canApply: boolean;
  hasActiveApplication: boolean;
  isGuest: boolean;
  needsTelegramConfirmation: boolean;
  slotStateLabels: Record<BracketSlotDTO['state'], string>;
}) => (
  <BracketGridInner
    slots={slots}
    tournamentSlug={tournamentSlug}
    canApply={canApply}
    hasActiveApplication={hasActiveApplication}
    isGuest={isGuest}
    needsTelegramConfirmation={needsTelegramConfirmation}
    slotStateLabels={slotStateLabels}
  />
);

const BracketGridInner = ({
  slots,
  tournamentSlug,
  canApply,
  hasActiveApplication,
  isGuest,
  needsTelegramConfirmation,
  slotStateLabels
}: {
  slots: BracketSlotDTO[];
  tournamentSlug: string;
  canApply: boolean;
  hasActiveApplication: boolean;
  isGuest: boolean;
  needsTelegramConfirmation: boolean;
  slotStateLabels: Record<BracketSlotDTO['state'], string>;
}) => {
  const { t } = useSession();

  return (
    <div className="bracket-grid">
      {slots.map((slot) => (
        <article className={`slot-card ${slot.state}`} key={slot.slotNo}>
          <div className="slot-card__header">
            <span>{slot.seed}</span>
            <span>{slotStateLabels[slot.state]}</span>
          </div>
          <h3>{slot.teamName ?? `${t('slot')} ${slot.slotNo}`}</h3>
          {slot.members?.length ? <p>{slot.members.join(' · ')}</p> : <p>{t('rosterNotLocked')}</p>}
          {slot.score ? <strong className="slot-score">{slot.score}</strong> : null}
          {slot.state === 'empty' && canApply && !hasActiveApplication ? (
            needsTelegramConfirmation ? (
              <Link className="button ghost" to="/profile">
                {t('confirmTelegramToApply')}
              </Link>
            ) : isGuest ? (
              <Link
                className="button ghost"
                to={`/auth/login?returnTo=${encodeURIComponent(`/tournaments/${tournamentSlug}/apply/${slot.slotNo}`)}`}
              >
                {t('loginToApply')}
              </Link>
            ) : (
              <Link className="button primary" to={`/tournaments/${tournamentSlug}/apply/${slot.slotNo}`}>
                {t('apply')}
              </Link>
            )
          ) : null}
          {slot.state === 'empty' && canApply && hasActiveApplication && !isGuest && !needsTelegramConfirmation ? (
            <span className="subtle">{t('applicationAlreadySubmitted')}</span>
          ) : null}
        </article>
      ))}
    </div>
  );
};
