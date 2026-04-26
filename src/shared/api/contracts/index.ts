export type PublicRole = 'guest';
export type AccountRole = 'user' | 'organizer' | 'admin';
export type Role = PublicRole | AccountRole;
export type LanguageCode = 'ru' | 'en';

export type TournamentStatus = 'upcoming' | 'live' | 'finished';

export type BoFormat = 'BO1' | 'BO3' | 'BO5';

export type SlotState = 'empty' | 'pending_members' | 'pending_admin' | 'approved' | 'live' | 'finished';

export type MatchStatus = 'scheduled' | 'live' | 'finished';

export type TournamentLinkKind = 'link' | 'stream';

export type ApplicationStatus =
  | 'draft'
  | 'pending_members'
  | 'pending_admin'
  | 'approved'
  | 'rejected';

export type TeamMemberStatus = 'captain' | 'active' | 'invited';

export interface UserDTO {
  id: string;
  username: string;
  telegram: string;
  telegramConfirmed: boolean;
  admin: boolean;
  role: AccountRole;
  avatarUrl?: string;
}

export interface AdminUserDTO extends UserDTO {
  teamId?: string;
  teamName?: string;
}

export interface AchievementDTO {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface TeamMemberDTO {
  userId: string;
  username: string;
  avatarUrl?: string;
  status: TeamMemberStatus;
}

export interface TeamDTO {
  id: string;
  name: string;
  captainId: string;
  members: TeamMemberDTO[];
  totalWins: number;
  createdAt: string;
}

export interface PendingTeamInviteDTO {
  inviteId: string;
  teamId: string;
  teamName: string;
  invitedByUserId: string;
  invitedByUsername: string;
  createdAt: string;
}

export interface ProfileDTO {
  user: UserDTO;
  team: TeamDTO | null;
  achievements: AchievementDTO[];
  pendingInvites: PendingTeamInviteDTO[];
}

export interface NewsLocalizedDTO {
  title?: string;
  teaser?: string;
  body?: string;
}

export interface NewsDTO {
  id: string;
  slug: string;
  title: string;
  teaser: string;
  body: string;
  publishedAt: string;
  imageUrl: string;
  localized?: Partial<Record<LanguageCode, NewsLocalizedDTO>>;
}

export interface TournamentLinkDTO {
  label: string;
  url: string;
}

export interface TournamentLocalizedDTO {
  title?: string;
  description?: string;
  prizePool?: string;
  links?: Record<string, string>;
  rules?: string[];
  matches?: Record<string, string>;
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
  localized?: Partial<Record<LanguageCode, TournamentLocalizedDTO>>;
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
  status: MatchStatus;
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
  teamId: string;
  teamName: string;
  captainId: string;
  members: string[];
  status: ApplicationStatus;
  createdAt: string;
}

export interface CreateApplicationDTO {
  slotNo: number;
  teamId: string;
}

export interface NotificationLocalizedDTO {
  title?: string;
  body?: string;
}

export interface NotificationDTO {
  id: string;
  recipientId?: string;
  title: string;
  body: string;
  localized?: Partial<Record<LanguageCode, NotificationLocalizedDTO>>;
  href: string;
  createdAt: string;
  read: boolean;
}

export interface HomeDTO {
  featuredTournament: TournamentDetailDTO;
  latestNews: NewsDTO[];
  counters: {
    tournaments: number;
    users: number;
    applications: number;
  };
}

export interface LoginRequestDTO {
  telegram: string;
  password: string;
}

export interface RegisterRequestDTO {
  username: string;
  password: string;
  telegram: string;
}

export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
  tokenType: 'bearer';
  expiresIn: number;
}

export interface AuthResponseDTO extends AuthTokensDTO {
  user: UserDTO;
  telegramConfirmationUrl?: string;
}

export interface TelegramConfirmationResponseDTO {
  telegramConfirmationUrl?: string;
}

export interface UpdateUserRequestDTO {
  username: string;
  telegram?: string;
  avatarUrl?: string;
}

