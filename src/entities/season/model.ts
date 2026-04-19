export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';

export type TournamentStatus =
  | 'draft'
  | 'published'
  | 'registration_open'
  | 'check_in_open'
  | 'live'
  | 'completed'
  | 'archived';

export type MatchStatus =
  | 'scheduled'
  | 'ready_for_check_in'
  | 'live'
  | 'result_submitted'
  | 'under_review'
  | 'finished';

export type Role = 'guest' | 'player' | 'admin';

export interface Season {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  year: number;
  active: boolean;
  pointsTable: Array<{ team: string; points: number; delta: number }>;
}

export interface Tournament {
  id: string;
  slug: string;
  seasonSlug: string;
  name: string;
  region: string;
  format: TournamentFormat;
  status: TournamentStatus;
  startsAt: string;
  prizePool: string;
  participantsCount: number;
  heroImage: string;
  tabs: string[];
}

export interface Match {
  id: string;
  tournamentSlug: string;
  phase: string;
  round: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  startsAt: string;
  streamUrl?: string;
  vodUrl?: string;
  map?: string;
  side?: 'attack' | 'defense';
  pickBan?: string;
  resultHistory: string[];
}

export interface Team {
  slug: string;
  name: string;
  region: string;
  roster: string[];
  seasonPoints: number;
}

export interface Player {
  slug: string;
  nickname: string;
  team: string;
  role: string;
  stats: { kd: number; adr: number; mvp: number };
}

export interface StreamItem {
  id: string;
  title: string;
  isLive: boolean;
  viewers: number;
  url: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'title' | 'gold' | 'partner';
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  teaser: string;
}

export interface BracketNode {
  id: string;
  round: string;
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
  nextMatchId?: string;
}

export interface TournamentBundle {
  tournament: Tournament;
  bracket: BracketNode[];
  schedule: Match[];
  standings: Array<{ team: string; wins: number; losses: number; points: number }>;
  participants: Team[];
  rulesMarkdown: string;
}

export interface LeagueSnapshot {
  seasons: Season[];
  tournaments: Tournament[];
  matches: Match[];
  teams: Team[];
  players: Player[];
  streams: StreamItem[];
  sponsors: Sponsor[];
  news: NewsItem[];
  rankings: Array<{ team: string; points: number }>;
  tournamentBundles: Record<string, TournamentBundle>;
}
