import type { Sponsor } from '../../entities/season/model';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function SponsorRail({ sponsors }: { sponsors: Sponsor[] }) {
  const { t } = useAppSettings();
  return (
    <section className="panel">
      <h3>{t('sponsors_title')}</h3>
      <div className="sponsor-rail">
        {sponsors.map((s) => (
          <span key={s.id} className="sponsor-chip">{s.name}</span>
        ))}
      </div>
    </section>
  );
}
