import { useEffect, useOptimistic, useState, useTransition } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import { applicationsRepository, profileRepository } from '../shared/api/repositories';
import type { ProfileDTO, TeamMemberStatus, TournamentDetailDTO } from '../shared/api/contracts';
import { localizeTournament } from '../shared/lib/contentLocalization';

interface ApplicationLoaderData {
  tournament: TournamentDetailDTO;
  slotNo: number;
}

interface OptimisticSubmission {
  teamName: string;
  members: string[];
}

const memberStatusKeys: Record<TeamMemberStatus, 'teamStatusCaptain' | 'teamStatusActive' | 'teamStatusInvited'> = {
  captain: 'teamStatusCaptain',
  active: 'teamStatusActive',
  invited: 'teamStatusInvited'
};

export const ApplicationPage = () => {
  const { tournament, slotNo } = useLoaderData() as ApplicationLoaderData;
  const { role, user, refreshUnread, t, language } = useSession();
  const localizedTournament = localizeTournament(tournament, language);
  const slot = localizedTournament.bracket.find((item) => item.slotNo === slotNo);
  const needsTelegramConfirmation = role !== 'guest' && user?.telegramConfirmed === false;
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optimisticSubmission, addOptimisticSubmission] = useOptimistic<
    OptimisticSubmission | null,
    OptimisticSubmission
  >(null, (_current, next) => next);

  useEffect(() => {
    if (role === 'guest' || needsTelegramConfirmation) {
      return;
    }

    let alive = true;
    void profileRepository.get().then((nextProfile) => {
      if (alive) {
        setProfile(nextProfile);
      }
    });

    return () => {
      alive = false;
    };
  }, [role, needsTelegramConfirmation]);

  if (role === 'guest') {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">{t('authRequired')}</p>
        <h1>{t('applyAfterLogin')}</h1>
        <p>{t('applyAfterLoginText')}</p>
        <Link
          className="button primary"
          to={`/auth/login?returnTo=${encodeURIComponent(`/tournaments/${localizedTournament.slug}/apply/${slotNo}`)}`}
        >
          {t('login')}
        </Link>
      </section>
    );
  }

  if (needsTelegramConfirmation) {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">{t('telegramConfirmationEyebrow')}</p>
        <h1>{t('telegramConfirmationTitle')}</h1>
        <p>{t('telegramRequiredForActionsText')}</p>
        <Link className="button primary" to="/profile">
          {t('confirmTelegramToApply')}
        </Link>
      </section>
    );
  }

  if (!slot || slot.state !== 'empty') {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">{t('slotUnavailable')}</p>
        <h1>{t('slotUnavailable')}</h1>
        <p>{t('slotUnavailableText')}</p>
        <Link className="button primary" to={`/tournaments/${localizedTournament.slug}`}>
          {t('backToBracket')}
        </Link>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">{t('teamApplication')}</p>
        <h1>{t('loading')}</h1>
      </section>
    );
  }

  if (!profile.team) {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">{t('teamApplication')}</p>
        <h1>{t('createTeamFirstTitle')}</h1>
        <p>{t('createTeamFirstText')}</p>
        <Link className="button primary" to="/profile">
          {t('openProfile')}
        </Link>
      </section>
    );
  }

  const teamMembers = profile.team.members.map((member) => member.username);
  const rosterReady =
    profile.team.members.length === 6 &&
    profile.team.members.every((member) => member.status === 'captain' || member.status === 'active');

  const handleSubmit = () => {
    if (!profile.team || !rosterReady) {
      setError(t('teamRosterRequired'));
      return;
    }

    setError('');
    setIsSubmitting(true);

    startTransition(() => {
      addOptimisticSubmission({ teamName: profile.team!.name, members: teamMembers });
      void applicationsRepository
        .submit(localizedTournament.slug, { slotNo, teamId: profile.team!.id })
        .then(() => {
          refreshUnread();
          navigate(`/tournaments/${localizedTournament.slug}`);
        })
        .catch((submissionError: unknown) => {
          setError(submissionError instanceof Error ? submissionError.message : t('applicationSubmitError'));
          setIsSubmitting(false);
        });
    });
  };

  return (
    <div className="stack-xl">
      <section className="page-hero compact">
        <p className="eyebrow">{t('teamApplication')}</p>
        <h1>
          {t('applyTo')} {localizedTournament.title}, {t('slot')} {slot.seed}
        </h1>
        <p>{t('teamApplicationText')}</p>
      </section>

      <section className="application-layout">
        <div className="panel form-panel">
          <div className="section-head inline">
            <div>
              <p className="eyebrow">{t('team')}</p>
              <h2>{profile.team.name}</h2>
            </div>
            <span className={rosterReady ? 'status-pill upcoming' : 'status-pill'}>
              {rosterReady ? t('readyToApply') : t('needsRoster')}
            </span>
          </div>

          <div className="member-grid">
            {profile.team.members.map((member) => (
              <article className={member.status === 'captain' ? 'member-card captain' : 'member-card'} key={member.userId}>
                <strong>{member.username}</strong>
                <span>{t(memberStatusKeys[member.status])}</span>
              </article>
            ))}
          </div>

          {!rosterReady ? (
            <p className="notice">{t('teamRosterRequired')}</p>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <Link className="button ghost" to={`/tournaments/${localizedTournament.slug}`}>
              {t('cancel')}
            </Link>
            <Link className="button ghost" to="/profile">
              {t('manageTeam')}
            </Link>
            <button className="button primary" disabled={isSubmitting || isPending || !rosterReady} type="button" onClick={handleSubmit}>
              {isSubmitting ? t('submitting') : t('submitApplication')}
            </button>
          </div>
        </div>

        <aside className="panel side-panel">
          <p className="eyebrow">{t('preview')}</p>
          <h2>{optimisticSubmission?.teamName || profile.team.name}</h2>
          <p>{t('applicationPreviewText')}</p>
          <ul className="check-list">
            {(optimisticSubmission?.members ?? teamMembers).map((member, index) => (
              <li key={`${member}-${index}`}>{member || `${t('player')} ${index + 1}`}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
};
