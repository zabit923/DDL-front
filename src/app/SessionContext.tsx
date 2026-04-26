import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Role, UserDTO } from '../shared/api/contracts';
import { authRepository, notificationsRepository } from '../shared/api/repositories';
import { clearAuthTokens, getAuthTokens } from '../shared/api/client';

type Theme = 'light' | 'dark';
type Language = 'ru' | 'en';

const translations = {
  ru: {
    navHome: 'Главная',
    navTournaments: 'Турниры',
    navNews: 'Новости',
    navNotifications: 'Уведомления',
    navAdmin: 'Админка',
    login: 'Войти',
    logout: 'Выйти',
    register: 'Регистрация',
    createAccount: 'Создать аккаунт',
    alreadyHaveAccount: 'Уже есть аккаунт',
    authFlow: 'Auth flow',
    loginTitle: 'Вход в лигу',
    registerTitle: 'Регистрация игрока',
    authorization: 'Авторизация',
    newPlayer: 'Новый игрок',
    currentRole: 'Текущая роль',
    roleInfo: 'Гость смотрит публичные страницы. Пользователь подает заявки на слоты и получает уведомления.',
    rememberTelegram: 'Запомнить Telegram',
    loginCta: 'Войти и продолжить',
    checking: 'Проверка...',
    creating: 'Создание...',
    minPassword4: 'Минимум 4 символа',
    minPassword6: 'Минимум 6 символов',
    repeatPassword: 'Повторите пароль',
    acceptTournamentRules: 'Я принимаю правила турниров и согласен получать командные уведомления.',
    authMotivation1: 'Собери состав, займи слот и выведи команду в сетку раньше остальных.',
    authMotivation2: 'Каждый турнир начинается с входа: дальше инвайты, заявки и борьба за призовой фонд.',
    authMotivation3: 'Твой ник в ростере важен. Подтверди аккаунт и готовь команду к следующему матчу.',
    invalidTelegram: 'Введите Telegram username: 5-32 латинских символа, цифры или underscore.',
    telegramConfirmationEyebrow: 'Telegram verify',
    telegramConfirmationTitle: 'Подтвердите аккаунт в Telegram',
    telegramConfirmationText: 'Перейдите в бота по кнопке и нажмите Start. После ответа бота сайт сам снимет напоминание и ограничения.',
    openTelegramBot: 'Открыть бота',
    checkConfirmation: 'Проверить',
    telegramConfirmationWaiting: 'Ожидаем подтверждение в Telegram. Можно продолжать смотреть публичные страницы.',
    confirmationLinkMissing: 'Ссылка на бота не настроена.',
    changeTelegram: 'Изменить Telegram',
    telegramChangeRequiresConfirmation: 'Если изменить Telegram username, аккаунт снова станет неподтвержденным до подтверждения через бота.',
    telegramRequiredForActionsText: 'До подтверждения Telegram доступны только публичные страницы и редактирование профиля.',
    confirmTelegramToApply: 'Подтвердить Telegram',
    passwordTooShort4: 'Пароль должен быть не короче 4 символов.',
    passwordTooShort6: 'Пароль должен быть не короче 6 символов.',
    usernameLength: 'Username должен быть от 3 до 24 символов.',
    usernameChars: 'Username может содержать буквы, цифры, дефис и underscore.',
    passwordsMismatch: 'Пароли не совпадают.',
    acceptRulesError: 'Нужно подтвердить согласие с правилами турниров.',
    loginError: 'Ошибка входа.',
    registerError: 'Ошибка регистрации.',
    latestLiveTournament: 'Последний live-турнир',
    liveNow: 'Идет сейчас',
    openLivePage: 'Открыть live-страницу',
    watchStream: 'Смотреть трансляцию',
    start: 'Старт',
    prizePool: 'Призовой фонд',
    currentMatch: 'Текущий матч',
    stream: 'Трансляция',
    bracketUpdating: 'Сетка обновляется',
    soon: 'Скоро',
    all: 'Все',
    upcomingPlural: 'Предстоящие',
    livePlural: 'Идут',
    finishedPlural: 'Завершенные',
    tournamentHub: 'Tournament hub',
    allTournaments: 'Все турниры',
    noLive: 'Сейчас live-турниров нет. Ниже доступны предстоящие и завершенные турниры.',
    date: 'Дата',
    prizes: 'Призы',
    slots: 'Слоты',
    mvpMode: 'League hub',
    homeTitle: 'Платформа турниров по DeadLock',
    homeText:
      'Собирайте состав, следите за сеткой турниров и управляйте командой в одном рабочем кабинете.',
    watchTournaments: 'Смотреть турниры',
    format: 'Формат',
    teams: 'Команды',
    tournamentsInCatalog: 'турнира в каталоге',
    playersForAutocomplete: 'игроков в базе',
    applicationInProgress: 'заявка в процессе',
    latestNews: 'Последние обновления',
    allNews: 'Все новости',
    newsPageTitle: 'Новости лиги',
    newsPageText: 'Публичные обновления лиги доступны гостям и авторизованным игрокам.',
    backToNews: 'Назад к новостям',
    notificationsPageTitle: 'Onsite-уведомления',
    notificationsPageText:
      'Все важные события по команде, инвайтам и заявкам собраны в одном месте.',
    open: 'Открыть',
    markAsRead: 'Прочитано',
    bracket: 'Сетка',
    rules: 'Правила',
    tournamentBracket: 'Турнирная сетка',
    tournamentLegend: 'свободно / ожидает / подтверждено / live / завершено',
    rulebook: 'Регламент',
    winner: 'Победитель',
    finalScore: 'Финальный счет',
    completedSeries: 'Завершенные серии',
    score: 'счет',
    liveMatches: 'Live-матчи',
    registration: 'Регистрация',
    openSlotsTitle: 'Свободные слоты кликабельны',
    openSlotsText:
      'После отправки заявка уходит на рассмотрение админам. До решения слот остается свободным.',
    myApplicationTitle: 'Моя заявка',
    myApplicationWaiting: 'Заявка отправлена и ожидает решения администраторов.',
    myApplicationSlot: 'Слот',
    myApplicationStatus: 'Статус',
    applicationAlreadySubmitted: 'Заявка уже отправлена',
    quickApply: 'Быстрая заявка',
    slot: 'Слот',
    rosterNotLocked: 'Состав еще не закреплен.',
    loginToApply: 'Войти для заявки',
    apply: 'Подать заявку',
    slotStateEmpty: 'Свободно',
    slotStatePendingMembers: 'Ждет игроков',
    slotStatePendingAdmin: 'Ждет решения',
    slotStateApproved: 'Подтверждена',
    slotStateLive: 'Live',
    slotStateFinished: 'Завершено',
    profile: 'Личный кабинет',
    loading: 'Загрузка...',
    accountData: 'Данные аккаунта',
    editProfile: 'Редактировать профиль',
    telegramConfirmed: 'Telegram подтвержден',
    avatarUrl: 'Ссылка на аватарку',
    changeAvatar: 'Сменить аватарку',
    changeAvatarHint: 'Нажмите на карандаш в углу аватарки, чтобы загрузить изображение.',
    avatarFileOnlyImages: 'Можно загружать только изображения.',
    avatarFileTooLarge: 'Файл слишком большой. Максимум 4 МБ.',
    avatarLoadFailed: 'Не удалось прочитать изображение.',
    saveProfile: 'Сохранить профиль',
    profileSaved: 'Профиль сохранен.',
    profileActionError: 'Не удалось выполнить действие.',
    team: 'Команда',
    teamTotalWins: 'Победы команды',
    teamRoster: 'Состав команды',
    achievements: 'Достижения',
    noTeamTitle: 'Команда еще не создана',
    noTeamText: 'Создайте команду в личном кабинете, пригласите участников и подавайте заявки на турниры от готового состава.',
    teamName: 'Название команды',
    createTeam: 'Создать команду',
    teamCreated: 'Команда создана.',
    readyToApply: 'Готова к заявке',
    needsRoster: 'Нужен состав',
    renameTeam: 'Переименовать команду',
    teamRenamed: 'Команда переименована.',
    invitePlayer: 'Пригласить игрока',
    playerUsername: 'Ник игрока',
    sendInvite: 'Отправить инвайт',
    inviteSent: 'Инвайт отправлен.',
    incomingInvites: 'Входящие приглашения',
    incomingInvitesText: 'Если вас пригласили в команду, здесь можно принять или отклонить приглашение.',
    inviteFromTeam: 'Команда',
    invitedBy: 'Пригласил',
    acceptInvite: 'Принять',
    declineInvite: 'Отклонить',
    inviteAccepted: 'Приглашение принято.',
    inviteDeclined: 'Приглашение отклонено.',
    teamStatusCaptain: 'Капитан',
    teamStatusActive: 'Участник',
    teamStatusInvited: 'Приглашен',
    remove: 'Удалить',
    memberRemoved: 'Участник удален.',
    personalAchievements: 'Личные ачивки',
    locked: 'Закрыто',
    session: 'Сессия',
    profileActions: 'Действия',
    authRequired: 'Нужен вход',
    applyAfterLogin: 'Заявка доступна после входа',
    applyAfterLoginText: 'Гость может смотреть турниры и новости, но заявку на слот отправляет авторизованный пользователь.',
    slotUnavailable: 'Слот недоступен',
    slotUnavailableText: 'Выбранный слот уже занят или не существует.',
    backToBracket: 'Вернуться к сетке',
    teamApplication: 'Заявка команды',
    createTeamFirstTitle: 'Сначала создайте команду',
    createTeamFirstText: 'Заявки теперь отправляются от команды из личного кабинета. Создайте команду и пригласите участников.',
    openProfile: 'Открыть личный кабинет',
    teamRosterRequired: 'Для заявки нужен полный состав: капитан + пять участников.',
    applicationSubmitError: 'Не удалось отправить заявку.',
    applyTo: 'Заявка на',
    teamApplicationText: 'Заявка отправляется от команды из личного кабинета. Управляйте составом и инвайтами в профиле.',
    cancel: 'Отмена',
    manageTeam: 'Управлять командой',
    submitApplication: 'Отправить заявку',
    submitting: 'Отправка...',
    preview: 'Превью',
    applicationPreviewText: 'После отправки команда ждет решения админа; слот остается свободным до одобрения.',
    player: 'Игрок',
    achievementFirstWinTitle: 'Первая победа',
    achievementFirstWinText: 'Выиграйте первую турнирную серию.',
    achievementTenWinsTitle: '10 побед',
    achievementTenWinsText: 'Доберитесь до десяти побед команды в официальных матчах.',
    achievementCaptainTitle: 'Капитан',
    achievementCaptainText: 'Создайте команду и пригласите полный состав.',
    language: 'Язык',
    theme: 'Тема',
    light: 'Светлая',
    dark: 'Темная',
    statusUpcoming: 'Предстоящий',
    statusLive: 'Идет сейчас',
    statusFinished: 'Завершен'
  },
  en: {
    navHome: 'Home',
    navTournaments: 'Tournaments',
    navNews: 'News',
    navNotifications: 'Notifications',
    navAdmin: 'Admin',
    login: 'Log in',
    logout: 'Log out',
    register: 'Register',
    createAccount: 'Create account',
    alreadyHaveAccount: 'Already have an account',
    authFlow: 'Auth flow',
    loginTitle: 'League login',
    registerTitle: 'Player registration',
    authorization: 'Authorization',
    newPlayer: 'New player',
    currentRole: 'Current role',
    roleInfo: 'Guests can view public pages. Users can apply for slots and receive notifications.',
    rememberTelegram: 'Remember Telegram',
    loginCta: 'Log in and continue',
    checking: 'Checking...',
    creating: 'Creating...',
    minPassword4: 'At least 4 characters',
    minPassword6: 'At least 6 characters',
    repeatPassword: 'Repeat password',
    acceptTournamentRules: 'I accept tournament rules and agree to receive team notifications.',
    authMotivation1: 'Build your roster, claim a slot, and get into the bracket before everyone else.',
    authMotivation2: 'Every tournament starts with login: invites, applications, and the prize fight come next.',
    authMotivation3: 'Your nickname matters in the roster. Confirm the account and prepare for the next match.',
    invalidTelegram: 'Enter a Telegram username: 5-32 latin characters, digits, or underscores.',
    telegramConfirmationEyebrow: 'Telegram verify',
    telegramConfirmationTitle: 'Confirm your account in Telegram',
    telegramConfirmationText: 'Open the bot from the button and press Start. After the bot reply, the site removes the reminder and restrictions automatically.',
    openTelegramBot: 'Open bot',
    checkConfirmation: 'Check',
    telegramConfirmationWaiting: 'Waiting for Telegram confirmation. Public pages are still available.',
    confirmationLinkMissing: 'Bot link is not configured.',
    changeTelegram: 'Change Telegram',
    telegramChangeRequiresConfirmation: 'If you change the Telegram username, the account becomes unconfirmed until you verify it through the bot again.',
    telegramRequiredForActionsText: 'Until Telegram is confirmed, only public pages and profile editing are available.',
    confirmTelegramToApply: 'Confirm Telegram',
    passwordTooShort4: 'Password must be at least 4 characters.',
    passwordTooShort6: 'Password must be at least 6 characters.',
    usernameLength: 'Username must be 3 to 24 characters.',
    usernameChars: 'Username may contain letters, numbers, hyphen, and underscore.',
    passwordsMismatch: 'Passwords do not match.',
    acceptRulesError: 'You need to accept tournament rules.',
    loginError: 'Login failed.',
    registerError: 'Registration failed.',
    latestLiveTournament: 'Latest live tournament',
    liveNow: 'Live now',
    openLivePage: 'Open live page',
    watchStream: 'Watch stream',
    start: 'Start',
    prizePool: 'Prize pool',
    currentMatch: 'Current match',
    stream: 'Stream',
    bracketUpdating: 'Bracket is updating',
    soon: 'Soon',
    all: 'All',
    upcomingPlural: 'Upcoming',
    livePlural: 'Live',
    finishedPlural: 'Finished',
    tournamentHub: 'Tournament hub',
    allTournaments: 'All tournaments',
    noLive: 'There are no live tournaments now. Upcoming and finished tournaments are available below.',
    date: 'Date',
    prizes: 'Prizes',
    slots: 'Slots',
    mvpMode: 'League hub',
    homeTitle: 'A DeadLock tournament platform',
    homeText:
      'Build your roster, track tournament brackets, and manage team workflow from one workspace.',
    watchTournaments: 'View tournaments',
    format: 'Format',
    teams: 'Teams',
    tournamentsInCatalog: 'tournaments in catalog',
    playersForAutocomplete: 'players in directory',
    applicationInProgress: 'application in progress',
    latestNews: 'Latest updates',
    allNews: 'All news',
    newsPageTitle: 'League news',
    newsPageText: 'Public league updates are available to guests and signed-in players.',
    backToNews: 'Back to news',
    notificationsPageTitle: 'On-site notifications',
    notificationsPageText: 'All important team, invite, and application events are gathered in one feed.',
    open: 'Open',
    markAsRead: 'Mark as read',
    bracket: 'Bracket',
    rules: 'Rules',
    tournamentBracket: 'Tournament bracket',
    tournamentLegend: 'open / pending / approved / live / finished',
    rulebook: 'Rulebook',
    winner: 'Winner',
    finalScore: 'Final score',
    completedSeries: 'Completed series',
    score: 'score',
    liveMatches: 'Live matches',
    registration: 'Registration',
    openSlotsTitle: 'Open slots are clickable',
    openSlotsText: 'After submission, the application goes to admin review. The slot stays open until approval.',
    myApplicationTitle: 'My application',
    myApplicationWaiting: 'Application is submitted and waiting for admin decision.',
    myApplicationSlot: 'Slot',
    myApplicationStatus: 'Status',
    applicationAlreadySubmitted: 'Application already submitted',
    quickApply: 'Quick apply',
    slot: 'Slot',
    rosterNotLocked: 'Roster is not locked yet.',
    loginToApply: 'Log in to apply',
    apply: 'Apply',
    slotStateEmpty: 'Open',
    slotStatePendingMembers: 'Awaiting players',
    slotStatePendingAdmin: 'Awaiting review',
    slotStateApproved: 'Approved',
    slotStateLive: 'Live',
    slotStateFinished: 'Finished',
    profile: 'Profile',
    loading: 'Loading...',
    accountData: 'Account data',
    editProfile: 'Edit profile',
    telegramConfirmed: 'Telegram confirmed',
    avatarUrl: 'Avatar URL',
    changeAvatar: 'Change avatar',
    changeAvatarHint: 'Click the pencil on the avatar corner to upload an image.',
    avatarFileOnlyImages: 'Only image files are allowed.',
    avatarFileTooLarge: 'File is too large. Maximum size is 4 MB.',
    avatarLoadFailed: 'Failed to read the image file.',
    saveProfile: 'Save profile',
    profileSaved: 'Profile saved.',
    profileActionError: 'Could not complete the action.',
    team: 'Team',
    teamTotalWins: 'Team wins',
    teamRoster: 'Team roster',
    achievements: 'Achievements',
    noTeamTitle: 'No team yet',
    noTeamText: 'Create a team in your profile, invite members, and submit tournament applications from a ready roster.',
    teamName: 'Team name',
    createTeam: 'Create team',
    teamCreated: 'Team created.',
    readyToApply: 'Ready to apply',
    needsRoster: 'Roster needed',
    renameTeam: 'Rename team',
    teamRenamed: 'Team renamed.',
    invitePlayer: 'Invite player',
    playerUsername: 'Player username',
    sendInvite: 'Send invite',
    inviteSent: 'Invite sent.',
    incomingInvites: 'Incoming invites',
    incomingInvitesText: 'If someone invited you to a team, you can accept or decline it here.',
    inviteFromTeam: 'Team',
    invitedBy: 'Invited by',
    acceptInvite: 'Accept',
    declineInvite: 'Decline',
    inviteAccepted: 'Invite accepted.',
    inviteDeclined: 'Invite declined.',
    teamStatusCaptain: 'Captain',
    teamStatusActive: 'Member',
    teamStatusInvited: 'Invited',
    remove: 'Remove',
    memberRemoved: 'Member removed.',
    personalAchievements: 'Personal achievements',
    locked: 'Locked',
    session: 'Session',
    profileActions: 'Actions',
    authRequired: 'Auth required',
    applyAfterLogin: 'Apply after login',
    applyAfterLoginText: 'Guests can browse tournaments and news, but slot applications require an authenticated user.',
    slotUnavailable: 'Slot unavailable',
    slotUnavailableText: 'The selected slot is already occupied or does not exist.',
    backToBracket: 'Back to bracket',
    teamApplication: 'Team application',
    createTeamFirstTitle: 'Create a team first',
    createTeamFirstText: 'Applications are now submitted from the team in your profile. Create a team and invite members first.',
    openProfile: 'Open profile',
    teamRosterRequired: 'Application requires a full roster: captain + five members.',
    applicationSubmitError: 'Failed to submit the application.',
    applyTo: 'Apply to',
    teamApplicationText: 'The application is submitted from the team in your profile. Manage roster and invites there.',
    cancel: 'Cancel',
    manageTeam: 'Manage team',
    submitApplication: 'Submit application',
    submitting: 'Submitting...',
    preview: 'Preview',
    applicationPreviewText: 'After submission, the team waits for admin review; the slot remains open until approval.',
    player: 'Player',
    achievementFirstWinTitle: 'First victory',
    achievementFirstWinText: 'Win your first tournament series.',
    achievementTenWinsTitle: '10 wins',
    achievementTenWinsText: 'Reach ten team wins in official matches.',
    achievementCaptainTitle: 'Captain',
    achievementCaptainText: 'Create your own team and invite a full roster.',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    statusUpcoming: 'Upcoming',
    statusLive: 'Live now',
    statusFinished: 'Finished'
  }
} as const;

