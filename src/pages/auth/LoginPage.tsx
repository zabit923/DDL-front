import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function LoginPage() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'player' | 'admin'>('player');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(search);
    next.set('role', role);
    navigate(`/?${next.toString()}`);
  };

  return (
    <section className="panel auth-card">
      <h1>{t('auth_login_title')}</h1>
      <p>{t('auth_hint')}</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="filter">
          {t('auth_email')}
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label className="filter">
          {t('auth_password')}
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        <label className="filter">
          {t('auth_role')}
          <select value={role} onChange={(e) => setRole(e.target.value as 'player' | 'admin')}>
            <option value="player">{t('role_player')}</option>
            <option value="admin">{t('role_admin')}</option>
          </select>
        </label>
        <button className="btn primary" type="submit">{t('auth_submit_login')}</button>
      </form>
      <Link className="link" to="/register">{t('auth_link_to_register')}</Link>
    </section>
  );
}
