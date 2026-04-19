export const config = {
  dataSource: (import.meta.env.VITE_DATA_SOURCE ?? 'mock') as 'mock' | 'api',
  defaultScenario: import.meta.env.VITE_SCENARIO ?? 'sponsor_heavy_homepage'
};