type TranslationKey = keyof typeof translations.ru;

interface SessionContextValue {
  role: Role;
  setRole: (role: Role) => void;
  setAuthenticatedUser: (user: UserDTO) => void;
  user: UserDTO | null;
  refreshUser: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  unreadCount: number;
  refreshUnread: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return getAuthTokens().accessToken ? 'user' : 'guest';
  });
  const [user, setUser] = useState<UserDTO | null>(null);
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('ddl-theme') === 'dark' ? 'dark' : 'light'));
  const [language, setLanguageState] = useState<Language>(() =>
    localStorage.getItem('ddl-language') === 'ru' ? 'ru' : 'en'
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const isFirstThemeSyncRef = useRef(true);
  const themeTransitionTimerRef = useRef<number | null>(null);

  const refreshUnread = () => {
    if (!getAuthTokens().accessToken) {
      setUnreadCount(0);
      return;
    }

    void notificationsRepository
      .unreadCount()
      .then(setUnreadCount)
      .catch(() => setUnreadCount(0));
  };

  const setAuthenticatedUser = (nextUser: UserDTO) => {
    setUser(nextUser);
    setRoleState(nextUser.role);
    if (nextUser.telegramConfirmed) {
      refreshUnread();
    } else {
      setUnreadCount(0);
    }
  };

  const setRole = (nextRole: Role) => {
    if (nextRole === 'guest') {
      clearAuthTokens();
      setRoleState('guest');
      setUser(null);
      setUnreadCount(0);
      return;
    }

    setRoleState(nextRole);
  };

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem('ddl-theme', nextTheme);
  };

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('ddl-language', nextLanguage);
  };

  const refreshUser = () => {
    if (!getAuthTokens().accessToken) {
      setRole('guest');
      return;
    }

    void authRepository
      .me()
      .then(setAuthenticatedUser)
      .catch(() => setRole('guest'));
  };

  const t = (key: TranslationKey) => translations[language][key];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
  }, [language, theme]);

  useEffect(() => {
    if (isFirstThemeSyncRef.current) {
      isFirstThemeSyncRef.current = false;
      return;
    }

    const root = document.documentElement;
    root.classList.add('theme-switching');

    if (themeTransitionTimerRef.current !== null) {
      window.clearTimeout(themeTransitionTimerRef.current);
    }

    themeTransitionTimerRef.current = window.setTimeout(() => {
      root.classList.remove('theme-switching');
      themeTransitionTimerRef.current = null;
    }, 260);

    return () => {
      if (themeTransitionTimerRef.current !== null) {
        window.clearTimeout(themeTransitionTimerRef.current);
        themeTransitionTimerRef.current = null;
      }
      root.classList.remove('theme-switching');
    };
  }, [theme]);

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo(
    () => ({
      role,
      setRole,
      setAuthenticatedUser,
      user,
      refreshUser,
      theme,
      setTheme,
      language,
      setLanguage,
      t,
      unreadCount,
      refreshUnread
    }),
    [language, role, theme, unreadCount, user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside SessionProvider');
  }

  return value;
};