export interface AvatarUploadResponseDTO {
  avatarUrl: string;
}

export interface ImageUploadResponseDTO {
  imageUrl: string;
}

export interface CreateTeamRequestDTO {
  name: string;
}

export interface RenameTeamRequestDTO {
  name: string;
}

export interface InviteTeamMemberRequestDTO {
  username: string;
}

export interface UnreadCountDTO {
  count: number;
}

export interface ErrorResponseDTO {
  detail: string | Array<Record<string, unknown>>;
  code?: string;
  field?: string;
}

export interface PaginatedResponseDTO<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminNewsCreateRequestDTO {
  slug: string;
  title: string;
  teaser: string;
  body: string;
  imageUrl: string;
  publishedAt?: string;
  localized?: Partial<Record<LanguageCode, NewsLocalizedDTO>>;
}

export type AdminNewsUpdateRequestDTO = Partial<AdminNewsCreateRequestDTO>;

export interface AdminTournamentLinkPayloadDTO {
  label: string;
  url: string;
  kind: TournamentLinkKind;
  sortOrder: number;
}

export interface AdminTournamentRulePayloadDTO {
  body: string;
  sortOrder: number;
}

export interface AdminBracketSlotPayloadDTO {
  slotNo: number;
  seed: string;
  state: SlotState;
  teamId?: string;
  applicationId?: string;
  score?: string;
}

export interface AdminMatchPayloadDTO {
  title: string;
  teamA: string;
  teamB: string;
  score: string;
  startsAt: string;
  status: MatchStatus;
  streamUrl?: string;
}

export interface AdminTournamentCreateRequestDTO {
  slug: string;
  title: string;
  status: TournamentStatus;
  boFormat: BoFormat;
  startsAt: string;
  prizePool: string;
  imageUrl: string;
  maxTeamsCount: number;
  description: string;
  canApply: boolean;
  winnerTeam?: string;
  finalScore?: string;
  localized?: Partial<Record<LanguageCode, TournamentLocalizedDTO>>;
  links: AdminTournamentLinkPayloadDTO[];
  rules: AdminTournamentRulePayloadDTO[];
  bracket: AdminBracketSlotPayloadDTO[];
  matches: AdminMatchPayloadDTO[];
}

export type AdminTournamentUpdateRequestDTO = Partial<AdminTournamentCreateRequestDTO>;

export interface AdminApplicationActionRequestDTO {
  reason?: string;
}

export const apiRoutes = {
  home: '/home',
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    me: '/auth/me',
    telegramConfirmation: '/auth/telegram-confirmation',
    logout: '/auth/logout'
  },
  users: {
    me: '/users/me',
    avatar: '/users/me/avatar',
    search: '/users/search'
  },
  profile: '/profile',
  teams: {
    create: '/teams',
    update: '/teams/:teamId',
    invite: '/teams/:teamId/invites',
    acceptInvite: '/teams/invites/:inviteId/accept',
    declineInvite: '/teams/invites/:inviteId/decline',
    removeMember: '/teams/:teamId/members/:userId'
  },
  news: {
    list: '/news',
    detail: '/news/:slug'
  },
  tournaments: {
    list: '/tournaments',
    detail: '/tournaments/:slug',
    applications: '/tournaments/:slug/applications'
  },
  notifications: {
    list: '/notifications',
    unreadCount: '/notifications/unread-count',
    read: '/notifications/:id/read',
    websocket: '/ws/notifications'
  },
  admin: {
    applications: '/admin/applications',
    approveApplication: '/admin/applications/:applicationId/approve',
    rejectApplication: '/admin/applications/:applicationId/reject',
    users: '/admin/users',
    userItem: '/admin/users/:userId',
    uploadImage: '/admin/uploads/images',
    news: '/admin/news',
    newsItem: '/admin/news/:newsId',
    tournaments: '/admin/tournaments',
    tournamentItem: '/admin/tournaments/:tournamentId'
  }
} as const;
