import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';
import { SettingsControls } from '../../shared/ui/SettingsControls';

const tabs = ['overview', 'bracket', 'schedule', 'standings', 'participants', 'rules', 'media'];

export function CompetitionShell() {
  const { slug } = useParams();
  const { t } = useAppSettings();

  const tabKey = (tab: string) => {
    if (tab === 'overview') return 'nav_tournaments';
    if (tab === 'bracket') return 'bracket_title';
    if (tab === 'schedule') return 'schedule_title';
    if (tab === 'standings') return 'standings_title';
    if (tab === 'participants') return 'participants_title';
    if (tab === 'rules') return 'nav_rules';
    return 'nav_streams';
  };

  return (
    <div className="shell competition-shell">
      <header className="topbar">
        <div className="topbar-left">
          <NavLink to="/" className="brand">DeadLock League</NavLink>
          <nav>
            {tabs.map((tab) => (
              <NavLink
                key={tab}
                to={tab === 'overview' ? `/tournaments/${slug}` : `/tournaments/${slug}/${tab}`}
                end={tab === 'overview'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {t(tabKey(tab))}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="topbar-right">
          <SettingsControls />
        </div>
      </header>
      <main className="narrow-content">
        <Outlet />
      </main>
    </div>
  );
}
