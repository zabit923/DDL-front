import type { LeagueSnapshot } from '../../entities/season/model';

export const baseSnapshot: LeagueSnapshot = {
  seasons: [
    {
      id: 's1',
      slug: 'spring-2026',
      title: 'Spring Split 2026',
      subtitle: 'Открытый сезон DeadLock League',
      year: 2026,
      active: true,
      pointsTable: [
        { team: 'Neon Forge', points: 225, delta: 12 },
        { team: 'Voltaic', points: 210, delta: 8 },
        { team: 'Siberian Pulse', points: 193, delta: -4 },
        { team: 'Night Protocol', points: 187, delta: 3 }
      ]
    }
  ],
  tournaments: [
    {
      id: 't1',
      slug: 'dl-open-cup-1',
      seasonSlug: 'spring-2026',
      name: 'DL Open Cup #1',
      region: 'CIS',
      format: 'double_elimination',
      status: 'live',
      startsAt: '2026-04-21T16:00:00+03:00',
      prizePool: '$10,000',
      participantsCount: 16,
      heroImage:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      tabs: ['overview', 'bracket', 'schedule', 'standings', 'participants', 'rules', 'media']
    },
    {
      id: 't2',
      slug: 'dl-swiss-challenger',
      seasonSlug: 'spring-2026',
      name: 'Swiss Challenger',
      region: 'EU',
      format: 'swiss',
      status: 'registration_open',
      startsAt: '2026-05-02T18:00:00+03:00',
      prizePool: '$4,000',
      participantsCount: 32,
      heroImage:
        'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1200&q=80',
      tabs: ['overview', 'schedule', 'standings', 'participants', 'rules', 'media']
    }
  ],
  matches: [
    {
      id: 'm1',
      tournamentSlug: 'dl-open-cup-1',
      phase: 'Upper Bracket',
      round: 'R1',
      teamA: 'Neon Forge',
      teamB: 'Voltaic',
      scoreA: 1,
      scoreB: 0,
      status: 'live',
      startsAt: '2026-04-21T16:30:00+03:00',
      streamUrl: 'https://twitch.tv/deadlockleague',
      map: 'Canals',
      side: 'attack',
      pickBan: 'Neon Forge ban Mirage, Voltaic ban Bastion',
      resultHistory: ['16:28 check-in complete', '16:34 map 1 started']
    },
    {
      id: 'm2',
      tournamentSlug: 'dl-open-cup-1',
      phase: 'Upper Bracket',
      round: 'R1',
      teamA: 'Siberian Pulse',
      teamB: 'Night Protocol',
      scoreA: 0,
      scoreB: 0,
      status: 'ready_for_check_in',
      startsAt: '2026-04-21T17:15:00+03:00',
      streamUrl: 'https://twitch.tv/deadlockleague',
      resultHistory: ['17:00 ready for match check-in']
    }
  ],
  teams: [
    { slug: 'neon-forge', name: 'Neon Forge', region: 'CIS', roster: ['Nox', 'Rift', 'Basil', 'Kio', 'Trix'], seasonPoints: 225 },
    { slug: 'voltaic', name: 'Voltaic', region: 'EU', roster: ['Seth', 'Bite', 'Lumen', 'Flair', 'Moro'], seasonPoints: 210 },
    {
      slug: 'siberian-pulse',
      name: 'Siberian Pulse',
      region: 'CIS',
      roster: ['Skel', 'Mir', 'Aero', 'M8', 'Yuri'],
      seasonPoints: 193
    },
    {
      slug: 'night-protocol',
      name: 'Night Protocol',
      region: 'EU',
      roster: ['Dex', 'Rav', 'Rho', 'Lex', 'Puma'],
      seasonPoints: 187
    }
  ],
  players: [
    { slug: 'nox', nickname: 'Nox', team: 'Neon Forge', role: 'captain', stats: { kd: 1.24, adr: 87, mvp: 9 } },
    { slug: 'rift', nickname: 'Rift', team: 'Neon Forge', role: 'rifler', stats: { kd: 1.11, adr: 80, mvp: 4 } },
    { slug: 'seth', nickname: 'Seth', team: 'Voltaic', role: 'captain', stats: { kd: 1.18, adr: 83, mvp: 7 } }
  ],
  streams: [
    {
      id: 'st1',
      title: 'DL Open Cup #1: Main Broadcast',
      isLive: true,
      viewers: 4821,
      url: 'https://twitch.tv/deadlockleague'
    },
    { id: 'st2', title: 'Analyst Desk', isLive: false, viewers: 0, url: 'https://youtube.com/@deadlockleague' }
  ],
  sponsors: [
    { id: 'sp1', name: 'VOLT', tier: 'title' },
    { id: 'sp2', name: 'Krypton', tier: 'gold' },
    { id: 'sp3', name: 'CloudPay', tier: 'gold' },
    { id: 'sp4', name: 'VectorSeat', tier: 'partner' }
  ],
  news: [
    {
      id: 'n1',
      slug: 'season-launch',
      title: 'Spring Split officially launched',
      publishedAt: '2026-04-15T10:00:00+03:00',
      teaser: 'Открыли регистрацию и анонсировали призовой фонд сезона.'
    },
    {
      id: 'n2',
      slug: 'broadcast-team',
      title: 'Broadcast team announced',
      publishedAt: '2026-04-18T13:30:00+03:00',
      teaser: 'Кастеры и аналитики первого кубка сезона.'
    }
  ],
  rankings: [
    { team: 'Neon Forge', points: 225 },
    { team: 'Voltaic', points: 210 },
    { team: 'Siberian Pulse', points: 193 },
    { team: 'Night Protocol', points: 187 }
  ],
  tournamentBundles: {
    'dl-open-cup-1': {
      tournament: {
        id: 't1',
        slug: 'dl-open-cup-1',
        seasonSlug: 'spring-2026',
        name: 'DL Open Cup #1',
        region: 'CIS',
        format: 'double_elimination',
        status: 'live',
        startsAt: '2026-04-21T16:00:00+03:00',
        prizePool: '$10,000',
        participantsCount: 16,
        heroImage:
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        tabs: ['overview', 'bracket', 'schedule', 'standings', 'participants', 'rules', 'media']
      },
      bracket: [
        { id: 'b1', round: 'UB R1', teamA: 'Neon Forge', teamB: 'Voltaic', scoreA: 1, scoreB: 0, nextMatchId: 'b3' },
        { id: 'b2', round: 'UB R1', teamA: 'Siberian Pulse', teamB: 'Night Protocol', nextMatchId: 'b3' },
        { id: 'b3', round: 'UB R2', teamA: 'Winner b1', teamB: 'Winner b2' }
      ],
      schedule: [],
      standings: [
        { team: 'Neon Forge', wins: 3, losses: 0, points: 9 },
        { team: 'Voltaic', wins: 2, losses: 1, points: 6 },
        { team: 'Siberian Pulse', wins: 1, losses: 2, points: 3 },
        { team: 'Night Protocol', wins: 0, losses: 3, points: 0 }
      ],
      participants: [],
      rulesMarkdown:
        '# Rules\n\n- Check-in за 15 минут до матча.\n- BO3 в плей-офф.\n- Споры оформляются в течение 10 минут после матча.'
    },
    'dl-swiss-challenger': {
      tournament: {
        id: 't2',
        slug: 'dl-swiss-challenger',
        seasonSlug: 'spring-2026',
        name: 'Swiss Challenger',
        region: 'EU',
        format: 'swiss',
        status: 'registration_open',
        startsAt: '2026-05-02T18:00:00+03:00',
        prizePool: '$4,000',
        participantsCount: 32,
        heroImage:
          'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1200&q=80',
        tabs: ['overview', 'schedule', 'standings', 'participants', 'rules', 'media']
      },
      bracket: [],
      schedule: [],
      standings: [],
      participants: [],
      rulesMarkdown: '# Rules\n\nSwiss формат: 5 раундов, затем топ-8 в single elimination.'
    }
  }
};
