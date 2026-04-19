import { httpGet, httpPost } from '../client/httpClient';
import type {
  BracketResponse,
  CheckInRequest,
  DisputeRequest,
  MatchResponse,
  PlayerResponse,
  RankingsResponse,
  RegistrationRequest,
  ReportResultRequest,
  RescheduleRequest,
  ScheduleResponse,
  SeasonResponse,
  SeasonsResponse,
  StandingsResponse,
  StreamsResponse,
  TeamResponse,
  TournamentResponse,
  TournamentsResponse
} from '../contracts';

export const getSeasons = () => httpGet<SeasonsResponse>('/api/seasons');
export const getSeason = (slug: string) => httpGet<SeasonResponse>(`/api/seasons/${slug}`);
export const getTournaments = () => httpGet<TournamentsResponse>('/api/tournaments');
export const getTournament = (slug: string) => httpGet<TournamentResponse>(`/api/tournaments/${slug}`);
export const getTournamentBracket = (slug: string) => httpGet<BracketResponse>(`/api/tournaments/${slug}/bracket`);
export const getTournamentSchedule = (slug: string) => httpGet<ScheduleResponse>(`/api/tournaments/${slug}/schedule`);
export const getTournamentStandings = (slug: string) => httpGet<StandingsResponse>(`/api/tournaments/${slug}/standings`);
export const getMatch = (id: string) => httpGet<MatchResponse>(`/api/matches/${id}`);
export const getTeam = (slug: string) => httpGet<TeamResponse>(`/api/teams/${slug}`);
export const getPlayer = (slug: string) => httpGet<PlayerResponse>(`/api/players/${slug}`);
export const getRankings = () => httpGet<RankingsResponse>('/api/rankings');
export const getStreams = () => httpGet<StreamsResponse>('/api/streams');

export const postRegistration = (payload: RegistrationRequest) => httpPost('/api/registrations', payload);
export const postCheckIn = (payload: CheckInRequest) => httpPost('/api/check-in', payload);
export const postMatchReport = (id: string, payload: ReportResultRequest) => httpPost(`/api/matches/${id}/report`, payload);
export const postDispute = (payload: DisputeRequest) => httpPost('/api/disputes', payload);
export const postRescheduleRequest = (payload: RescheduleRequest) => httpPost('/api/reschedule-requests', payload);
