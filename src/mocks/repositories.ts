import type {
  ApplicationDTO,
  CreateApplicationDTO,
  NewsDTO,
  NotificationDTO,
  TournamentDetailDTO,
  TournamentStatus,
  UserDTO
} from '../shared/api/contracts';
import { applications, currentUser, news, notifications, tournaments, users } from './data';

const wait = (ms = 180) => new Promise((resolve) => window.setTimeout(resolve, ms));

const clone = <T>(value: T): T => structuredClone(value);

const recalculateTeams = (tournament: TournamentDetailDTO) => {
  tournament.registeredTeamsCount = tournament.bracket.filter((slot) => slot.state !== 'empty').length;
};

export const authRepository = {
  async login(email: string, password: string): Promise<UserDTO> {
    await wait();
    if (!email.includes('@') || password.length < 4) {
      throw new Error('Введите email и пароль не короче 4 символов.');
    }

    return clone(currentUser);
  },

  async register(username: string, email: string, password: string): Promise<UserDTO> {
    await wait();
    if (!username.trim() || !email.includes('@') || password.length < 4) {
      throw new Error('Проверьте username, email и пароль.');
    }

    currentUser.username = username.trim();
    currentUser.email = email.trim();
    return clone(currentUser);
  }
};

export const newsRepository = {
  async list(): Promise<NewsDTO[]> {
    await wait(80);
    return clone(news).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  },

  async get(slug: string): Promise<NewsDTO> {
    await wait(80);
    const item = news.find((entry) => entry.slug === slug);
    if (!item) {
      throw new Response('Новость не найдена', { status: 404 });
    }

    return clone(item);
  }
};

export const usersRepository = {
  async search(query: string): Promise<UserDTO[]> {
    await wait(120);
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return clone(
      users
        .filter((user) => user.id !== currentUser.id)
        .filter((user) => user.username.toLowerCase().includes(normalized))
        .slice(0, 6)
    );
  }
};

export const tournamentsRepository = {
  async list(status?: TournamentStatus | 'all'): Promise<TournamentDetailDTO[]> {
    await wait(100);
    const filtered = !status || status === 'all' ? tournaments : tournaments.filter((item) => item.status === status);
    return clone(filtered).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  },

  async get(slug: string): Promise<TournamentDetailDTO> {
    await wait(100);
    const tournament = tournaments.find((item) => item.slug === slug);
    if (!tournament) {
      throw new Response('Турнир не найден', { status: 404 });
    }

    return clone(tournament);
  },

  async getHome() {
    await wait(100);
    const upcoming = tournaments
      .filter((item) => item.status === 'upcoming')
      .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0];
    const live = tournaments.find((item) => item.status === 'live');

    return {
      featuredTournament: clone(live ?? upcoming ?? tournaments[0]),
      latestNews: clone(news.slice(0, 3)),
      counters: {
        tournaments: tournaments.length,
        users: users.length,
        applications: applications.length
      }
    };
  }
};

export const applicationsRepository = {
  async submit(tournamentSlug: string, payload: CreateApplicationDTO): Promise<ApplicationDTO> {
    await wait(350);
    const tournament = tournaments.find((item) => item.slug === tournamentSlug);
    if (!tournament) {
      throw new Error('Турнир не найден.');
    }

    const slot = tournament.bracket.find((entry) => entry.slotNo === payload.slotNo);
    if (!slot || slot.state !== 'empty') {
      throw new Error('Этот слот уже занят.');
    }

    if (payload.members.length !== 6) {
      throw new Error('Команда должна состоять из 6 игроков.');
    }

    const application: ApplicationDTO = {
      id: `app-${Date.now()}`,
      tournamentSlug,
      slotNo: payload.slotNo,
      teamName: payload.teamName.trim(),
      captainId: currentUser.id,
      members: payload.members,
      status: 'pending_members',
      createdAt: new Date().toISOString()
    };

    applications.push(application);
    slot.state = 'pending_members';
    slot.teamName = application.teamName;
    slot.applicationId = application.id;
    slot.members = application.members;
    tournament.myApplication = application;
    recalculateTeams(tournament);

    notifications.unshift({
      id: `nt-${Date.now()}`,
      title: 'Заявка отправлена',
      body: `${application.teamName} уже отображается в сетке. Участникам отправлены инвайты.`,
      href: `/tournaments/${tournamentSlug}`,
      createdAt: new Date().toISOString(),
      read: false
    });

    return clone(application);
  }
};

export const notificationsRepository = {
  async list(): Promise<NotificationDTO[]> {
    await wait(80);
    return clone(notifications).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  },

  unreadCount(): number {
    return notifications.filter((item) => !item.read).length;
  },

  async markRead(id: string): Promise<void> {
    await wait(80);
    const item = notifications.find((entry) => entry.id === id);
    if (item) {
      item.read = true;
    }
  }
};
