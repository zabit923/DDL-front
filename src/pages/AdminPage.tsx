import { ChangeEvent, FormEvent, useEffect, useMemo, useState, useTransition } from 'react';
import { useSession } from '../app/SessionContext';
import { adminRepository, newsRepository, tournamentsRepository } from '../shared/api/repositories';
import type {
  AdminNewsCreateRequestDTO,
  AdminTournamentCreateRequestDTO,
  AdminTournamentLinkPayloadDTO,
  AdminTournamentRulePayloadDTO,
  AdminUserDTO,
  ApplicationDTO,
  ApplicationStatus,
  BoFormat,
  MatchStatus,
  NewsDTO,
  TournamentDetailDTO,
  TournamentLinkKind,
  TournamentStatus,
} from '../shared/api/contracts';
import { localizeNews, localizeTournament } from '../shared/lib/contentLocalization';
import { applicationStatusLabels, formatDateTime, slugify } from '../shared/lib/format';

type AdminTab = 'applications' | 'users' | 'news' | 'tournaments';
type StatusFilter = ApplicationStatus | 'all';

type NewsFormState = {
  slug: string;
  title: string;
  teaser: string;
  body: string;
  imageUrl: string;
  imageFile: File | null;
  imagePreviewUrl: string;
  publishedAt: string;
  ruTitle: string;
  ruTeaser: string;
  ruBody: string;
};

type TournamentFormState = {
  slug: string;
  title: string;
  status: TournamentStatus;
  boFormat: BoFormat;
  startsAt: string;
  prizePool: string;
  imageUrl: string;
  imageFile: File | null;
  imagePreviewUrl: string;
  maxTeamsCount: string;
  description: string;
  canApply: boolean;
  winnerTeam: string;
  finalScore: string;
  ruTitle: string;
  ruDescription: string;
  ruPrizePool: string;
  rulesText: string;
  ruRulesText: string;
  linksText: string;
  matchesText: string;
};

const adminCopy = {
  ru: {
    eyebrow: 'Admin cockpit',
    title: 'Управление лигой',
    text: 'Модерация заявок, новости и турниры в одном интерфейсе. Ручки требуют роль admin или organizer.',
    applications: 'Заявки',
    users: 'Пользователи',
    news: 'Новости',
    tournaments: 'Турниры',
    refresh: 'Обновить',
    all: 'Все',
    approve: 'Одобрить',
    reject: 'Отклонить',
    reason: 'Причина отклонения',
    noApplications: 'Заявок по выбранному фильтру нет.',
    searchTeamsPlaceholder: 'Поиск по команде',
    team: 'Команда',
    slot: 'Слот',
    roster: 'Состав',
    status: 'Статус',
    username: 'Username',
    telegram: 'Telegram',
    telegramStatus: 'TG статус',
    role: 'Роль',
    deleteUserConfirm: 'Удалить пользователя {username}? Если он капитан, его команда тоже будет удалена.',
    created: 'Создана',
    searchUsersPlaceholder: 'Поиск по username или Telegram',
    noTeam: 'Без команды',
    noUsers: 'Пользователи не найдены.',
    newsEditor: 'Редактор новости',
    tournamentEditor: 'Редактор турнира',
    create: 'Создать',
    update: 'Сохранить',
    edit: 'Редактировать',
    delete: 'Удалить',
    cancel: 'Отмена',
    publishedAt: 'Дата публикации',
    startsAt: 'Дата старта',
    imageUrl: 'Изображение',
    imageRequired: 'Загрузите изображение.',
    imageFileOnlyImages: 'Можно загружать только изображения.',
    imageFileTooLarge: 'Файл слишком большой. Максимум 8 МБ.',
    imageLoadFailed: 'Не удалось прочитать изображение.',
    prizePool: 'Призовой фонд',
    maxTeams: 'Макс. команд',
    description: 'Описание',
    rules: 'Правила, по одному на строку',
    links: 'Ссылки: label | url | kind',
    matches: 'Матчи: title | teamA | teamB | score | startsAt | status | streamUrl',
    canApply: 'Принимает заявки',
    ruLocalization: 'RU локализация',
    noNews: 'Новостей пока нет.',
    noTournaments: 'Турниров пока нет.',
    saved: 'Изменения сохранены.',
    deleted: 'Удалено.',
    actionFailed: 'Не удалось выполнить действие.',
    autoSlots: 'При создании турнира слоты сетки будут созданы автоматически по числу команд.',
    editSlotsSafe: 'При редактировании существующие слоты не перезаписываются.',
    slugFromTitle: 'Сгенерировать slug'
  },
  en: {
    eyebrow: 'Admin cockpit',
    title: 'League control room',
    text: 'Moderate applications, news, and tournaments from one place. Endpoints require admin or organizer role.',
    applications: 'Applications',
    users: 'Users',
    news: 'News',
    tournaments: 'Tournaments',
    refresh: 'Refresh',
    all: 'All',
    approve: 'Approve',
    reject: 'Reject',
    reason: 'Reject reason',
    noApplications: 'No applications for this filter.',
    searchTeamsPlaceholder: 'Search by team',
    team: 'Team',
    slot: 'Slot',
    roster: 'Roster',
    status: 'Status',
    username: 'Username',
    telegram: 'Telegram',
    telegramStatus: 'TG status',
    role: 'Role',
    deleteUserConfirm: 'Delete user {username}? If they are a captain, their team will also be deleted.',
    created: 'Created',
    searchUsersPlaceholder: 'Search by username or Telegram',
    noTeam: 'No team',
    noUsers: 'No users found.',
    newsEditor: 'News editor',
    tournamentEditor: 'Tournament editor',
    create: 'Create',
    update: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    publishedAt: 'Published at',
    startsAt: 'Starts at',
    imageUrl: 'Image',
    imageRequired: 'Upload an image.',
    imageFileOnlyImages: 'Only image files are allowed.',
    imageFileTooLarge: 'File is too large. Maximum size is 8 MB.',
    imageLoadFailed: 'Failed to read the image file.',
    prizePool: 'Prize pool',
    maxTeams: 'Max teams',
    description: 'Description',
    rules: 'Rules, one per line',
    links: 'Links: label | url | kind',
    matches: 'Matches: title | teamA | teamB | score | startsAt | status | streamUrl',
    canApply: 'Accepts applications',
    ruLocalization: 'RU localization',
    noNews: 'No news yet.',
    noTournaments: 'No tournaments yet.',
    saved: 'Changes saved.',
    deleted: 'Deleted.',
    actionFailed: 'Action failed.',
    autoSlots: 'Tournament slots will be generated automatically from max teams on create.',
    editSlotsSafe: 'Existing slots are not overwritten during edit.',
    slugFromTitle: 'Generate slug'
  }
} as const;

