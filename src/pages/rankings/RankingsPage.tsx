import { useLoaderData } from 'react-router-dom';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function RankingsPage() {
  const { t } = useAppSettings();
  const rankings = useLoaderData() as Array<{ team: string; points: number }>;
  if (!rankings.length) return <EmptyState title={t('rankings_empty_title')} text={t('rankings_empty_text')} />;

  return (
    <section className="panel">
      <h1>{t('rankings_title')}</h1>
      <table className="table">
        <thead>
          <tr>
            <th>{t('table_team')}</th>
            <th>{t('table_points')}</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((r) => (
            <tr key={r.team}>
              <td>{r.team}</td>
              <td>{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
