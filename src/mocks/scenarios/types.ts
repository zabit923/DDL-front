import type { LeagueSnapshot } from '../../entities/season/model';

export type ScenarioName =
  | 'preseason'
  | 'registration_open'
  | 'check_in_open'
  | 'live_round'
  | 'completed_event'
  | 'result_under_review'
  | 'dispute_open'
  | 'empty_league'
  | 'sponsor_heavy_homepage';

export type ScenarioMap = Record<ScenarioName, LeagueSnapshot>;
