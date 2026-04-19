import { createBrowserRouter } from 'react-router-dom';
import { PublicShell } from '../layouts/PublicShell';
import { CompetitionShell } from '../layouts/CompetitionShell';
import { leagueRepository } from '../../mocks/repositories/leagueRepository';
import { HomePage } from '../../pages/home/HomePage';
import { SeasonsPage } from '../../pages/seasons/SeasonsPage';
import { SeasonPage } from '../../pages/seasons/SeasonPage';
import { TournamentsPage } from '../../pages/tournaments/TournamentsPage';
import { TournamentOverviewPage } from '../../pages/tournaments/TournamentOverviewPage';
import { TournamentBracketPage } from '../../pages/tournaments/TournamentBracketPage';
import { TournamentSchedulePage } from '../../pages/tournaments/TournamentSchedulePage';
import { TournamentStandingsPage } from '../../pages/tournaments/TournamentStandingsPage';
import { TournamentParticipantsPage } from '../../pages/tournaments/TournamentParticipantsPage';
import { TournamentRulesPage } from '../../pages/tournaments/TournamentRulesPage';
import { TournamentMediaPage } from '../../pages/tournaments/TournamentMediaPage';
import { MatchPage } from '../../pages/matches/MatchPage';
import { TeamPage } from '../../pages/teams/TeamPage';
import { PlayerPage } from '../../pages/players/PlayerPage';
import { RankingsPage } from '../../pages/rankings/RankingsPage';
import { RulesPage } from '../../pages/rules/RulesPage';
import { FaqPage } from '../../pages/faq/FaqPage';
import { NewsPage } from '../../pages/news/NewsPage';
import { StreamsPage } from '../../pages/streams/StreamsPage';
import { SponsorsPage } from '../../pages/sponsors/SponsorsPage';
import { LoginPage } from '../../pages/auth/LoginPage';
import { RegisterPage } from '../../pages/auth/RegisterPage';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { ErrorState } from '../../shared/ui/StateBlocks';
import { getContextFromRequest } from '../../shared/lib/requestContext';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

const RootError = () => {
  const { t } = useAppSettings();
  return <ErrorState title={t('route_error_title')} text={t('route_error_text')} />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicShell />,
    errorElement: <RootError />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: async ({ request }) => {
          const { url } = getContextFromRequest(request);
          const [home, sponsors] = await Promise.all([leagueRepository.getHome(url), leagueRepository.getSponsors(url)]);
          return { ...home, sponsors };
        }
      },
      {
        path: 'seasons',
        element: <SeasonsPage />,
        loader: ({ request }) => leagueRepository.getSeasons(new URL(request.url))
      },
      {
        path: 'seasons/:slug',
        element: <SeasonPage />,
        loader: ({ params, request }) => leagueRepository.getSeason(params.slug ?? '', new URL(request.url))
      },
      {
        path: 'tournaments',
        element: <TournamentsPage />,
        loader: ({ request }) => leagueRepository.getTournaments(new URL(request.url))
      },
      {
        path: 'matches/:id',
        element: <MatchPage />,
        loader: ({ params, request }) => leagueRepository.getMatch(params.id ?? '', new URL(request.url))
      },
      {
        path: 'teams/:slug',
        element: <TeamPage />,
        loader: ({ params, request }) => leagueRepository.getTeam(params.slug ?? '', new URL(request.url))
      },
      {
        path: 'players/:slug',
        element: <PlayerPage />,
        loader: ({ params, request }) => leagueRepository.getPlayer(params.slug ?? '', new URL(request.url))
      },
      {
        path: 'rankings',
        element: <RankingsPage />,
        loader: ({ request }) => leagueRepository.getRankings(new URL(request.url))
      },
      {
        path: 'rules',
        element: <RulesPage />,
        loader: ({ request }) => leagueRepository.getMarkdownPage('rules', new URL(request.url))
      },
      {
        path: 'faq',
        element: <FaqPage />,
        loader: ({ request }) => leagueRepository.getMarkdownPage('faq', new URL(request.url))
      },
      {
        path: 'news',
        element: <NewsPage />,
        loader: ({ request }) => leagueRepository.getNews(new URL(request.url))
      },
      {
        path: 'streams',
        element: <StreamsPage />,
        loader: ({ request }) => leagueRepository.getStreams(new URL(request.url))
      },
      {
        path: 'sponsors',
        element: <SponsorsPage />,
        loader: ({ request }) => leagueRepository.getSponsors(new URL(request.url))
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      }
    ]
  },
  {
    path: '/tournaments/:slug',
    element: <CompetitionShell />,
    errorElement: <RootError />,
    children: [
      {
        index: true,
        element: <TournamentOverviewPage />,
        loader: async ({ params, request }) => {
          const { role, url } = getContextFromRequest(request);
          const bundle = await leagueRepository.getTournamentBundle(params.slug ?? '', url);
          return { bundle, role };
        }
      },
      {
        path: 'bracket',
        element: <TournamentBracketPage />,
        loader: ({ params, request }) => leagueRepository.getTournamentBundle(params.slug ?? '', new URL(request.url))
      },
      {
        path: 'schedule',
        element: <TournamentSchedulePage />,
        loader: ({ params, request }) => leagueRepository.getTournamentBundle(params.slug ?? '', new URL(request.url))
      },
      {
        path: 'standings',
        element: <TournamentStandingsPage />,
        loader: ({ params, request }) => leagueRepository.getTournamentBundle(params.slug ?? '', new URL(request.url))
      },
      {
        path: 'participants',
        element: <TournamentParticipantsPage />,
        loader: ({ params, request }) => leagueRepository.getTournamentBundle(params.slug ?? '', new URL(request.url))
      },
      {
        path: 'rules',
        element: <TournamentRulesPage />,
        loader: ({ params, request }) => leagueRepository.getTournamentBundle(params.slug ?? '', new URL(request.url))
      },
      {
        path: 'media',
        element: <TournamentMediaPage />,
        loader: ({ request }) => leagueRepository.getStreams(new URL(request.url))
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
