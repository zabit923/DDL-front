import { apiRequest, clearAuthTokens, setAuthTokens } from './client';
import type {
  AdminApplicationActionRequestDTO,
  AdminNewsCreateRequestDTO,
  AdminNewsUpdateRequestDTO,
  AdminTournamentCreateRequestDTO,
  AdminTournamentUpdateRequestDTO,
  AdminUserDTO,
  ApplicationDTO,
  ApplicationStatus,
  AuthResponseDTO,
  AvatarUploadResponseDTO,
  CreateApplicationDTO,
  HomeDTO,
  ImageUploadResponseDTO,
  LanguageCode,
  NewsDTO,
  NotificationDTO,
  PaginatedResponseDTO,
  ProfileDTO,
  TelegramConfirmationResponseDTO,
  TournamentDetailDTO,
  TournamentStatus,
  UnreadCountDTO,
  UpdateUserRequestDTO,
  UserDTO
} from './contracts';

const getLanguage = (): LanguageCode => (localStorage.getItem('ddl-language') === 'ru' ? 'ru' : 'en');

const unwrapItems = <T>(response: T[] | PaginatedResponseDTO<T>) => (Array.isArray(response) ? response : response.items);

export const authRepository = {
  async login(telegram: string, password: string): Promise<AuthResponseDTO> {
    const response = await apiRequest<AuthResponseDTO>('/auth/login', {
      method: 'POST',
      body: { telegram, password },
      auth: false
    });

    setAuthTokens(response);
    return response;
  },

  async register(username: string, telegram: string, password: string): Promise<AuthResponseDTO> {
    const response = await apiRequest<AuthResponseDTO>('/auth/register', {
      method: 'POST',
      body: { username, telegram, password },
      auth: false
    });

    setAuthTokens(response);
    return response;
  },

  me() {
    return apiRequest<UserDTO>('/auth/me');
  },

  telegramConfirmation() {
    return apiRequest<TelegramConfirmationResponseDTO>('/auth/telegram-confirmation');
  },

  async logout() {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
    } finally {
      clearAuthTokens();
    }
  }
};

export const newsRepository = {
  async list(): Promise<NewsDTO[]> {
    const response = await apiRequest<NewsDTO[] | PaginatedResponseDTO<NewsDTO>>('/news', {
      query: { lang: getLanguage() }
    });

    return unwrapItems(response);
  },

  get(slug: string) {
    return apiRequest<NewsDTO>(`/news/${encodeURIComponent(slug)}`, {
      query: { lang: getLanguage() }
    });
  }
};

export const tournamentsRepository = {
  async list(status?: TournamentStatus | 'all'): Promise<TournamentDetailDTO[]> {
    const response = await apiRequest<TournamentDetailDTO[] | PaginatedResponseDTO<TournamentDetailDTO>>('/tournaments', {
      query: {
        status: status && status !== 'all' ? status : undefined,
        lang: getLanguage()
      }
    });

    return unwrapItems(response);
  },

  get(slug: string) {
    return apiRequest<TournamentDetailDTO>(`/tournaments/${encodeURIComponent(slug)}`, {
      query: { lang: getLanguage() }
    });
  },

  getHome() {
    return apiRequest<HomeDTO>('/home', {
      query: { lang: getLanguage() }
    });
  }
};

