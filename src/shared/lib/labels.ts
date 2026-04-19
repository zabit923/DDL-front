import type { MatchStatus, TournamentFormat, TournamentStatus } from '../../entities/season/model';
import type { TranslationKey } from '../i18n/translations';

export const statusKeyMap: Record<TournamentStatus, TranslationKey> = {
  draft: 'status_draft',
  published: 'status_published',
  registration_open: 'status_registration_open',
  check_in_open: 'status_check_in_open',
  live: 'status_live',
  completed: 'status_completed',
  archived: 'status_archived'
};

export const matchStatusKeyMap: Record<MatchStatus, TranslationKey> = {
  scheduled: 'match_status_scheduled',
  ready_for_check_in: 'match_status_ready_for_check_in',
  live: 'status_live',
  result_submitted: 'match_status_result_submitted',
  under_review: 'match_status_under_review',
  finished: 'match_status_finished'
};

export const formatKeyMap: Record<TournamentFormat, TranslationKey> = {
  single_elimination: 'format_single_elimination',
  double_elimination: 'format_double_elimination',
  round_robin: 'format_round_robin',
  swiss: 'format_swiss'
};
