export const formatDate = (iso: string, locale: 'ru' | 'en' = 'ru') =>
  new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(iso));
