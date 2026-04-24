import type { ApplicationStatus, SlotState, TournamentStatus } from '../api/contracts';

export const formatDateTime = (value: string, language: 'ru' | 'en' = 'ru') =>
  new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));

export const statusLabels: Record<TournamentStatus, string> = {
  upcoming: 'Предстоящий',
  live: 'Идет сейчас',
  finished: 'Завершен'
};

export const slotStateLabels: Record<SlotState, string> = {
  empty: 'Свободно',
  pending_members: 'Ждет игроков',
  pending_admin: 'Ждет решения',
  approved: 'Подтверждена',
  live: 'Live',
  finished: 'Завершено'
};

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  draft: 'Черновик',
  pending_members: 'Ожидает подтверждения участников',
  pending_admin: 'Ожидает решения',
  approved: 'Подтверждена',
  rejected: 'Отклонена'
};

export const fillCounter = (registered: number, max: number) => `${registered}/${max}`;

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/(^-|-$)+/g, '');
