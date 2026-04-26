import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router-dom';
import { useSession } from './SessionContext';
import { TelegramConfirmationBanner } from '../pages/AuthPages';
import { resolveAvatarUrl } from '../shared/lib/avatar';

const navItems = [
  { to: '/', labelKey: 'navHome', end: true },
  { to: '/tournaments', labelKey: 'navTournaments' },
  { to: '/news', labelKey: 'navNews' },
  { to: '/notifications', labelKey: 'navNotifications' }
] as const;

export const AppShell = () => {
  const { role, user, setAuthenticatedUser, unreadCount, theme, setTheme, language, setLanguage, t } = useSession();
  const isGuest = role === 'guest';
  const needsTelegramConfirmation = !isGuest && user?.telegramConfirmed === false;
  const baseNavItems = isGuest || needsTelegramConfirmation
    ? navItems.filter((item) => item.to !== '/notifications')
    : navItems;
  const visibleNavItems = !needsTelegramConfirmation && user?.admin
    ? [...baseNavItems, { to: '/admin', labelKey: 'navAdmin', end: false } as const]
    : baseNavItems;

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
          {visibleNavItems.map((item) => (
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
            <Link className="profile-avatar-link" to="/profile" aria-label={t('profile')}>
              <img src={resolveAvatarUrl(user?.avatarUrl)} alt="" />
            </Link>
          )}
        </div>
      </header>

      {needsTelegramConfirmation ? (
        <TelegramConfirmationBanner telegram={user.telegram} onUserRefresh={setAuthenticatedUser} />
      ) : null}

      <main className="page-frame">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
};
