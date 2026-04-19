import { useLoaderData } from 'react-router-dom';
import type { Season } from '../../entities/season/model';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function SeasonPage() {
  const { t } = useAppSettings();
  const season = useLoaderData() as Season | undefined;
  if (!season) return <EmptyState title={t('season_not_found')} text={t('season_check_link')} />;

  return (
    <section className="stack">
      <h1>{season.title}</h1>
      <p>{season.subtitle}</p>
      <div className="panel">
        <h3>{t('season_snapshot')}</h3>
        <table className="table">
          <thead>
            <tr>
              <th>{t('table_team')}</th>
              <th>{t('table_points')}</th>
              <th>{t('table_delta')}</th>
            </tr>
          </thead>
          <tbody>
            {season.pointsTable.map((row) => (
              <tr key={row.team}>
                <td>{row.team}</td>
                <td>{row.points}</td>
                <td>{row.delta > 0 ? `+${row.delta}` : row.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
