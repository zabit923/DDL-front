import { baseSnapshot } from '../db/baseSnapshot';
import type { LeagueSnapshot, MatchStatus, TournamentStatus } from '../../entities/season/model';
import type { ScenarioMap } from './types';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const setTournamentStatus = (snapshot: LeagueSnapshot, status: TournamentStatus) => {
  snapshot.tournaments.forEach((t) => (t.status = status));
  Object.values(snapshot.tournamentBundles).forEach((bundle) => {
    bundle.tournament.status = status;
  });
};

const setMatchStatus = (snapshot: LeagueSnapshot, status: MatchStatus) => {
  snapshot.matches.forEach((m) => (m.status = status));
};

const preseason = (() => {
  const s = clone(baseSnapshot);
  setTournamentStatus(s, 'draft');
  setMatchStatus(s, 'scheduled');
  s.streams.forEach((st) => {
    st.isLive = false;
    st.viewers = 0;
  });
  return s;
})();

const registrationOpen = (() => {
  const s = clone(baseSnapshot);
  setTournamentStatus(s, 'registration_open');
  setMatchStatus(s, 'scheduled');
  return s;
})();

const checkInOpen = (() => {
  const s = clone(baseSnapshot);
  setTournamentStatus(s, 'check_in_open');
  setMatchStatus(s, 'ready_for_check_in');
  return s;
})();

const liveRound = (() => {
  const s = clone(baseSnapshot);
  setTournamentStatus(s, 'live');
  setMatchStatus(s, 'live');
  return s;
})();

const completedEvent = (() => {
  const s = clone(baseSnapshot);
  setTournamentStatus(s, 'completed');
  setMatchStatus(s, 'finished');
  return s;
})();

const resultUnderReview = (() => {
  const s = clone(baseSnapshot);
  setTournamentStatus(s, 'live');
  setMatchStatus(s, 'under_review');
  s.matches[0].resultHistory.push('17:45 score submitted, pending moderation');
  return s;
})();

const disputeOpen = (() => {
  const s = clone(baseSnapshot);
  setTournamentStatus(s, 'live');
  setMatchStatus(s, 'result_submitted');
  s.matches[0].resultHistory.push('17:49 dispute opened by player');
  return s;
})();

const emptyLeague = (() => {
  const s = clone(baseSnapshot);
  s.tournaments = [];
  s.matches = [];
  s.streams = [];
  s.news = [];
  s.rankings = [];
  s.tournamentBundles = {};
  return s;
})();

const sponsorHeavyHomepage = (() => {
  const s = clone(baseSnapshot);
  s.sponsors = [
    ...s.sponsors,
    { id: 'sp5', name: 'Neon ISP', tier: 'partner' },
    { id: 'sp6', name: 'Energy Titan', tier: 'partner' },
    { id: 'sp7', name: 'ByteCell', tier: 'gold' }
  ];
  return s;
})();

export const scenarios: ScenarioMap = {
  preseason,
  registration_open: registrationOpen,
  check_in_open: checkInOpen,
  live_round: liveRound,
  completed_event: completedEvent,
  result_under_review: resultUnderReview,
  dispute_open: disputeOpen,
  empty_league: emptyLeague,
  sponsor_heavy_homepage: sponsorHeavyHomepage
};
