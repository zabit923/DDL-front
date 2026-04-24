import { Link, useLoaderData } from 'react-router-dom';
import type { NewsDTO } from '../shared/api/contracts';
import { formatDateTime } from '../shared/lib/format';

export const NewsPage = () => {
  const items = useLoaderData() as NewsDTO[];

  return (
    <div className="stack-xl">
      <section className="page-hero compact">
        <p className="eyebrow">News</p>
        <h1>Новости лиги</h1>
        <p>Публичный контент доступен гостям и остается готовым к будущему переходу на real API.</p>
      </section>

      <div className="news-grid">
        {items.map((item) => (
          <Link className="news-card large" key={item.id} to={`/news/${item.slug}`}>
            <img src={item.imageUrl} alt="" />
            <span>{formatDateTime(item.publishedAt)}</span>
            <h2>{item.title}</h2>
            <p>{item.teaser}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const NewsDetailPage = () => {
  const item = useLoaderData() as NewsDTO;

  return (
    <article className="article-page">
      <img src={item.imageUrl} alt="" />
      <div className="article-card">
        <Link className="text-link" to="/news">
          Назад к новостям
        </Link>
        <span className="eyebrow">{formatDateTime(item.publishedAt)}</span>
        <h1>{item.title}</h1>
        <p className="lead">{item.teaser}</p>
        <p>{item.body}</p>
      </div>
    </article>
  );
};
