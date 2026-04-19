import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function StandingsTable({
  rows
}: {
  rows: Array<{ team: string; wins: number; losses: number; points: number }>;
}) {
  const { t } = useAppSettings();
  return (
    <div className="panel">
      <h3>{t('standings_title')}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>{t('table_team')}</th>
            <th>{t('table_w')}</th>
            <th>{t('table_l')}</th>
            <th>{t('table_pts')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team}>
              <td>{row.team}</td>
              <td>{row.wins}</td>
              <td>{row.losses}</td>
              <td>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
