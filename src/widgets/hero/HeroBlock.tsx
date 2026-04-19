import { Link } from 'react-router-dom';
import type { Season, Tournament } from '../../entities/season/model';
import { Badge } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';
import { formatKeyMap } from '../../shared/lib/labels';

export function HeroBlock({ season, tournament }: { season?: Season; tournament?: Tournament }) {
  const { t } = useAppSettings();
  return (
    <section className="hero panel">
      <div>
        <Badge tone="live">DeadLock League</Badge>
        <h1>{t('hero_title')}</h1>
        <p>{season?.subtitle ?? t('hero_fallback_season')}</p>
        <div className="row">
          <Link className="btn primary" to="/tournaments">
            {t('hero_explore')}
          </Link>
          <Link className="btn" to="/streams">
            {t('hero_watch')}
          </Link>
        </div>
      </div>
      <div className="hero-meta">
        <h3>{tournament?.name ?? t('hero_no_upcoming')}</h3>
        <p>{tournament ? `${t(formatKeyMap[tournament.format])} • ${tournament.region}` : t('hero_follow_updates')}</p>
      </div>
    </section>
  );
}
