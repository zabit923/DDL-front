import type { Match, Season, Team, Tournament, TournamentBundle } from '../../../entities/season/model';

export type SeasonsResponse = Season[];
export type SeasonResponse = Season;
export type TournamentsResponse = Tournament[];
export type TournamentResponse = Tournament;
export type BracketResponse = TournamentBundle['bracket'];
export type ScheduleResponse = Match[];
export type StandingsResponse = TournamentBundle['standings'];
export type MatchResponse = Match;
export type TeamResponse = Team;
export type PlayerResponse = {
  slug: string;
  nickname: string;
  team: string;
  stats: { kd: number; adr: number; mvp: number };
};
export type RankingsResponse = Array<{ team: string; points: number }>;
export type StreamsResponse = Array<{ id: string; title: string; isLive: boolean; viewers: number; url: string }>;

export interface RegistrationRequest {
  tournamentSlug: string;
  teamName: string;
}

export interface CheckInRequest {
  matchId: string;
  player: string;
}

export interface ReportResultRequest {
  matchId: string;
  scoreA: number;
  scoreB: number;
}

export interface DisputeRequest {
  matchId: string;
  reason: string;
}

export interface RescheduleRequest {
  matchId: string;
  requestedAt: string;
}
