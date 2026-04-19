import { Link } from 'react-router-dom';
import { useAppSettings } from '../shared/providers/AppSettingsProvider';

export function NotFoundPage() {
  const { t } = useAppSettings();
  return (
    <section className="panel">
      <h1>404</h1>
      <p>{t('not_found_text')}</p>
      <Link className="btn" to="/">{t('back_home')}</Link>
    </section>
  );
}
