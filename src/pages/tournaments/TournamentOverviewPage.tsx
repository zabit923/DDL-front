import { useLoaderData } from 'react-router-dom';
import type { TournamentBundle } from '../../entities/season/model';
import { Badge, EmptyState } from '../../shared/ui/StateBlocks';
import { RegisterAction } from '../../features/register/RegisterAction';
import { CheckInAction } from '../../features/check-in/CheckInAction';
import { ReportResultAction } from '../../features/report-result/ReportResultAction';
import { DisputeAction } from '../../features/dispute/DisputeAction';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';
import { formatKeyMap, statusKeyMap } from '../../shared/lib/labels';
import type { Role } from '../../entities/season/model';

type LoaderData = { bundle?: TournamentBundle; role: Role };

export function TournamentOverviewPage() {
  const { t } = useAppSettings();
  const { bundle, role } = useLoaderData() as LoaderData;
  if (!bundle) return <EmptyState title={t('overview_not_found')} text={t('overview_check_slug')} />;

  const tournament = bundle.tournament;
  return (
    <section className="stack">
      <article className="panel hero-sm" style={{ backgroundImage: `url(${tournament.heroImage})` }}>
        <h1>{tournament.name}</h1>
        <p>{tournament.region} • {t(formatKeyMap[tournament.format])}</p>
        <Badge tone={tournament.status === 'live' ? 'live' : 'neutral'}>{t(statusKeyMap[tournament.status])}</Badge>
      </article>
      <div className="panel">
        <h3>{t('overview_ops')}</h3>
        <p>{t('overview_role')}: <strong>{role}</strong></p>
        <RegisterAction role={role} />
        <CheckInAction role={role} />
        <ReportResultAction role={role} />
        <DisputeAction role={role} />
      </div>
    </section>
  );
}
