import type { NewsDTO, NotificationDTO, TournamentDetailDTO } from '../api/contracts';

type Language = 'ru' | 'en';

export const localizeNews = (item: NewsDTO, language: Language): NewsDTO => {
  const localized = item.localized?.[language];
  return localized ? { ...item, ...localized } : item;
};

export const localizeNotification = (item: NotificationDTO, language: Language): NotificationDTO => {
  const localized = item.localized?.[language];
  return localized ? { ...item, ...localized } : item;
};

export const localizeTournament = (item: TournamentDetailDTO, language: Language): TournamentDetailDTO => {
  const localized = item.localized?.[language];
  if (!localized) {
    return item;
  }

  return {
    ...item,
    title: localized.title ?? item.title,
    description: localized.description ?? item.description,
    prizePool: localized.prizePool ?? item.prizePool,
    links: item.links.map((link) => ({
      ...link,
      label: localized.links?.[link.url] ?? link.label
    })),
    rules: localized.rules ?? item.rules,
    currentMatch: item.currentMatch
      ? {
          ...item.currentMatch,
          title: localized.matches?.[item.currentMatch.id] ?? item.currentMatch.title
        }
      : item.currentMatch,
    liveMatches: item.liveMatches.map((match) => ({
      ...match,
      title: localized.matches?.[match.id] ?? match.title
    })),
    completedMatches: item.completedMatches.map((match) => ({
      ...match,
      title: localized.matches?.[match.id] ?? match.title
    }))
  };
};
