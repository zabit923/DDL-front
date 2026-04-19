import type {
  LeagueSnapshot,
  Match,
  Player,
  Role,
  Season,
  StreamItem,
  Team,
  Tournament,
  TournamentBundle
} from '../../entities/season/model';
import { config } from '../../shared/config/env';
import { scenarios } from '../scenarios/scenarios';
import type { ScenarioName } from '../scenarios/types';

const wait = (ms = 220) => new Promise((r) => setTimeout(r, ms));

const getScenarioName = (url?: URL): ScenarioName => {
  const fromQuery = url?.searchParams.get('scenario') as ScenarioName | null;
  if (fromQuery && scenarios[fromQuery]) return fromQuery;
  return (config.defaultScenario in scenarios ? config.defaultScenario : 'sponsor_heavy_homepage') as ScenarioName;
};

const getSnapshot = (url?: URL): LeagueSnapshot => scenarios[getScenarioName(url)];

export interface LeagueRepository {
  getHome(url?: URL): Promise<{ season?: Season; upcoming?: Tournament; liveMatches: Match[]; streams: StreamItem[] }>;
  getSeasons(url?: URL): Promise<Season[]>;
  getSeason(slug: string, url?: URL): Promise<Season | undefined>;
  getTournaments(url?: URL): Promise<Tournament[]>;
  getTournamentBundle(slug: string, url?: URL): Promise<TournamentBundle | undefined>;
  getMatch(id: string, url?: URL): Promise<Match | undefined>;
  getTeams(url?: URL): Promise<Team[]>;
  getTeam(slug: string, url?: URL): Promise<Team | undefined>;
  getPlayer(slug: string, url?: URL): Promise<Player | undefined>;
  getRankings(url?: URL): Promise<Array<{ team: string; points: number }>>;
  getNews(url?: URL): Promise<LeagueSnapshot['news']>;
  getStreams(url?: URL): Promise<StreamItem[]>;
  getSponsors(url?: URL): Promise<LeagueSnapshot['sponsors']>;
  getMarkdownPage(kind: 'rules' | 'faq', url?: URL): Promise<string>;
  performAction(action: 'register' | 'check-in' | 'report-result' | 'dispute', role: Role): Promise<{ ok: boolean; message: string }>;
}

const mockRepository: LeagueRepository = {
  async getHome(url) {
    await wait();
    const snapshot = getSnapshot(url);
    return {
      season: snapshot.seasons.find((s) => s.active),
      upcoming: snapshot.tournaments[0],
      liveMatches: snapshot.matches.slice(0, 3),
      streams: snapshot.streams
    };
  },
  async getSeasons(url) {
    await wait();
    return getSnapshot(url).seasons;
  },
  async getSeason(slug, url) {
    await wait();
    return getSnapshot(url).seasons.find((s) => s.slug === slug);
  },
  async getTournaments(url) {
    await wait();
    return getSnapshot(url).tournaments;
  },
  async getTournamentBundle(slug, url) {
    await wait();
    const snapshot = getSnapshot(url);
    const bundle = snapshot.tournamentBundles[slug];
    if (!bundle) return undefined;
    return {
      ...bundle,
      schedule: snapshot.matches.filter((m) => m.tournamentSlug === slug),
      participants: snapshot.teams
    };
  },
  async getMatch(id, url) {
    await wait();
    return getSnapshot(url).matches.find((m) => m.id === id);
  },
  async getTeams(url) {
    await wait();
    return getSnapshot(url).teams;
  },
  async getTeam(slug, url) {
    await wait();
    return getSnapshot(url).teams.find((t) => t.slug === slug);
  },
  async getPlayer(slug, url) {
    await wait();
    return getSnapshot(url).players.find((p) => p.slug === slug);
  },
  async getRankings(url) {
    await wait();
    return getSnapshot(url).rankings;
  },
  async getNews(url) {
    await wait();
    return getSnapshot(url).news;
  },
  async getStreams(url) {
    await wait();
    return getSnapshot(url).streams;
  },
  async getSponsors(url) {
    await wait();
    return getSnapshot(url).sponsors;
  },
  async getMarkdownPage(kind) {
    await wait(120);
    if (kind === 'rules') {
      return '# Rulebook\n\n- Tournament check-in: 15 минут до старта.\n- Match check-in: кнопка подтверждения готовности в карточке матча.\n- Report Result: после взаимного check-in.';
    }
    return '# FAQ\n\n## Как зарегистрироваться?\nНажмите Register на странице турнира.\n\n## Как открыть спор?\nНа странице матча нажмите Open dispute.';
  },
  async performAction(action, role) {
    await wait(450);
    const allowed: Record<Role, Array<typeof action>> = {
      guest: [],
      player: ['register', 'check-in', 'report-result', 'dispute'],
      admin: ['register', 'check-in', 'report-result', 'dispute']
    };
    if (!allowed[role].includes(action)) {
      return { ok: false, message: `Role ${role} cannot execute ${action}` };
    }
    return { ok: true, message: `${action} completed (mock flow)` };
  }
};

const apiRepository: LeagueRepository = {
  ...mockRepository,
  async getHome() {
    throw new Error('API source is scaffolded but intentionally disconnected in MVP');
  }
};

export const leagueRepository: LeagueRepository = config.dataSource === 'api' ? apiRepository : mockRepository;