const emptyNewsForm = (): NewsFormState => ({
  slug: '',
  title: '',
  teaser: '',
  body: '',
  imageUrl: '',
  imageFile: null,
  imagePreviewUrl: '',
  publishedAt: toDateTimeLocal(new Date().toISOString()),
  ruTitle: '',
  ruTeaser: '',
  ruBody: ''
});

const emptyTournamentForm = (): TournamentFormState => ({
  slug: '',
  title: '',
  status: 'upcoming',
  boFormat: 'BO3',
  startsAt: toDateTimeLocal(new Date().toISOString()),
  prizePool: '',
  imageUrl: '',
  imageFile: null,
  imagePreviewUrl: '',
  maxTeamsCount: '8',
  description: '',
  canApply: true,
  winnerTeam: '',
  finalScore: '',
  ruTitle: '',
  ruDescription: '',
  ruPrizePool: '',
  rulesText: '',
  ruRulesText: '',
  linksText: '',
  matchesText: ''
});

const statusFilters: StatusFilter[] = ['all', 'draft', 'pending_members', 'pending_admin', 'approved', 'rejected'];
const tournamentStatuses: TournamentStatus[] = ['upcoming', 'live', 'finished'];
const boFormats: BoFormat[] = ['BO1', 'BO3', 'BO5'];
const matchStatuses: MatchStatus[] = ['scheduled', 'live', 'finished'];
const maxAdminImageSizeBytes = 8 * 1024 * 1024;

