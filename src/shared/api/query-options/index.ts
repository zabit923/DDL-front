export const queryKeys = {
  seasons: ['seasons'] as const,
  season: (slug: string) => ['seasons', slug] as const,
  tournaments: ['tournaments'] as const,
  tournament: (slug: string) => ['tournaments', slug] as const,
  match: (id: string) => ['matches', id] as const,
  rankings: ['rankings'] as const
};
