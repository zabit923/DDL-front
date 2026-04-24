export type Role = 'guest' | 'user';

export type TournamentStatus = 'upcoming' | 'live' | 'finished';

export type BoFormat = 'BO1' | 'BO3' | 'BO5';

export type SlotState = 'empty' | 'pending_members' | 'pending_admin' | 'approved' | 'live' | 'finished';

export type ApplicationStatus =
  | 'draft'
  | 'pending_members'
  | 'pending_admin'
  | 'approved'
  | 'rejected';

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  role: Exclude<Role, 'guest'>;
  avatarUrl?: string;
}

export interface NewsDTO {
  id: string;
  slug: string;
  title: string;
  teaser: string;
  body: string;
  publishedAt: string;
  imageUrl: string;
}

export interface TournamentLinkDTO {
  label: string;
  url: string;
}

export interface TournamentSummaryDTO {
  id: string;
  slug: string;
  title: string;
  status: TournamentStatus;
  boFormat: BoFormat;
  startsAt: string;
  prizePool: string;
  imageUrl: string;
  registeredTeamsCount: number;
  maxTeamsCount: number;
  description: string;
}

export interface BracketSlotDTO {
  slotNo: number;
  seed: string;
  state: SlotState;
  teamName?: string;
  applicationId?: string;
  members?: string[];
  score?: string;
}

export interface MatchDTO {
  id: string;
  title: string;
  teamA: string;
  teamB: string;
  score: string;
  startsAt: string;
  status: 'scheduled' | 'live' | 'finished';
  streamUrl?: string;
}

export interface TournamentDetailDTO extends TournamentSummaryDTO {
  links: TournamentLinkDTO[];
  bracket: BracketSlotDTO[];
  rules: string[];
  streamLinks: TournamentLinkDTO[];
  currentMatch?: MatchDTO;
  liveMatches: MatchDTO[];
  completedMatches: MatchDTO[];
  winnerTeam?: string;
  finalScore?: string;
  canApply: boolean;
  myApplication?: ApplicationDTO;
}

export interface ApplicationDTO {
  id: string;
  tournamentSlug: string;
  slotNo: number;
  teamName: string;
  captainId: string;
  members: string[];
  status: ApplicationStatus;
  createdAt: string;
}

export interface CreateApplicationDTO {
  slotNo: number;
  teamName: string;
  members: string[];
}

export interface NotificationDTO {
  id: string;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
}

/*
Future FastAPI contracts. Runtime intentionally uses mocks now.

POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/logout

GET /news
GET /news/{slug}

GET /tournaments?status=upcoming|live|finished
GET /tournaments/{slug}
GET /tournaments/{slug}/bracket
GET /users/search?q=

POST /tournaments/{slug}/applications
GET /applications/{id}
POST /applications/{id}/members/{user_id}/accept
POST /applications/{id}/members/{user_id}/decline
PATCH /applications/{id}

GET /notifications
POST /notifications/{id}/read
WS /ws/notifications
*/