export const profileRepository = {
  get() {
    return apiRequest<ProfileDTO>('/profile');
  },

  updateUser(payload: UpdateUserRequestDTO) {
    return apiRequest<ProfileDTO>('/users/me', {
      method: 'PATCH',
      body: payload
    });
  },

  async uploadAvatar(file: File) {
    const body = new FormData();
    body.set('file', file);

    return apiRequest<AvatarUploadResponseDTO>('/users/me/avatar', {
      method: 'POST',
      body
    });
  },

  createTeam(name: string) {
    return apiRequest<ProfileDTO>('/teams', {
      method: 'POST',
      body: { name }
    });
  },

  renameTeam(teamId: string, name: string) {
    return apiRequest<ProfileDTO>(`/teams/${encodeURIComponent(teamId)}`, {
      method: 'PATCH',
      body: { name }
    });
  },

  inviteMember(teamId: string, username: string) {
    return apiRequest<ProfileDTO>(`/teams/${encodeURIComponent(teamId)}/invites`, {
      method: 'POST',
      body: { username }
    });
  },

  acceptInvite(inviteId: string) {
    return apiRequest<ProfileDTO>(`/teams/invites/${encodeURIComponent(inviteId)}/accept`, {
      method: 'POST'
    });
  },

  declineInvite(inviteId: string) {
    return apiRequest<ProfileDTO>(`/teams/invites/${encodeURIComponent(inviteId)}/decline`, {
      method: 'POST'
    });
  },

  removeMember(teamId: string, userId: string) {
    return apiRequest<ProfileDTO>(`/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
  }
};

export const applicationsRepository = {
  submit(tournamentSlug: string, payload: CreateApplicationDTO) {
    return apiRequest<ApplicationDTO>(`/tournaments/${encodeURIComponent(tournamentSlug)}/applications`, {
      method: 'POST',
      body: payload
    });
  }
};

export const usersRepository = {
  async search(query: string): Promise<UserDTO[]> {
    const response = await apiRequest<UserDTO[] | PaginatedResponseDTO<UserDTO>>('/users/search', {
      query: { q: query }
    });

    return unwrapItems(response);
  }
};

export const notificationsRepository = {
  async list(): Promise<NotificationDTO[]> {
    const response = await apiRequest<NotificationDTO[] | PaginatedResponseDTO<NotificationDTO>>('/notifications', {
      query: { lang: getLanguage() }
    });

    return unwrapItems(response);
  },

  async unreadCount() {
    const response = await apiRequest<UnreadCountDTO>('/notifications/unread-count');
    return response.count;
  },

  markRead(id: string) {
    return apiRequest<void>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: 'POST'
    });
  }
};

export const adminRepository = {
  async listUsers(query = '', limit = 100, teamQuery = ''): Promise<AdminUserDTO[]> {
    const response = await apiRequest<AdminUserDTO[] | PaginatedResponseDTO<AdminUserDTO>>('/admin/users', {
      query: {
        q: query || undefined,
        team: teamQuery || undefined,
        limit
      }
    });

    return unwrapItems(response);
  },

  deleteUser(id: string) {
    return apiRequest<void>(`/admin/users/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  async uploadImage(file: File) {
    const body = new FormData();
    body.set('file', file);

    return apiRequest<ImageUploadResponseDTO>('/admin/uploads/images', {
      method: 'POST',
      body
    });
  },

  async listApplications(status?: ApplicationStatus | 'all', query = ''): Promise<ApplicationDTO[]> {
    const response = await apiRequest<ApplicationDTO[] | PaginatedResponseDTO<ApplicationDTO>>('/admin/applications', {
      query: {
        status: status && status !== 'all' ? status : undefined,
        q: query || undefined
      }
    });

    return unwrapItems(response);
  },

  approveApplication(id: string, payload: AdminApplicationActionRequestDTO = {}) {
    return apiRequest<ApplicationDTO>(`/admin/applications/${encodeURIComponent(id)}/approve`, {
      method: 'POST',
      body: payload
    });
  },

  rejectApplication(id: string, payload: AdminApplicationActionRequestDTO = {}) {
    return apiRequest<ApplicationDTO>(`/admin/applications/${encodeURIComponent(id)}/reject`, {
      method: 'POST',
      body: payload
    });
  },

  createNews(payload: AdminNewsCreateRequestDTO) {
    return apiRequest<NewsDTO>('/admin/news', {
      method: 'POST',
      body: payload
    });
  },

  updateNews(id: string, payload: AdminNewsUpdateRequestDTO) {
    return apiRequest<NewsDTO>(`/admin/news/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: payload
    });
  },

  deleteNews(id: string) {
    return apiRequest<void>(`/admin/news/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  createTournament(payload: AdminTournamentCreateRequestDTO) {
    return apiRequest<TournamentDetailDTO>('/admin/tournaments', {
      method: 'POST',
      body: payload
    });
  },

  updateTournament(id: string, payload: AdminTournamentUpdateRequestDTO) {
    return apiRequest<TournamentDetailDTO>(`/admin/tournaments/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: payload
    });
  },

  deleteTournament(id: string) {
    return apiRequest<void>(`/admin/tournaments/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
};
