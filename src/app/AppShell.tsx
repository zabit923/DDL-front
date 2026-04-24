import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router-dom';
import { useSession } from './SessionContext';

const navItems = [
  { to: '/', labelKey: 'navHome', end: true },
  { to: '/tournaments', labelKey: 'navTournaments' },
  { to: '/news', labelKey: 'navNews' },
  { to: '/notifications', labelKey: 'navNotifications' }
] as const;

export const AppShell = () => {
  const { role, setRole, unreadCount, theme, setTheme, language, setLanguage, t } = useSession();
  const isGuest = role === 'guest';

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">DDL</span>
          <span>
            <strong>DeadLock League</strong>
          </span>
        </Link>

        <nav className="topnav" aria-label="Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {t(item.labelKey)}
              {item.to === '/notifications' && unreadCount > 0 ? <span className="nav-badge">{unreadCount}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="settings-switches" aria-label="Display settings">
          <button
            className="theme-icon-button"
            type="button"
            aria-label={theme === 'dark' ? t('light') : t('dark')}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <div className="language-toggle" aria-label={t('language')}>
            {(['ru', 'en'] as const).map((item) => (
              <button
                key={item}
                className={language === item ? 'selected' : undefined}
                type="button"
                onClick={() => setLanguage(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="auth-actions">
          {isGuest ? (
            <Link className="button primary" to="/auth/login">
              {t('login')}
            </Link>
          ) : (
            <button className="button ghost" type="button" onClick={() => setRole('guest')}>
              {t('logout')}
            </button>
          )}
        </div>
      </header>

      <main className="page-frame">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
};
