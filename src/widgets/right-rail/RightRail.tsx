import { Link, useLocation } from 'react-router-dom';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function RightRail() {
  const { t } = useAppSettings();
  const location = useLocation();
  const search = location.search || '';

  return (
    <aside className="panel right-rail">
      <section className="stack">
        <h4>{t('rail_title')}</h4>
        <div className="stack">
          <Link className="chip" to={`/rankings${search}`}>{t('rankings_title')}</Link>
          <Link className="chip" to={`/streams${search}`}>{t('streams_title')}</Link>
          <Link className="chip" to={`/news${search}`}>{t('news_title')}</Link>
          <Link className="chip" to={`/login${search}`}>{t('nav_login')}</Link>
          <Link className="chip" to={`/register${search}`}>{t('nav_register')}</Link>
        </div>
      </section>

      <section className="stack">
        <h4>{t('demo_role')}</h4>
        <ul className="list compact-list">
          <li><strong>{t('role_guest')}:</strong> {t('rail_role_guest')}</li>
          <li><strong>{t('role_player')}:</strong> {t('rail_role_player')}</li>
          <li><strong>{t('role_admin')}:</strong> {t('rail_role_admin')}</li>
        </ul>
      </section>

      <section className="stack">
        <h4>{t('filter_status')}</h4>
        <div className="row wrap">
          <span className="badge">{t('status_registration_open')}</span>
          <span className="badge">{t('status_check_in_open')}</span>
          <span className="badge live">{t('status_live')}</span>
          <span className="badge">{t('status_completed')}</span>
        </div>
      </section>
    </aside>
  );
}
