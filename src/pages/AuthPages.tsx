import { FormEvent, useEffect, useState, useTransition, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import { authRepository } from '../mocks/repositories';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_а-яА-ЯёЁ-]+$/;
const motivationKeys = ['authMotivation1', 'authMotivation2', 'authMotivation3'] as const;

const getReturnTo = (value: string | null) => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/tournaments';
  }

  return value;
};

const validateLogin = (email: string, password: string, t: ReturnType<typeof useSession>['t']) => {
  if (!emailPattern.test(email.trim())) {
    return t('invalidEmail');
  }

  if (password.length < 4) {
    return t('passwordTooShort4');
  }

  return '';
};

const validateRegister = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  t: ReturnType<typeof useSession>['t']
) => {
  const normalizedUsername = username.trim();

  if (normalizedUsername.length < 3 || normalizedUsername.length > 24) {
    return t('usernameLength');
  }

  if (!usernamePattern.test(normalizedUsername)) {
    return t('usernameChars');
  }

  if (!emailPattern.test(email.trim())) {
    return t('invalidEmail');
  }

  if (password.length < 6) {
    return t('passwordTooShort6');
  }

  if (password !== confirmPassword) {
    return t('passwordsMismatch');
  }

  return '';
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role, setRole, t } = useSession();
  const [email, setEmail] = useState(() => localStorage.getItem('ddl-auth-email') ?? 'aster@deadlock.local');
  const [password, setPassword] = useState('demo1');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const returnTo = getReturnTo(searchParams.get('returnTo'));
  const registerHref = `/auth/register?returnTo=${encodeURIComponent(returnTo)}`;
  const motivation = useAuthMotivation();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateLogin(email, password, t);
    setError(validationError);
    if (validationError) {
      return;
    }

    startTransition(() => {
      void authRepository
        .login(email.trim(), password)
        .then(() => {
          setRole('user');
          if (remember) {
            localStorage.setItem('ddl-auth-email', email.trim());
          }
          navigate(returnTo);
        })
        .catch((loginError: unknown) => setError(loginError instanceof Error ? loginError.message : t('loginError')));
    });
  };

  return (
    <AuthFrame
      active="login"
      role={role}
      title={t('loginTitle')}
      subtitle={motivation}
      returnTo={returnTo}
      switchHref={registerHref}
      switchLabel={t('createAccount')}
    >
      <form className="auth-form" noValidate onSubmit={submit}>
        <label className="field">
          <span>Email</span>
          <input
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="player@deadlock.local"
            type="email"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('minPassword4')}
            type="password"
          />
        </label>

        <label className="auth-check">
          <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" />
          <span>{t('rememberEmail')}</span>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button primary" disabled={isPending} type="submit">
          {isPending ? t('checking') : t('loginCta')}
        </button>

        <p className="auth-footnote">
          {t('demoAccount')} <strong>aster@deadlock.local</strong> / <strong>demo1</strong>
        </p>
      </form>
    </AuthFrame>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role, setRole, t } = useSession();
  const [username, setUsername] = useState('Aster');
  const [email, setEmail] = useState('aster@deadlock.local');
  const [password, setPassword] = useState('demo12');
  const [confirmPassword, setConfirmPassword] = useState('demo12');
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const returnTo = getReturnTo(searchParams.get('returnTo'));
  const loginHref = `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  const passwordProgress = Math.min(100, Math.round((password.length / 10) * 100));
  const motivation = useAuthMotivation();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateRegister(username, email, password, confirmPassword, t);
    setError(validationError);
    if (validationError) {
      return;
    }

    if (!acceptedRules) {
      setError(t('acceptRulesError'));
      return;
    }

    startTransition(() => {
      void authRepository
        .register(username.trim(), email.trim(), password)
        .then(() => {
          setRole('user');
          navigate(returnTo);
        })
        .catch((registerError: unknown) =>
          setError(registerError instanceof Error ? registerError.message : t('registerError'))
        );
    });
  };

  return (
    <AuthFrame
      active="register"
      role={role}
      title={t('registerTitle')}
      subtitle={motivation}
      returnTo={returnTo}
      switchHref={loginHref}
      switchLabel={t('alreadyHaveAccount')}
    >
      <form className="auth-form" noValidate onSubmit={submit}>
        <label className="field">
          <span>Username</span>
          <input
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Aster"
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="player@deadlock.local"
            type="email"
          />
        </label>

        <div className="form-grid">
          <label className="field">
            <span>Password</span>
            <input
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('minPassword6')}
              type="password"
            />
          </label>
          <label className="field">
            <span>Repeat password</span>
            <input
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={t('repeatPassword')}
              type="password"
            />
          </label>
        </div>

        <div className="password-meter" aria-label="Надежность пароля">
          <span style={{ width: `${passwordProgress}%` }} />
        </div>

        <label className="auth-check">
          <input
            checked={acceptedRules}
            onChange={(event) => setAcceptedRules(event.target.checked)}
            type="checkbox"
          />
          <span>{t('acceptMockRules')}</span>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button primary" disabled={isPending} type="submit">
          {isPending ? t('creating') : t('createAccount')}
        </button>
      </form>
    </AuthFrame>
  );
};

const AuthFrame = ({
  active,
  role,
  title,
  subtitle,
  returnTo,
  switchHref,
  switchLabel,
  children
}: {
  active: 'login' | 'register';
  role: string;
  title: string;
  subtitle?: string;
  returnTo: string;
  switchHref: string;
  switchLabel: string;
  children: ReactNode;
}) => {
  const { t } = useSession();

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">{t('authFlow')}</p>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}

        <div className="auth-tabs" aria-label="Auth routes">
          <Link
            className={active === 'login' ? 'auth-tab selected' : 'auth-tab'}
            to={`/auth/login?returnTo=${encodeURIComponent(returnTo)}`}
          >
            {t('login')}
          </Link>
          <Link
            className={active === 'register' ? 'auth-tab selected' : 'auth-tab'}
            to={`/auth/register?returnTo=${encodeURIComponent(returnTo)}`}
          >
            {t('register')}
          </Link>
        </div>

        <div className="auth-role-card">
          <span>{t('currentRole')}</span>
          <strong>{role}</strong>
          <p>{t('roleInfo')}</p>
        </div>
      </section>

      <section className="panel auth-panel">
        <div className="auth-panel__head">
          <div>
            <p className="eyebrow">{active === 'login' ? t('authorization') : t('register')}</p>
            <h2>{active === 'login' ? t('authorization') : t('newPlayer')}</h2>
          </div>
          <Link className="text-link" to={switchHref}>
            {switchLabel}
          </Link>
        </div>

        {children}
      </section>
    </div>
  );
};

const useAuthMotivation = () => {
  const { t } = useSession();
  const [index] = useState(() => {
    const stored = Number(localStorage.getItem('ddl-auth-motivation-index') ?? '0');
    return Number.isFinite(stored) ? stored % motivationKeys.length : 0;
  });

  useEffect(() => {
    localStorage.setItem('ddl-auth-motivation-index', String((index + 1) % motivationKeys.length));
  }, [index]);

  return t(motivationKeys[index]);
};
