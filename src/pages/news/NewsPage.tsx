import { useLoaderData } from 'react-router-dom';
import type { NewsItem } from '../../entities/season/model';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { formatDate } from '../../shared/lib/format';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function NewsPage() {
  const { t, locale } = useAppSettings();
  const items = useLoaderData() as NewsItem[];
  if (!items.length) return <EmptyState title={t('news_empty_title')} text={t('news_empty_text')} />;
  return (
    <section className="stack">
      <h1>{t('news_title')}</h1>
      {items.map((item) => (
        <article key={item.id} className="panel">
          <h3>{item.title}</h3>
          <p>{item.teaser}</p>
          <small>{formatDate(item.publishedAt, locale)}</small>
        </article>
      ))}
    </section>
  );
}
