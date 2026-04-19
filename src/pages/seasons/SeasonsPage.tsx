import { Link, useLoaderData } from 'react-router-dom';
import type { Season } from '../../entities/season/model';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function SeasonsPage() {
  const { t } = useAppSettings();
  const seasons = useLoaderData() as Season[];
  if (!seasons.length) return <EmptyState title={t('seasons_empty_title')} text={t('seasons_empty_text')} />;

  return (
    <section className="stack">
      <h1>{t('seasons_title')}</h1>
      {seasons.map((season) => (
        <article key={season.id} className="panel card">
          <h3>{season.title}</h3>
          <p>{season.subtitle}</p>
          <Link className="btn" to={`/seasons/${season.slug}`}>{t('season_open')}</Link>
        </article>
      ))}
    </section>
  );
}
