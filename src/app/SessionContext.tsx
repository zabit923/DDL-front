import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '../shared/api/contracts';
import { notificationsRepository } from '../mocks/repositories';

type Theme = 'light' | 'dark';
type Language = 'ru' | 'en';

const translations = {
  ru: {
    navHome: 'Главная',
    navTournaments: 'Турниры',
    navNews: 'Новости',
    navNotifications: 'Уведомления',
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
    rememberEmail: 'Запомнить email для mock-сессии',
    loginCta: 'Войти и продолжить',
    checking: 'Проверка...',
    creating: 'Создание...',
    demoAccount: 'Демо-аккаунт:',
    minPassword4: 'Минимум 4 символа',
    minPassword6: 'Минимум 6 символов',
    repeatPassword: 'Повторите пароль',
    acceptMockRules: 'Я понимаю, что инвайты тиммейтам и уведомления работают в mock-режиме до подключения API.',
    authMotivation1: 'Собери состав, займи слот и выведи команду в сетку раньше остальных.',
    authMotivation2: 'Каждый турнир начинается с входа: дальше инвайты, заявки и борьба за призовой фонд.',
    authMotivation3: 'Твой ник в ростере важен. Подтверди аккаунт и готовь команду к следующему матчу.',
    invalidEmail: 'Введите корректный email.',
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
    allTournaments: 'Все турниры с фильтрами в URL',
    noLive: 'Сейчас live-турниров нет. Ниже доступны предстоящие и завершенные турниры.',
    date: 'Дата',
    prizes: 'Призы',
    slots: 'Слоты',
    mvpMode: 'MVP mock mode',
    homeTitle: 'Платформа турниров по DeadLock',
    homeText:
      'Реализация по PDF: роли, новости, фильтры турниров, единый detail-экран, live/finished/upcoming состояния, уведомления и заявки команд без живого API.',
    watchTournaments: 'Смотреть турниры',
    format: 'Формат',
    teams: 'Команды',
    tournamentsInCatalog: 'турнира в каталоге',
    playersForAutocomplete: 'игроков для автокомплита',
    applicationInProgress: 'заявка в процессе',
    latestNews: 'Последние обновления',
    allNews: 'Все новости',
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
    rememberEmail: 'Remember email for the mock session',
    loginCta: 'Log in and continue',
    checking: 'Checking...',
    creating: 'Creating...',
    demoAccount: 'Demo account:',
    minPassword4: 'At least 4 characters',
    minPassword6: 'At least 6 characters',
    repeatPassword: 'Repeat password',
    acceptMockRules: 'I understand teammate invites and notifications run in mock mode until the API is connected.',
    authMotivation1: 'Build your roster, claim a slot, and get into the bracket before everyone else.',
    authMotivation2: 'Every tournament starts with login: invites, applications, and the prize fight come next.',
    authMotivation3: 'Your nickname matters in the roster. Confirm the account and prepare for the next match.',
    invalidEmail: 'Enter a valid email.',
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
    allTournaments: 'All tournaments with URL filters',
    noLive: 'There are no live tournaments now. Upcoming and finished tournaments are available below.',
    date: 'Date',
    prizes: 'Prizes',
    slots: 'Slots',
    mvpMode: 'MVP mock mode',
    homeTitle: 'A DeadLock tournament platform',
    homeText:
      'Implemented from the PDF: roles, news, tournament filters, unified detail screen, live/finished/upcoming states, notifications, and team applications without a live API.',
    watchTournaments: 'View tournaments',
    format: 'Format',
    teams: 'Teams',
    tournamentsInCatalog: 'tournaments in catalog',
    playersForAutocomplete: 'players for autocomplete',
    applicationInProgress: 'application in progress',
    latestNews: 'Latest updates',
    allNews: 'All news',
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
    const storedRole = localStorage.getItem('ddl-role');
    return storedRole === 'user' ? 'user' : 'guest';
  });
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('ddl-theme') === 'dark' ? 'dark' : 'light'));
  const [language, setLanguageState] = useState<Language>(() =>
    localStorage.getItem('ddl-language') === 'en' ? 'en' : 'ru'
  );
  const [unreadCount, setUnreadCount] = useState(() => notificationsRepository.unreadCount());

  const setRole = (nextRole: Role) => {
    setRoleState(nextRole);
    localStorage.setItem('ddl-role', nextRole);
  };

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem('ddl-theme', nextTheme);
  };

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('ddl-language', nextLanguage);
  };

  const refreshUnread = () => setUnreadCount(notificationsRepository.unreadCount());

  const t = (key: TranslationKey) => translations[language][key];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
  }, [language, theme]);

  useEffect(() => {
    refreshUnread();
  }, []);

  const value = useMemo(
    () => ({ role, setRole, theme, setTheme, language, setLanguage, t, unreadCount, refreshUnread }),
    [language, role, theme, unreadCount]
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
