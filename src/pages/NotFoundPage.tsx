import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export const NotFoundPage = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? error.data : 'Страница не найдена или моковый ресурс отсутствует.';

  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>Ничего не найдено</h1>
      <p>{message}</p>
      <Link className="button primary" to="/">
        На главную
      </Link>
    </main>
  );
};
