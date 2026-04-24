import type {
  ApplicationDTO,
  NewsDTO,
  NotificationDTO,
  TournamentDetailDTO,
  UserDTO
} from '../shared/api/contracts';

export const currentUser: UserDTO = {
  id: 'u-captain',
  username: 'Aster',
  email: 'aster@deadlock.local',
  role: 'user'
};

export const users: UserDTO[] = [
  currentUser,
  { id: 'u-vex', username: 'Vex', email: 'vex@deadlock.local', role: 'user' },
  { id: 'u-mira', username: 'Mira', email: 'mira@deadlock.local', role: 'user' },
  { id: 'u-orbit', username: 'Orbit', email: 'orbit@deadlock.local', role: 'user' },
  { id: 'u-kade', username: 'Kade', email: 'kade@deadlock.local', role: 'user' },
  { id: 'u-nyx', username: 'Nyx', email: 'nyx@deadlock.local', role: 'user' },
  { id: 'u-lumen', username: 'Lumen', email: 'lumen@deadlock.local', role: 'user' },
  { id: 'u-rift', username: 'Rift', email: 'rift@deadlock.local', role: 'user' }
];

export const news: NewsDTO[] = [
  {
    id: 'n-1',
    slug: 'registration-window-open',
    title: 'Открыта регистрация на Neon Vault Open',
    teaser: 'Команды могут занять слот и пройти подтверждение состава до решения организатора.',
    publishedAt: '2026-04-20T12:00:00+03:00',
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    body:
      'Регистрация на Neon Vault Open открыта для всех игроков. Капитан выбирает свободный слот, указывает название команды и приглашает пять участников. После отправки команда сразу появляется в сетке со статусом ожидания.'
  },
  {
    id: 'n-2',
    slug: 'broadcast-lineup',
    title: 'Анонсирована сетка трансляций',
    teaser: 'Live-турниры будут иметь выделенный текущий матч и ссылки на Twitch.',
    publishedAt: '2026-04-22T18:30:00+03:00',
    imageUrl:
      'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80',
    body:
      'Для live-турниров на detail-странице отображается текущий матч, счет серии и ссылки на трансляции. Встраиваемый Twitch-плеер будет добавлен после фиксации parent-доменов.'
  },
  {
    id: 'n-3',
    slug: 'application-workflow',
    title: 'Заявки команд работают в mock-режиме',
    teaser: 'Команда появляется в сетке сразу после отправки заявки.',
    publishedAt: '2026-04-24T09:10:00+03:00',
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    body:
      'До подключения FastAPI фронт работает через репозитории и моковые данные. Это позволяет проверить UX заявки, уведомлений и live-сетки без живого бэкенда.'
  }
];

export const applications: ApplicationDTO[] = [
  {
    id: 'app-shadow-six',
    tournamentSlug: 'neon-vault-open',
    slotNo: 2,
    teamName: 'Shadow Six',
    captainId: 'u-vex',
    members: ['Vex', 'Mira', 'Orbit', 'Kade', 'Nyx', 'Lumen'],
    status: 'pending_members',
    createdAt: '2026-04-24T11:40:00+03:00'
  }
];

