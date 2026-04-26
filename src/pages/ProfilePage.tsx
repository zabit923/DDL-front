import { ChangeEvent, FormEvent, useDeferredValue, useEffect, useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import { authRepository, profileRepository, usersRepository } from '../shared/api/repositories';
import type { ProfileDTO, TeamMemberStatus, UserDTO } from '../shared/api/contracts';
import { resolveAvatarUrl } from '../shared/lib/avatar';
import { formatDateTime } from '../shared/lib/format';

const memberStatusKeys: Record<TeamMemberStatus, 'teamStatusCaptain' | 'teamStatusActive' | 'teamStatusInvited'> = {
  captain: 'teamStatusCaptain',
  active: 'teamStatusActive',
  invited: 'teamStatusInvited'
};

const achievementKeys: Record<
  string,
  {
    title: 'achievementFirstWinTitle' | 'achievementTenWinsTitle' | 'achievementCaptainTitle';
    text: 'achievementFirstWinText' | 'achievementTenWinsText' | 'achievementCaptainText';
  }
> = {
  'first-win': { title: 'achievementFirstWinTitle', text: 'achievementFirstWinText' },
  'ten-wins': { title: 'achievementTenWinsTitle', text: 'achievementTenWinsText' },
  captain: { title: 'achievementCaptainTitle', text: 'achievementCaptainText' }
};

const formatTelegramInput = (value: string) => {
  const normalized = value.trim().replace(/^@+/, '');
  return normalized ? `@${normalized}` : '';
};

export const ProfilePage = () => {
  const { setRole, setAuthenticatedUser, refreshUnread, t, language } = useSession();
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [username, setUsername] = useState('');
  const [telegram, setTelegram] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [inviteQuery, setInviteQuery] = useState('');
  const [suggestions, setSuggestions] = useState<UserDTO[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredInviteQuery = useDeferredValue(inviteQuery);
  const avatarInputId = 'profile-avatar-input';

  const applyProfile = (nextProfile: ProfileDTO) => {
    setProfile(nextProfile);
    setUsername(nextProfile.user.username);
    setTelegram(nextProfile.user.telegram);
    setAvatarUrl(nextProfile.user.avatarUrl ?? '');
    setTeamName(nextProfile.team?.name ?? '');
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError(t('avatarFileOnlyImages'));
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError(t('avatarFileTooLarge'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        setError(t('avatarLoadFailed'));
        return;
      }
      setError('');
      setAvatarFile(file);
      setAvatarUrl(result);
    };
    reader.onerror = () => setError(t('avatarLoadFailed'));
    reader.readAsDataURL(file);
  };

  const runProfileAction = (action: () => Promise<ProfileDTO>, successMessage: string) => {
    setError('');
    setMessage('');
    startTransition(() => {
      void action()
        .then((nextProfile) => {
          applyProfile(nextProfile);
          setAuthenticatedUser(nextProfile.user);
          setAvatarFile(null);
          refreshUnread();
          setMessage(successMessage);
        })
        .catch((actionError: unknown) => {
          setError(actionError instanceof Error ? actionError.message : t('profileActionError'));
        });
    });
  };

  useEffect(() => {
    let alive = true;
    void profileRepository.get().then((nextProfile) => {
      if (alive) {
        applyProfile(nextProfile);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const query = deferredInviteQuery.trim();
    if (!query || !profile?.team || !profile.user.telegramConfirmed) {
      setSuggestions([]);
      return;
    }

    let alive = true;
    const timer = window.setTimeout(() => {
      void usersRepository.search(query).then((items) => {
        if (alive) {
          setSuggestions(items.filter((item) => !profile.team?.members.some((member) => member.userId === item.id)));
        }
      });
    }, 160);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [deferredInviteQuery, profile?.team]);

  if (!profile) {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">{t('profile')}</p>
        <h1>{t('loading')}</h1>
      </section>
    );
  }

  const isCaptain = profile.team?.captainId === profile.user.id;
  const needsTelegramConfirmation = !profile.user.telegramConfirmed;
  const rosterCount = profile.team?.members.length ?? 0;
  const rosterReady = rosterCount === 6;
  const unlockedAchievements = profile.achievements.filter((achievement) => achievement.unlocked).length;
  const pendingInvites = profile.pendingInvites ?? [];

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runProfileAction(
      async () => {
        const uploadedAvatar = avatarFile ? await profileRepository.uploadAvatar(avatarFile) : null;
        return profileRepository.updateUser({
          username,
          telegram,
          avatarUrl: uploadedAvatar?.avatarUrl ?? avatarUrl
        });
      },
      t('profileSaved')
    );
  };

  const createTeam = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runProfileAction(
      () => profileRepository.createTeam(newTeamName),
      t('teamCreated')
    );
    setNewTeamName('');
  };

  const renameTeam = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile.team) {
      return;
    }

    runProfileAction(
      () => profileRepository.renameTeam(profile.team!.id, teamName),
      t('teamRenamed')
    );
  };

  const inviteMember = (usernameToInvite = inviteQuery) => {
    if (!profile.team) {
      return;
    }

    runProfileAction(
      () => profileRepository.inviteMember(profile.team!.id, usernameToInvite),
      t('inviteSent')
    );
    setInviteQuery('');
    setSuggestions([]);
  };

  const removeMember = (userId: string) => {
    if (!profile.team) {
      return;
    }

    runProfileAction(
      () => profileRepository.removeMember(profile.team!.id, userId),
      t('memberRemoved')
    );
  };

  const acceptInvite = (inviteId: string) => {
    runProfileAction(
      () => profileRepository.acceptInvite(inviteId),
      t('inviteAccepted')
    );
  };

  const declineInvite = (inviteId: string) => {
    runProfileAction(
      () => profileRepository.declineInvite(inviteId),
      t('inviteDeclined')
    );
  };

  const logout = () => {
    void authRepository.logout().finally(() => setRole('guest'));
  };

  return (
    <div className="stack-xl">
      <section className="profile-hero">
        <div className="profile-hero__identity">
          <div className="profile-avatar-xl">
            <div className="profile-avatar-xl__image">
              <img src={resolveAvatarUrl(avatarUrl || profile.user.avatarUrl)} alt="" />
            </div>
            <label className="avatar-edit-button" htmlFor={avatarInputId} title={t('changeAvatar')}>
              <svg className="avatar-edit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 20l4.2-1 9.7-9.7a1.8 1.8 0 0 0 0-2.5l-.7-.7a1.8 1.8 0 0 0-2.5 0L5 15.8 4 20z" />
                <path d="M13.6 7.4l3 3" />
              </svg>
            </label>
            <input id={avatarInputId} className="sr-only-input" accept="image/*" type="file" onChange={handleAvatarUpload} />
          </div>
          <div>
            <p className="eyebrow">{t('profile')}</p>
            <h1>{profile.user.username}</h1>
            <p>
              {profile.user.telegram} · {profile.user.telegramConfirmed ? t('telegramConfirmed') : t('telegramConfirmationWaiting')}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <article>
            <strong>{profile.team?.totalWins ?? 0}</strong>
            <span>{t('teamTotalWins')}</span>
          </article>
          <article>
            <strong>{rosterCount}/6</strong>
            <span>{t('teamRoster')}</span>
          </article>
          <article>
            <strong>{unlockedAchievements}/{profile.achievements.length}</strong>
            <span>{t('achievements')}</span>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <div className="stack-xl">
          <section className="panel profile-panel">
            <div className="section-head inline">
              <div>
                <p className="eyebrow">{t('accountData')}</p>
                <h2>{t('editProfile')}</h2>
              </div>
            </div>

            <form className="form-panel" onSubmit={submitProfile}>
              <div className="form-grid">
                <label className="field">
                  <span>Username</span>
                  <input value={username} onChange={(event) => setUsername(event.target.value)} />
                </label>
                <label className="field">
                  <span>Telegram</span>
                  <input
                    value={telegram}
                    onChange={(event) => setTelegram(formatTelegramInput(event.target.value))}
                    onFocus={() => setTelegram((current) => current || '@')}
                    placeholder="@nickname"
                  />
                </label>
              </div>
              <p className="subtle">{t('telegramChangeRequiresConfirmation')}</p>
              <p className="subtle">{t('changeAvatarHint')}</p>
              <button className="button primary" disabled={isPending} type="submit">
                {t('saveProfile')}
              </button>
            </form>
          </section>

          {!needsTelegramConfirmation ? (
            <>
          <section className="panel profile-panel">
            <div className="section-head inline">
              <div>
                <p className="eyebrow">{t('incomingInvites')}</p>
                <h2>{t('incomingInvites')}</h2>
              </div>
            </div>

            {pendingInvites.length > 0 ? (
              <div className="team-list">
                {pendingInvites.map((invite) => (
                  <article key={invite.inviteId}>
                    <div>
                      <strong>
                        {t('inviteFromTeam')}: {invite.teamName}
                      </strong>
                      <span>
                        {t('invitedBy')}: {invite.invitedByUsername} • {formatDateTime(invite.createdAt, language)}
                      </span>
                    </div>
                    <div className="form-actions">
                      <button className="button primary" disabled={isPending} type="button" onClick={() => acceptInvite(invite.inviteId)}>
                        {t('acceptInvite')}
                      </button>
                      <button className="button ghost" disabled={isPending} type="button" onClick={() => declineInvite(invite.inviteId)}>
                        {t('declineInvite')}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="subtle">{t('incomingInvitesText')}</p>
            )}
          </section>

          <section className="panel profile-panel">
            <div className="section-head inline">
              <div>
                <p className="eyebrow">{t('team')}</p>
                <h2>{profile.team ? profile.team.name : t('noTeamTitle')}</h2>
              </div>
              {profile.team ? <span className={rosterReady ? 'status-pill upcoming' : 'status-pill'}>{rosterReady ? t('readyToApply') : t('needsRoster')}</span> : null}
            </div>

            {!profile.team ? (
              <form className="form-panel" onSubmit={createTeam}>
                <p>{t('noTeamText')}</p>
                <label className="field">
                  <span>{t('teamName')}</span>
                  <input value={newTeamName} onChange={(event) => setNewTeamName(event.target.value)} placeholder="Metro Haze" />
                </label>
                <button className="button primary" disabled={isPending} type="submit">
                  {t('createTeam')}
                </button>
              </form>
            ) : (
              <div className="stack-xl">
                {isCaptain ? (
                  <form className="form-panel" onSubmit={renameTeam}>
                    <label className="field">
                      <span>{t('teamName')}</span>
                      <input value={teamName} onChange={(event) => setTeamName(event.target.value)} />
                    </label>
                    <button className="button ghost" disabled={isPending} type="submit">
                      {t('renameTeam')}
                    </button>
                  </form>
                ) : null}

                {isCaptain && profile.team.members.length < 6 ? (
                  <div className="form-panel">
                    <label className="field">
                      <span>{t('invitePlayer')}</span>
                      <input
                        value={inviteQuery}
                        onChange={(event) => setInviteQuery(event.target.value)}
                        placeholder={t('playerUsername')}
                      />
                    </label>
                    {suggestions.length > 0 ? (
                      <div className="suggestions inline-suggestions">
                        {suggestions.map((suggestion) => (
                          <button key={suggestion.id} type="button" onClick={() => inviteMember(suggestion.username)}>
                            {suggestion.username}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <button className="button primary" disabled={isPending || !inviteQuery.trim()} type="button" onClick={() => inviteMember()}>
                      {t('sendInvite')}
                    </button>
                  </div>
                ) : null}

                <div className="team-list">
                  {profile.team.members.map((member) => (
                    <article key={member.userId}>
                      <div>
                        <strong>{member.username}</strong>
                        <span>{t(memberStatusKeys[member.status])}</span>
                      </div>
                      {isCaptain && member.userId !== profile.user.id ? (
                        <button className="button ghost" disabled={isPending} type="button" onClick={() => removeMember(member.userId)}>
                          {t('remove')}
                        </button>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
            </>
          ) : null}
        </div>

        <aside className="side-panel">
          <section className="panel profile-panel">
            <p className="eyebrow">{t('achievements')}</p>
            <h2>{t('personalAchievements')}</h2>
            <div className="achievement-list">
              {profile.achievements.map((achievement) => (
                <article className={achievement.unlocked ? 'unlocked' : undefined} key={achievement.id}>
                  <strong>{achievementKeys[achievement.id] ? t(achievementKeys[achievement.id].title) : achievement.title}</strong>
                  <p>{achievementKeys[achievement.id] ? t(achievementKeys[achievement.id].text) : achievement.description}</p>
                  <span>
                    {achievement.unlocked && achievement.unlockedAt
                      ? formatDateTime(achievement.unlockedAt, language)
                      : t('locked')}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel profile-panel">
            <p className="eyebrow">{t('session')}</p>
            <h2>{t('profileActions')}</h2>
            <div className="form-actions">
              <Link className="button ghost" to="/tournaments">
                {t('navTournaments')}
              </Link>
              <button className="button primary" type="button" onClick={logout}>
                {t('logout')}
              </button>
            </div>
          </section>
        </aside>
      </section>

      {message ? <p className="notice">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
};
