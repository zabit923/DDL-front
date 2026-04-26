import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export const NotFoundPage = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? error.data : 'Page not found or the resource is unavailable.';

  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>Nothing found</h1>
      <p>{message}</p>
      <Link className="button primary" to="/">
        Back home
      </Link>
    </main>
  );
};