export const tournaments: TournamentDetailDTO[] = [
  {
    id: 't-neon-vault',
    slug: 'neon-vault-open',
    title: 'Neon Vault Open',
    status: 'upcoming',
    boFormat: 'BO3',
    startsAt: '2026-05-11T19:00:00+03:00',
    prizePool: '$5,000',
    imageUrl:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    registeredTeamsCount: 4,
    maxTeamsCount: 8,
    description:
      'Открытый турнир с интерактивной сеткой. Свободные слоты доступны для заявки команды из шести игроков.',
    links: [
      { label: 'Регламент', url: '/tournaments/neon-vault-open#rules' },
      { label: 'Discord', url: 'https://discord.gg/deadlock-league' }
    ],
    rules: [
      'Состав команды: капитан + пять участников.',
      'После отправки заявки команда появляется в слоте со статусом pending.',
      'Организатор подтверждает заявку после принятия инвайтов всеми участниками.'
    ],
    streamLinks: [],
    liveMatches: [],
    completedMatches: [],
    canApply: true,
    bracket: [
      {
        slotNo: 1,
        seed: 'A1',
        state: 'approved',
        teamName: 'Neon Forge',
        members: ['Nox', 'Rift', 'Basil', 'Kio', 'Trix', 'Shade']
      },
      {
        slotNo: 2,
        seed: 'A2',
        state: 'pending_members',
        teamName: 'Shadow Six',
        applicationId: 'app-shadow-six',
        members: ['Vex', 'Mira', 'Orbit', 'Kade', 'Nyx', 'Lumen']
      },
      { slotNo: 3, seed: 'A3', state: 'empty' },
      {
        slotNo: 4,
        seed: 'A4',
        state: 'approved',
        teamName: 'Siberian Pulse',
        members: ['Skel', 'Mir', 'Aero', 'M8', 'Yuri', 'Nord']
      },
      { slotNo: 5, seed: 'B1', state: 'empty' },
      {
        slotNo: 6,
        seed: 'B2',
        state: 'pending_admin',
        teamName: 'Canal Owls',
        members: ['Echo', 'Mint', 'Fable', 'Clutch', 'Rook', 'Vega']
      },
      { slotNo: 7, seed: 'B3', state: 'empty' },
      { slotNo: 8, seed: 'B4', state: 'empty' }
    ]
  },
  {
    id: 't-rift-division',
    slug: 'rift-division-live',
    title: 'Rift Division Invitational',
    status: 'live',
    boFormat: 'BO5',
    startsAt: '2026-04-25T20:00:00+03:00',
    prizePool: '$12,000',
    imageUrl:
      'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1600&q=80',
    registeredTeamsCount: 8,
    maxTeamsCount: 8,
    description:
      'Live-сетка с выделенным текущим матчем и ссылками на официальные трансляции.',
    links: [
      { label: 'Правила live-матчей', url: '/tournaments/rift-division-live#rules' },
      { label: 'Twitch', url: 'https://twitch.tv/deadlockleague' }
    ],
    rules: ['Check-in за 15 минут.', 'Техническая пауза не более 10 минут.', 'Финал играется BO5.'],
    streamLinks: [
      { label: 'Main Twitch', url: 'https://twitch.tv/deadlockleague' },
      { label: 'B Stream', url: 'https://twitch.tv/deadlockleague_b' }
    ],
    currentMatch: {
      id: 'm-rift-final',
      title: 'Upper Final',
      teamA: 'Voltaic',
      teamB: 'Night Protocol',
      score: '2:1',
      startsAt: '2026-04-25T20:00:00+03:00',
      status: 'live',
      streamUrl: 'https://twitch.tv/deadlockleague'
    },
    liveMatches: [
      {
        id: 'm-rift-final',
        title: 'Upper Final',
        teamA: 'Voltaic',
        teamB: 'Night Protocol',
        score: '2:1',
        startsAt: '2026-04-25T20:00:00+03:00',
        status: 'live',
        streamUrl: 'https://twitch.tv/deadlockleague'
      }
    ],
    completedMatches: [
      {
        id: 'm-rift-r1',
        title: 'Quarterfinal',
        teamA: 'Neon Forge',
        teamB: 'Canal Owls',
        score: '2:0',
        startsAt: '2026-04-25T16:00:00+03:00',
        status: 'finished'
      }
    ],
    canApply: false,
    bracket: [
      { slotNo: 1, seed: 'QF1', state: 'finished', teamName: 'Neon Forge', score: '2' },
      { slotNo: 2, seed: 'QF1', state: 'finished', teamName: 'Canal Owls', score: '0' },
      { slotNo: 3, seed: 'QF2', state: 'live', teamName: 'Voltaic', score: '2' },
      { slotNo: 4, seed: 'QF2', state: 'live', teamName: 'Night Protocol', score: '1' },
      { slotNo: 5, seed: 'SF1', state: 'approved', teamName: 'Siberian Pulse' },
      { slotNo: 6, seed: 'SF1', state: 'approved', teamName: 'Iron Bloom' },
      { slotNo: 7, seed: 'SF2', state: 'approved', teamName: 'Solar Debt' },
      { slotNo: 8, seed: 'SF2', state: 'approved', teamName: 'Archive Zero' }
    ]
  },
  {
    id: 't-masters',
    slug: 'deadlock-masters-finals',
    title: 'DeadLock Masters Finals',
    status: 'finished',
    boFormat: 'BO5',
    startsAt: '2026-04-12T18:00:00+03:00',
    prizePool: '$20,000',
    imageUrl:
      'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80',
    registeredTeamsCount: 8,
    maxTeamsCount: 8,
    description: 'Завершенный турнир с победителем, финальным счетом и полной сеткой.',
    links: [{ label: 'Архив трансляции', url: 'https://twitch.tv/videos/deadlock-masters' }],
    rules: ['Финальный матч BO5.', 'Призовой фонд распределен между топ-4 командами.'],
    streamLinks: [{ label: 'VOD', url: 'https://twitch.tv/videos/deadlock-masters' }],
    winnerTeam: 'Neon Forge',
    finalScore: '3:2',
    currentMatch: undefined,
    liveMatches: [],
    completedMatches: [
      {
        id: 'm-master-final',
        title: 'Grand Final',
        teamA: 'Neon Forge',
        teamB: 'Voltaic',
        score: '3:2',
        startsAt: '2026-04-12T20:00:00+03:00',
        status: 'finished'
      },
      {
        id: 'm-master-third',
        title: 'Third place',
        teamA: 'Siberian Pulse',
        teamB: 'Night Protocol',
        score: '2:1',
        startsAt: '2026-04-12T18:00:00+03:00',
        status: 'finished'
      }
    ],
    canApply: false,
    bracket: [
      { slotNo: 1, seed: 'Final', state: 'finished', teamName: 'Neon Forge', score: '3' },
      { slotNo: 2, seed: 'Final', state: 'finished', teamName: 'Voltaic', score: '2' },
      { slotNo: 3, seed: '3rd', state: 'finished', teamName: 'Siberian Pulse', score: '2' },
      { slotNo: 4, seed: '3rd', state: 'finished', teamName: 'Night Protocol', score: '1' }
    ]
  }
];

export const notifications: NotificationDTO[] = [
  {
    id: 'nt-1',
    title: 'Инвайт в команду Shadow Six',
    body: 'Vex приглашает вас подтвердить участие в Neon Vault Open.',
    href: '/notifications',
    createdAt: '2026-04-24T12:00:00+03:00',
    read: false
  },
  {
    id: 'nt-2',
    title: 'Новая заявка ожидает решения',
    body: 'Canal Owls собрали состав и ждут решения организатора.',
    href: '/tournaments/neon-vault-open',
    createdAt: '2026-04-24T13:15:00+03:00',
    read: false
  },
  {
    id: 'nt-3',
    title: 'Расписание live-матчей обновлено',
    body: 'Rift Division Invitational стартует сегодня в 20:00.',
    href: '/tournaments/rift-division-live',
    createdAt: '2026-04-25T09:30:00+03:00',
    read: true
  }
];
