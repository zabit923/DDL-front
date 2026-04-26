import type { ApplicationStatus, SlotState, TournamentStatus } from '../api/contracts';

export const formatDateTime = (value: string, language: 'ru' | 'en' = 'en') =>
  new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));

export const statusLabels: Record<TournamentStatus, string> = {
  upcoming: 'Upcoming',
  live: 'Live now',
  finished: 'Finished'
};

export const slotStateLabels: Record<SlotState, string> = {
  empty: 'Open',
  pending_members: 'Awaiting players',
  pending_admin: 'Awaiting review',
  approved: 'Approved',
  live: 'Live',
  finished: 'Finished'
};

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  pending_members: 'Awaiting member confirmation',
  pending_admin: 'Awaiting review',
  approved: 'Approved',
  rejected: 'Rejected'
};

export const fillCounter = (registered: number, max: number) => `${registered}/${max}`;

const cyrillicSlugMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya'
};

export const slugify = (value: string) =>
  [...value
    .trim()
    .toLowerCase()]
    .map((char) => cyrillicSlugMap[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/(^-|-$)+/g, '');
