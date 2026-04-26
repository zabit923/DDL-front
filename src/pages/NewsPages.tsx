import { Link, useLoaderData } from 'react-router-dom';
import { useSession } from '../app/SessionContext';
import type { NewsDTO } from '../shared/api/contracts';
import { localizeNews } from '../shared/lib/contentLocalization';
import { formatDateTime } from '../shared/lib/format';

export const NewsPage = () => {
  const { t, language } = useSession();
  const items = (useLoaderData() as NewsDTO[]).map((item) => localizeNews(item, language));

  return (
    <div className="stack-xl">
      <section className="page-hero">
        <p className="eyebrow">{t('navNews')}</p>
        <h1>{t('newsPageTitle')}</h1>
        <p>{t('newsPageText')}</p>
      </section>

      <div className="news-grid">
        {items.map((item) => (
          <Link className="news-card large" key={item.id} to={`/news/${item.slug}`}>
            <img src={item.imageUrl} alt="" />
            <span>{formatDateTime(item.publishedAt, language)}</span>
            <h2>{item.title}</h2>
            <p>{item.teaser}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const NewsDetailPage = () => {
  const { t, language } = useSession();
  const item = localizeNews(useLoaderData() as NewsDTO, language);

  return (
    <article className="article-page">
      <img src={item.imageUrl} alt="" />
      <div className="article-card">
        <Link className="text-link" to="/news">
          {t('backToNews')}
        </Link>
        <span className="eyebrow">{formatDateTime(item.publishedAt, language)}</span>
        <h1>{item.title}</h1>
        <p className="lead">{item.teaser}</p>
        <p>{item.body}</p>
      </div>
    </article>
  );
};
