import { Link, useLocation } from 'react-router-dom';
import type { Role } from '../../entities/season/model';
import type { ScenarioName } from '../../mocks/scenarios/types';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

const roles: Role[] = ['guest', 'player', 'admin'];
const scenarios: ScenarioName[] = [
  'sponsor_heavy_homepage',
  'preseason',
  'registration_open',
  'check_in_open',
  'live_round',
  'result_under_review',
  'dispute_open',
  'completed_event',
  'empty_league'
];

export function ScenarioRolePanel() {
  const { t } = useAppSettings();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const role = (search.get('role') as Role | null) ?? 'guest';
  const scenario = (search.get('scenario') as ScenarioName | null) ?? 'sponsor_heavy_homepage';

  const roleLabel = (role: Role) => {
    if (role === 'admin') return t('role_admin');
    if (role === 'player') return t('role_player');
    return t('role_guest');
  };

  return (
    <aside className="panel utility-panel">
      <h4>{t('demo_controls')}</h4>
      <div>
        <strong>{t('demo_role')}:</strong>{' '}
        {roles.map((r) => (
          <Link key={r} className={`chip ${r === role ? 'active' : ''}`} to={`${location.pathname}?${setParam(search, 'role', r)}`}>
            {roleLabel(r)}
          </Link>
        ))}
      </div>
      <div>
        <strong>{t('demo_scenario')}:</strong>{' '}
        {scenarios.map((s) => (
          <Link key={s} className={`chip ${s === scenario ? 'active' : ''}`} to={`${location.pathname}?${setParam(search, 'scenario', s)}`}>
            {s}
          </Link>
        ))}
      </div>
    </aside>
  );
}

function setParam(source: URLSearchParams, key: string, value: string) {
  const p = new URLSearchParams(source);
  p.set(key, value);
  return p.toString();
}
