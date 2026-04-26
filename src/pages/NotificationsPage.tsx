import { useEffect, useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import { notificationsRepository } from '../shared/api/repositories';
import type { NotificationDTO } from '../shared/api/contracts';
import { localizeNotification } from '../shared/lib/contentLocalization';
import { formatDateTime } from '../shared/lib/format';

export const NotificationsPage = () => {
  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [isPending, startTransition] = useTransition();
  const { role, user, refreshUnread, t, language } = useSession();
  const needsTelegramConfirmation = role !== 'guest' && user?.telegramConfirmed === false;

  const load = () => {
    void notificationsRepository.list().then(setItems);
  };

  useEffect(() => {
    if (role === 'guest' || needsTelegramConfirmation) {
      return;
    }

    load();
  }, [role, needsTelegramConfirmation]);

  if (role === 'guest') {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">{t('authRequired')}</p>
        <h1>{t('applyAfterLogin')}</h1>
        <p>{t('applyAfterLoginText')}</p>
        <Link className="button primary" to="/auth/login?returnTo=/notifications">
          {t('login')}
        </Link>
      </section>
    );
  }

  if (needsTelegramConfirmation) {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">{t('telegramConfirmationEyebrow')}</p>
        <h1>{t('telegramConfirmationTitle')}</h1>
        <p>{t('telegramRequiredForActionsText')}</p>
        <Link className="button primary" to="/profile">
          {t('confirmTelegramToApply')}
        </Link>
      </section>
    );
  }

  const markRead = (id: string) => {
    startTransition(() => {
      void notificationsRepository.markRead(id).then(() => {
        refreshUnread();
        load();
      });
    });
  };

  return (
    <div className="stack-xl">
      <section className="page-hero">
        <p className="eyebrow">{t('navNotifications')}</p>
        <h1>{t('notificationsPageTitle')}</h1>
        <p>{t('notificationsPageText')}</p>
      </section>

      <section className="panel notification-list">
        {items.map((rawItem) => {
          const item = localizeNotification(rawItem, language);
          return (
          <article className={item.read ? 'read' : 'unread'} key={item.id}>
            <div>
              <span>{formatDateTime(item.createdAt, language)}</span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
            <div className="notification-actions">
              <Link className="button ghost" to={item.href}>
                {t('open')}
              </Link>
              {!item.read ? (
                <button className="button primary" disabled={isPending} type="button" onClick={() => markRead(item.id)}>
                  {t('markAsRead')}
                </button>
              ) : null}
            </div>
          </article>
        );
        })}
      </section>
    </div>
  );
};
