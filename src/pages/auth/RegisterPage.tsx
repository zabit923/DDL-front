import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function RegisterPage() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(search);
    next.set('role', 'player');
    navigate(`/?${next.toString()}`);
  };

  return (
    <section className="panel auth-card">
      <h1>{t('auth_register_title')}</h1>
      <p>{t('auth_hint')}</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="filter">
          {t('auth_name')}
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="filter">
          {t('auth_email')}
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label className="filter">
          {t('auth_password')}
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        <button className="btn primary" type="submit">{t('auth_submit_register')}</button>
      </form>
      <Link className="link" to="/login">{t('auth_link_to_login')}</Link>
    </section>
  );
}