export const AdminPage = () => {
  const { language } = useSession();
  const copy = adminCopy[language];
  const [activeTab, setActiveTab] = useState<AdminTab>('applications');
  const [applicationFilter, setApplicationFilter] = useState<StatusFilter>('all');
  const [applicationQuery, setApplicationQuery] = useState('');
  const [applications, setApplications] = useState<ApplicationDTO[]>([]);
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [teamQuery, setTeamQuery] = useState('');
  const [newsItems, setNewsItems] = useState<NewsDTO[]>([]);
  const [tournaments, setTournaments] = useState<TournamentDetailDTO[]>([]);
  const [newsForm, setNewsForm] = useState<NewsFormState>(() => emptyNewsForm());
  const [tournamentForm, setTournamentForm] = useState<TournamentFormState>(() => emptyTournamentForm());
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingTournamentId, setEditingTournamentId] = useState<string | null>(null);
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const localizedNews = useMemo(() => newsItems.map((item) => localizeNews(item, language)), [language, newsItems]);
  const localizedTournaments = useMemo(
    () => tournaments.map((item) => localizeTournament(item, language)),
    [language, tournaments]
  );

  const loadApplications = () => {
    void adminRepository
      .listApplications(applicationFilter, applicationQuery)
      .then(setApplications)
      .catch((loadError: unknown) => setError(resolveError(loadError, copy.actionFailed)));
  };

  const loadContent = () => {
    void Promise.all([newsRepository.list(), tournamentsRepository.list('all')])
      .then(([nextNews, nextTournaments]) => {
        setNewsItems(nextNews);
        setTournaments(nextTournaments);
      })
      .catch((loadError: unknown) => setError(resolveError(loadError, copy.actionFailed)));
  };

  const loadUsers = (query = userQuery) => {
    void adminRepository
      .listUsers(query, 200, teamQuery)
      .then(setUsers)
      .catch((loadError: unknown) => setError(resolveError(loadError, copy.actionFailed)));
  };

  useEffect(() => {
    if (activeTab !== 'applications') {
      return;
    }

    const timer = window.setTimeout(loadApplications, 220);
    return () => window.clearTimeout(timer);
  }, [activeTab, applicationFilter, applicationQuery]);
  useEffect(loadContent, []);
  useEffect(() => {
    if (activeTab !== 'users') {
      return;
    }

    const timer = window.setTimeout(() => loadUsers(userQuery), 220);
    return () => window.clearTimeout(timer);
  }, [activeTab, teamQuery, userQuery]);

  const runAction = (action: () => Promise<unknown>, successMessage: string = copy.saved) => {
    setError('');
    setMessage('');
    startTransition(() => {
      void action()
        .then(() => {
          setMessage(successMessage);
          loadApplications();
          loadContent();
        })
        .catch((actionError: unknown) => setError(resolveError(actionError, copy.actionFailed)));
    });
  };

  const deleteUser = (user: AdminUserDTO) => {
    if (!window.confirm(copy.deleteUserConfirm.replace('{username}', user.username))) {
      return;
    }

    setError('');
    setMessage('');
    startTransition(() => {
      void adminRepository
        .deleteUser(user.id)
        .then(() => {
          setMessage(copy.deleted);
          loadUsers();
          loadApplications();
        })
        .catch((actionError: unknown) => setError(resolveError(actionError, copy.actionFailed)));
    });
  };

  const renderUserCard = (userItem: AdminUserDTO) => (
    <article className="admin-card" key={userItem.id}>
      <div className="admin-card__main">
        <h3>{userItem.username}</h3>
        <dl className="meta-grid mini">
          <div>
            <dt>{copy.telegram}</dt>
            <dd>{userItem.telegram}</dd>
          </div>
          <div>
            <dt>{copy.telegramStatus}</dt>
            <dd>{userItem.telegramConfirmed ? 'confirmed' : 'pending'}</dd>
          </div>
          <div>
            <dt>{copy.role}</dt>
            <dd>{userItem.role}</dd>
          </div>
          <div>
            <dt>{copy.team}</dt>
            <dd>{userItem.teamName ?? copy.noTeam}</dd>
          </div>
        </dl>
      </div>
      <div className="admin-card__actions">
        <button className="button ghost" disabled={isPending} type="button" onClick={() => deleteUser(userItem)}>
          {copy.delete}
        </button>
      </div>
    </article>
  );

  const handleAdminImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    apply: (file: File, previewUrl: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError(copy.imageFileOnlyImages);
      return;
    }

    if (file.size > maxAdminImageSizeBytes) {
      setError(copy.imageFileTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!previewUrl) {
        setError(copy.imageLoadFailed);
        return;
      }

      setError('');
      apply(file, previewUrl);
    };
    reader.onerror = () => setError(copy.imageLoadFailed);
    reader.readAsDataURL(file);
  };

  const updateNewsTitle = (title: string) => {
    setNewsForm((current) => ({
      ...current,
      title,
      slug: shouldSyncSlug(current.slug, current.title) ? slugify(title) : current.slug
    }));
  };

  const updateTournamentTitle = (title: string) => {
    setTournamentForm((current) => ({
      ...current,
      title,
      slug: shouldSyncSlug(current.slug, current.title) ? slugify(title) : current.slug
    }));
  };

  const resolveNewsImageUrl = async () => {
    if (newsForm.imageFile) {
      return (await adminRepository.uploadImage(newsForm.imageFile)).imageUrl;
    }

    const existingUrl = newsForm.imageUrl.trim();
    if (existingUrl) {
      return existingUrl;
    }

    throw new Error(copy.imageRequired);
  };

  const resolveTournamentImageUrl = async () => {
    if (tournamentForm.imageFile) {
      return (await adminRepository.uploadImage(tournamentForm.imageFile)).imageUrl;
    }

    const existingUrl = tournamentForm.imageUrl.trim();
    if (existingUrl) {
      return existingUrl;
    }

    throw new Error(copy.imageRequired);
  };

  const submitNews = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAction(
      async () => {
        const imageUrl = await resolveNewsImageUrl();
        const payload = buildNewsPayload(newsForm, imageUrl);
        if (editingNewsId) {
          await adminRepository.updateNews(editingNewsId, payload);
        } else {
          await adminRepository.createNews(payload);
        }
        setNewsForm(emptyNewsForm());
        setEditingNewsId(null);
      },
      copy.saved
    );
  };

  const submitTournament = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAction(
      async () => {
        const imageUrl = await resolveTournamentImageUrl();
        if (editingTournamentId) {
          await adminRepository.updateTournament(editingTournamentId, buildTournamentUpdatePayload(tournamentForm, imageUrl));
        } else {
          await adminRepository.createTournament(buildTournamentCreatePayload(tournamentForm, imageUrl));
        }
        setTournamentForm(emptyTournamentForm());
        setEditingTournamentId(null);
      },
      copy.saved
    );
  };

  const editNews = (item: NewsDTO) => {
    setEditingNewsId(item.id);
    setActiveTab('news');
    setNewsForm({
      slug: item.slug,
      title: item.title,
      teaser: item.teaser,
      body: item.body,
      imageUrl: item.imageUrl,
      imageFile: null,
      imagePreviewUrl: item.imageUrl,
      publishedAt: toDateTimeLocal(item.publishedAt),
      ruTitle: item.localized?.ru?.title ?? '',
      ruTeaser: item.localized?.ru?.teaser ?? '',
      ruBody: item.localized?.ru?.body ?? ''
    });
  };

  const editTournament = (item: TournamentDetailDTO) => {
    setEditingTournamentId(item.id);
    setActiveTab('tournaments');
    setTournamentForm({
      slug: item.slug,
      title: item.title,
      status: item.status,
      boFormat: item.boFormat,
      startsAt: toDateTimeLocal(item.startsAt),
      prizePool: item.prizePool,
      imageUrl: item.imageUrl,
      imageFile: null,
      imagePreviewUrl: item.imageUrl,
      maxTeamsCount: String(item.maxTeamsCount),
      description: item.description,
      canApply: item.canApply,
      winnerTeam: item.winnerTeam ?? '',
      finalScore: item.finalScore ?? '',
      ruTitle: item.localized?.ru?.title ?? '',
      ruDescription: item.localized?.ru?.description ?? '',
      ruPrizePool: item.localized?.ru?.prizePool ?? '',
      rulesText: item.rules.join('\n'),
      ruRulesText: item.localized?.ru?.rules?.join('\n') ?? '',
      linksText: [...item.links, ...item.streamLinks]
        .map((link) => `${link.label} | ${link.url} | ${item.streamLinks.some((stream) => stream.url === link.url) ? 'stream' : 'link'}`)
        .join('\n'),
      matchesText: [...item.liveMatches, ...item.completedMatches]
        .map((match) => `${match.title} | ${match.teamA} | ${match.teamB} | ${match.score} | ${toDateTimeLocal(match.startsAt)} | ${match.status} | ${match.streamUrl ?? ''}`)
        .join('\n')
    });
  };

  return (
    <div className="stack-xl admin-page">
      <section className="page-hero admin-hero">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.text}</p>
        <div className="admin-tabs" aria-label="Admin sections">
          {(['applications', 'users', 'news', 'tournaments'] as const).map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'admin-tab selected' : 'admin-tab'}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {copy[tab]}
            </button>
          ))}
        </div>
      </section>

      {message ? <p className="notice">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {activeTab === 'applications' ? (
        <section className="panel admin-section">
          <div className="section-head inline">
            <div>
              <p className="eyebrow">{copy.applications}</p>
              <h2>{copy.applications}</h2>
            </div>
            <div className="admin-toolbar">
              <input
                placeholder={copy.searchTeamsPlaceholder}
                value={applicationQuery}
                onChange={(event) => setApplicationQuery(event.target.value)}
              />
              <select value={applicationFilter} onChange={(event) => setApplicationFilter(event.target.value as StatusFilter)}>
                {statusFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === 'all' ? copy.all : applicationStatusLabels[filter]}
                  </option>
                ))}
              </select>
              <button className="button ghost" disabled={isPending} type="button" onClick={loadApplications}>
                {copy.refresh}
              </button>
            </div>
          </div>

          <div className="admin-list">
            {applications.length === 0 ? <p>{copy.noApplications}</p> : null}
            {applications.map((application) => (
              <article className="admin-card" key={application.id}>
                <div className="admin-card__main">
                  <span className={`status-pill ${application.status === 'approved' ? 'upcoming' : application.status === 'rejected' ? 'finished' : 'live'}`}>
                    {applicationStatusLabels[application.status]}
                  </span>
                  <h3>{application.teamName}</h3>
                  <dl className="meta-grid mini">
                    <div>
                      <dt>{copy.slot}</dt>
                      <dd>{application.slotNo}</dd>
                    </div>
                    <div>
                      <dt>{copy.status}</dt>
                      <dd>{application.status}</dd>
                    </div>
                    <div>
                      <dt>{copy.created}</dt>
                      <dd>{formatDateTime(application.createdAt, language)}</dd>
                    </div>
                  </dl>
                  <p>{copy.roster}: {application.members.join(', ')}</p>
                </div>
                <div className="admin-card__actions">
                  <input
                    aria-label={copy.reason}
                    placeholder={copy.reason}
                    value={rejectReasons[application.id] ?? ''}
                    onChange={(event) => setRejectReasons((current) => ({ ...current, [application.id]: event.target.value }))}
                  />
                  <button
                    className="button primary"
                    disabled={isPending || application.status === 'approved'}
                    type="button"
                    onClick={() => runAction(() => adminRepository.approveApplication(application.id))}
                  >
                    {copy.approve}
                  </button>
                  <button
                    className="button ghost"
                    disabled={isPending || application.status === 'rejected'}
                    type="button"
                    onClick={() => runAction(() => adminRepository.rejectApplication(application.id, { reason: rejectReasons[application.id] }))}
                  >
                    {copy.reject}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'users' ? (
        <section className="panel admin-section">
            <div className="section-head inline">
              <div>
                <p className="eyebrow">{copy.users}</p>
                <h2>{copy.users}</h2>
              </div>
              <div className="admin-toolbar">
                <input
                  placeholder={copy.searchTeamsPlaceholder}
                  value={teamQuery}
                  onChange={(event) => setTeamQuery(event.target.value)}
                />
                <input
                  placeholder={copy.searchUsersPlaceholder}
                  value={userQuery}
                  onChange={(event) => setUserQuery(event.target.value)}
                />
                <button className="button ghost" disabled={isPending} type="button" onClick={() => loadUsers()}>
                  {copy.refresh}
                </button>
              </div>
            </div>

            <div className="admin-list">
              {users.length === 0 ? <p>{copy.noUsers}</p> : null}
              {users.map(renderUserCard)}
            </div>
        </section>
      ) : null}

      {activeTab === 'news' ? (
        <section className="admin-layout">
          <form className="panel form-panel" onSubmit={submitNews}>
            <div className="section-head inline">
              <div>
                <p className="eyebrow">{copy.news}</p>
                <h2>{copy.newsEditor}</h2>
              </div>
              {editingNewsId ? (
                <button className="button ghost" type="button" onClick={() => { setEditingNewsId(null); setNewsForm(emptyNewsForm()); }}>
                  {copy.cancel}
                </button>
              ) : null}
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Slug</span>
                <input value={newsForm.slug} onChange={(event) => setNewsForm({ ...newsForm, slug: event.target.value })} />
              </label>
              <label className="field">
                <span>{copy.publishedAt}</span>
                <input value={newsForm.publishedAt} onChange={(event) => setNewsForm({ ...newsForm, publishedAt: event.target.value })} type="datetime-local" />
              </label>
            </div>
            <button className="button ghost compact-action" type="button" onClick={() => setNewsForm({ ...newsForm, slug: slugify(newsForm.title) })}>
              {copy.slugFromTitle}
            </button>
            <label className="field">
              <span>Title</span>
              <input value={newsForm.title} onChange={(event) => updateNewsTitle(event.target.value)} />
            </label>
            <label className="field">
              <span>Teaser</span>
              <textarea rows={3} value={newsForm.teaser} onChange={(event) => setNewsForm({ ...newsForm, teaser: event.target.value })} />
            </label>
            <label className="field">
              <span>Body</span>
              <textarea rows={6} value={newsForm.body} onChange={(event) => setNewsForm({ ...newsForm, body: event.target.value })} />
            </label>
            <label className="field">
              <span>{copy.imageUrl}</span>
              <input
                accept="image/*"
                type="file"
                onChange={(event) =>
                  handleAdminImageChange(event, (file, imagePreviewUrl) =>
                    setNewsForm((current) => ({ ...current, imageFile: file, imagePreviewUrl }))
                  )
                }
              />
            </label>
            {newsForm.imagePreviewUrl ? <img className="admin-image-preview" src={newsForm.imagePreviewUrl} alt="" /> : null}

            <fieldset className="admin-fieldset">
              <legend>{copy.ruLocalization}</legend>
              <label className="field">
                <span>RU title</span>
                <input value={newsForm.ruTitle} onChange={(event) => setNewsForm({ ...newsForm, ruTitle: event.target.value })} />
              </label>
              <label className="field">
                <span>RU teaser</span>
                <textarea rows={3} value={newsForm.ruTeaser} onChange={(event) => setNewsForm({ ...newsForm, ruTeaser: event.target.value })} />
              </label>
              <label className="field">
                <span>RU body</span>
                <textarea rows={5} value={newsForm.ruBody} onChange={(event) => setNewsForm({ ...newsForm, ruBody: event.target.value })} />
              </label>
            </fieldset>

            <button className="button primary" disabled={isPending} type="submit">
              {editingNewsId ? copy.update : copy.create}
            </button>
          </form>

          <aside className="panel admin-side-list">
            <div className="section-head inline">
              <div>
                <p className="eyebrow">{copy.news}</p>
                <h2>{copy.news}</h2>
              </div>
              <button className="button ghost" disabled={isPending} type="button" onClick={loadContent}>{copy.refresh}</button>
            </div>
            {localizedNews.length === 0 ? <p>{copy.noNews}</p> : null}
            {localizedNews.map((item) => (
              <article className="admin-mini-card" key={item.id}>
                <div>
                  <span>{formatDateTime(item.publishedAt, language)}</span>
                  <strong>{item.title}</strong>
                  <p>{item.teaser}</p>
                </div>
                <div className="form-actions">
                  <button className="button ghost" type="button" onClick={() => editNews(newsItems.find((raw) => raw.id === item.id) ?? item)}>{copy.edit}</button>
                  <button className="button ghost" disabled={isPending} type="button" onClick={() => runAction(() => adminRepository.deleteNews(item.id), copy.deleted)}>{copy.delete}</button>
                </div>
              </article>
            ))}
          </aside>
        </section>
      ) : null}

      {activeTab === 'tournaments' ? (
        <section className="admin-layout">
          <form className="panel form-panel" onSubmit={submitTournament}>
            <div className="section-head inline">
              <div>
                <p className="eyebrow">{copy.tournaments}</p>
                <h2>{copy.tournamentEditor}</h2>
              </div>
              {editingTournamentId ? (
                <button className="button ghost" type="button" onClick={() => { setEditingTournamentId(null); setTournamentForm(emptyTournamentForm()); }}>
                  {copy.cancel}
                </button>
              ) : null}
            </div>

            <p className="notice">{editingTournamentId ? copy.editSlotsSafe : copy.autoSlots}</p>

            <div className="form-grid">
              <label className="field">
                <span>Slug</span>
                <input value={tournamentForm.slug} onChange={(event) => setTournamentForm({ ...tournamentForm, slug: event.target.value })} />
              </label>
              <label className="field">
                <span>{copy.startsAt}</span>
                <input value={tournamentForm.startsAt} onChange={(event) => setTournamentForm({ ...tournamentForm, startsAt: event.target.value })} type="datetime-local" />
              </label>
            </div>
            <button className="button ghost compact-action" type="button" onClick={() => setTournamentForm({ ...tournamentForm, slug: slugify(tournamentForm.title) })}>
              {copy.slugFromTitle}
            </button>

            <label className="field">
              <span>Title</span>
              <input value={tournamentForm.title} onChange={(event) => updateTournamentTitle(event.target.value)} />
            </label>

            <div className="form-grid">
              <label className="field">
                <span>{copy.status}</span>
                <select value={tournamentForm.status} onChange={(event) => setTournamentForm({ ...tournamentForm, status: event.target.value as TournamentStatus })}>
                  {tournamentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="field">
                <span>BO</span>
                <select value={tournamentForm.boFormat} onChange={(event) => setTournamentForm({ ...tournamentForm, boFormat: event.target.value as BoFormat })}>
                  {boFormats.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>{copy.prizePool}</span>
                <input value={tournamentForm.prizePool} onChange={(event) => setTournamentForm({ ...tournamentForm, prizePool: event.target.value })} />
              </label>
              <label className="field">
                <span>{copy.maxTeams}</span>
                <input min="1" value={tournamentForm.maxTeamsCount} onChange={(event) => setTournamentForm({ ...tournamentForm, maxTeamsCount: event.target.value })} type="number" />
              </label>
            </div>

            <label className="field">
              <span>{copy.imageUrl}</span>
              <input
                accept="image/*"
                type="file"
                onChange={(event) =>
                  handleAdminImageChange(event, (file, imagePreviewUrl) =>
                    setTournamentForm((current) => ({ ...current, imageFile: file, imagePreviewUrl }))
                  )
                }
              />
            </label>
            {tournamentForm.imagePreviewUrl ? <img className="admin-image-preview" src={tournamentForm.imagePreviewUrl} alt="" /> : null}
            <label className="field">
              <span>{copy.description}</span>
              <textarea rows={5} value={tournamentForm.description} onChange={(event) => setTournamentForm({ ...tournamentForm, description: event.target.value })} />
            </label>
            <label className="auth-check admin-checkbox">
              <input checked={tournamentForm.canApply} onChange={(event) => setTournamentForm({ ...tournamentForm, canApply: event.target.checked })} type="checkbox" />
              <span>{copy.canApply}</span>
            </label>

            <div className="form-grid">
              <label className="field">
                <span>Winner team</span>
                <input value={tournamentForm.winnerTeam} onChange={(event) => setTournamentForm({ ...tournamentForm, winnerTeam: event.target.value })} />
              </label>
              <label className="field">
                <span>Final score</span>
                <input value={tournamentForm.finalScore} onChange={(event) => setTournamentForm({ ...tournamentForm, finalScore: event.target.value })} />
              </label>
            </div>

            <label className="field">
              <span>{copy.rules}</span>
              <textarea rows={4} value={tournamentForm.rulesText} onChange={(event) => setTournamentForm({ ...tournamentForm, rulesText: event.target.value })} />
            </label>
            <label className="field">
              <span>{copy.links}</span>
              <textarea rows={4} value={tournamentForm.linksText} onChange={(event) => setTournamentForm({ ...tournamentForm, linksText: event.target.value })} />
            </label>
            <label className="field">
              <span>{copy.matches}</span>
              <textarea rows={4} value={tournamentForm.matchesText} onChange={(event) => setTournamentForm({ ...tournamentForm, matchesText: event.target.value })} />
            </label>

            <fieldset className="admin-fieldset">
              <legend>{copy.ruLocalization}</legend>
              <label className="field">
                <span>RU title</span>
                <input value={tournamentForm.ruTitle} onChange={(event) => setTournamentForm({ ...tournamentForm, ruTitle: event.target.value })} />
              </label>
              <label className="field">
                <span>RU description</span>
                <textarea rows={4} value={tournamentForm.ruDescription} onChange={(event) => setTournamentForm({ ...tournamentForm, ruDescription: event.target.value })} />
              </label>
              <div className="form-grid">
                <label className="field">
                  <span>RU prize pool</span>
                  <input value={tournamentForm.ruPrizePool} onChange={(event) => setTournamentForm({ ...tournamentForm, ruPrizePool: event.target.value })} />
                </label>
                <label className="field">
                  <span>RU rules</span>
                  <textarea rows={3} value={tournamentForm.ruRulesText} onChange={(event) => setTournamentForm({ ...tournamentForm, ruRulesText: event.target.value })} />
                </label>
              </div>
            </fieldset>

            <button className="button primary" disabled={isPending} type="submit">
              {editingTournamentId ? copy.update : copy.create}
            </button>
          </form>

          <aside className="panel admin-side-list">
            <div className="section-head inline">
              <div>
                <p className="eyebrow">{copy.tournaments}</p>
                <h2>{copy.tournaments}</h2>
              </div>
              <button className="button ghost" disabled={isPending} type="button" onClick={loadContent}>{copy.refresh}</button>
            </div>
            {localizedTournaments.length === 0 ? <p>{copy.noTournaments}</p> : null}
            {localizedTournaments.map((item) => (
              <article className="admin-mini-card" key={item.id}>
                <div>
                  <span className={`status-pill ${item.status}`}>{item.status}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <small>{formatDateTime(item.startsAt, language)} - {item.registeredTeamsCount}/{item.maxTeamsCount}</small>
                </div>
                <div className="form-actions">
                  <button className="button ghost" type="button" onClick={() => editTournament(tournaments.find((raw) => raw.id === item.id) ?? item)}>{copy.edit}</button>
                  <button className="button ghost" disabled={isPending} type="button" onClick={() => runAction(() => adminRepository.deleteTournament(item.id), copy.deleted)}>{copy.delete}</button>
                </div>
              </article>
            ))}
          </aside>
        </section>
      ) : null}
    </div>
  );
};

const buildNewsPayload = (form: NewsFormState, imageUrl: string): AdminNewsCreateRequestDTO => {
  const localized = form.ruTitle || form.ruTeaser || form.ruBody
    ? {
        ru: {
          title: optionalString(form.ruTitle),
          teaser: optionalString(form.ruTeaser),
          body: optionalString(form.ruBody)
        }
      }
    : undefined;

  return {
    slug: form.slug.trim() || slugify(form.title),
    title: form.title.trim(),
    teaser: form.teaser.trim(),
    body: form.body.trim(),
    imageUrl,
    publishedAt: toIso(form.publishedAt),
    localized
  };
};

const buildTournamentCreatePayload = (form: TournamentFormState, imageUrl: string): AdminTournamentCreateRequestDTO => ({
  ...buildTournamentSharedPayload(form, imageUrl),
  bracket: Array.from({ length: Math.max(1, Number(form.maxTeamsCount) || 1) }, (_, index) => ({
    slotNo: index + 1,
    seed: `A${index + 1}`,
    state: 'empty'
  }))
});

const buildTournamentUpdatePayload = (form: TournamentFormState, imageUrl: string) => buildTournamentSharedPayload(form, imageUrl);

const buildTournamentSharedPayload = (form: TournamentFormState, imageUrl: string) => ({
  slug: form.slug.trim() || slugify(form.title),
  title: form.title.trim(),
  status: form.status,
  boFormat: form.boFormat,
  startsAt: toIso(form.startsAt) ?? new Date().toISOString(),
  prizePool: form.prizePool.trim(),
  imageUrl,
  maxTeamsCount: Math.max(1, Number(form.maxTeamsCount) || 1),
  description: form.description.trim(),
  canApply: form.canApply,
  winnerTeam: optionalString(form.winnerTeam),
  finalScore: optionalString(form.finalScore),
  localized: buildTournamentLocalized(form),
  links: parseLinks(form.linksText),
  rules: parseRules(form.rulesText),
  matches: parseMatches(form.matchesText)
});

const buildTournamentLocalized = (form: TournamentFormState) => {
  if (!form.ruTitle && !form.ruDescription && !form.ruPrizePool && !form.ruRulesText) {
    return undefined;
  }

  return {
    ru: {
      title: optionalString(form.ruTitle),
      description: optionalString(form.ruDescription),
      prizePool: optionalString(form.ruPrizePool),
      rules: parseRuleLines(form.ruRulesText)
    }
  };
};

const parseRules = (value: string): AdminTournamentRulePayloadDTO[] =>
  parseRuleLines(value).map((body, index) => ({ body, sortOrder: index }));

const parseRuleLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const parseLinks = (value: string): AdminTournamentLinkPayloadDTO[] =>
  value
    .split('\n')
    .map((line, index) => {
      const [label = '', url = '', rawKind = 'link'] = line.split('|').map((part) => part.trim());
      const kind: TournamentLinkKind = rawKind === 'stream' ? 'stream' : 'link';
      return label && url ? { label, url, kind, sortOrder: index } : null;
    })
    .filter((item): item is AdminTournamentLinkPayloadDTO => item !== null);

const parseMatches = (value: string) =>
  value
    .split('\n')
    .map((line) => {
      const [title = '', teamA = '', teamB = '', score = '0:0', startsAt = '', rawStatus = 'scheduled', streamUrl = ''] = line
        .split('|')
        .map((part) => part.trim());
      if (!title || !teamA || !teamB || !startsAt) {
        return null;
      }
      const status: MatchStatus = matchStatuses.includes(rawStatus as MatchStatus) ? (rawStatus as MatchStatus) : 'scheduled';
      return {
        title,
        teamA,
        teamB,
        score,
        startsAt: toIso(startsAt) ?? new Date().toISOString(),
        status,
        streamUrl: optionalString(streamUrl)
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

function toDateTimeLocal(value?: string) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function toIso(value: string) {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function optionalString(value: string) {
  const normalized = value.trim();
  return normalized || undefined;
}

function shouldSyncSlug(slug: string, title: string) {
  const normalizedSlug = slug.trim();
  return !normalizedSlug || normalizedSlug === slugify(title);
}

function resolveError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
