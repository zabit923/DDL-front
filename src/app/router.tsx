import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { newsRepository, tournamentsRepository } from '../mocks/repositories';
import { HomePage } from '../pages/HomePage';
import { TournamentsPage } from '../pages/TournamentsPage';
import { TournamentDetailPage } from '../pages/TournamentDetailPage';
import { ApplicationPage } from '../pages/ApplicationPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { LoginPage, RegisterPage } from '../pages/AuthPages';
import { NewsDetailPage, NewsPage } from '../pages/NewsPages';
import { NotFoundPage } from '../pages/NotFoundPage';
import type { TournamentStatus } from '../shared/api/contracts';

const allowedStatuses = new Set(['all', 'upcoming', 'live', 'finished']);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: () => tournamentsRepository.getHome()
      },
      {
        path: 'news',
        element: <NewsPage />,
        loader: () => newsRepository.list()
      },
      {
        path: 'news/:slug',
        element: <NewsDetailPage />,
        loader: ({ params }) => newsRepository.get(params.slug ?? '')
      },
      {
        path: 'auth/login',
        element: <LoginPage />
      },
      {
        path: 'auth/register',
        element: <RegisterPage />
      },
      {
        path: 'tournaments',
        element: <TournamentsPage />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const rawStatus = url.searchParams.get('status') ?? 'all';
          const status = allowedStatuses.has(rawStatus) ? rawStatus : 'all';
          const [items, allItems] = await Promise.all([
            tournamentsRepository.list(status as TournamentStatus | 'all'),
            tournamentsRepository.list('all')
          ]);
          const latestLiveTournament =
            allItems
              .filter((tournament) => tournament.status === 'live')
              .sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt))[0] ?? null;

          return { items, latestLiveTournament };
        }
      },
      {
        path: 'tournaments/:slug',
        element: <TournamentDetailPage />,
        loader: ({ params }) => tournamentsRepository.get(params.slug ?? '')
      },
      {
        path: 'tournaments/:slug/apply/:slot',
        element: <ApplicationPage />,
        loader: async ({ params }) => {
          const tournament = await tournamentsRepository.get(params.slug ?? '');
          return { tournament, slotNo: Number(params.slot) };
        }
      },
      {
        path: 'notifications',
        element: <NotificationsPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
