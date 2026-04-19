import { Link, NavLink, Outlet } from 'react-router-dom';
import { RightRail } from '../../widgets/right-rail/RightRail';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';
import { SettingsControls } from '../../shared/ui/SettingsControls';

const nav = [
  ['/', 'nav_home'],
  ['/seasons', 'nav_seasons'],
  ['/tournaments', 'nav_tournaments'],
  ['/news', 'nav_news'],
  ['/streams', 'nav_streams'],
  ['/sponsors', 'nav_sponsors'],
  ['/rules', 'nav_rules'],
  ['/faq', 'nav_faq'],
  ['/login', 'nav_login']
] as const;

export function PublicShell() {
  const { t } = useAppSettings();
  return (
    <div className="shell public-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link to="/" className="brand">DeadLock League</Link>
          <nav>
            {nav.map(([to, key]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link ${to === '/login' ? 'login-link' : ''} ${isActive ? 'active' : ''}`}
              >
                {t(key)}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="topbar-right">
          <SettingsControls />
        </div>
      </header>
      <main className="content-grid">
        <div>
          <Outlet />
        </div>
        <RightRail />
      </main>
    </div>
  );
}
