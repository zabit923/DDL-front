import { useEffect, useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import { notificationsRepository } from '../mocks/repositories';
import type { NotificationDTO } from '../shared/api/contracts';
import { formatDateTime } from '../shared/lib/format';

export const NotificationsPage = () => {
  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [isPending, startTransition] = useTransition();
  const { refreshUnread } = useSession();

  const load = () => {
    void notificationsRepository.list().then(setItems);
  };

  useEffect(() => {
    load();
  }, []);

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
      <section className="page-hero compact">
        <p className="eyebrow">Notifications</p>
        <h1>Onsite-уведомления</h1>
        <p>Список и unread-счетчик работают в моковом репозитории. Позже этот экран подключается к WebSocket.</p>
      </section>

      <section className="panel notification-list">
        {items.map((item) => (
          <article className={item.read ? 'read' : 'unread'} key={item.id}>
            <div>
              <span>{formatDateTime(item.createdAt)}</span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
            <div className="notification-actions">
              <Link className="button ghost" to={item.href}>
                Открыть
              </Link>
              {!item.read ? (
                <button className="button primary" disabled={isPending} type="button" onClick={() => markRead(item.id)}>
                  Прочитано
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
