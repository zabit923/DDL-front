import { useLoaderData } from 'react-router-dom';
import { HeroBlock } from '../../widgets/hero/HeroBlock';
import { MatchCard } from '../../widgets/tournament-overview/MatchCard';
import { StreamPanel } from '../../widgets/stream-panel/StreamPanel';
import { SponsorRail } from '../../widgets/sponsor-rail/SponsorRail';
import type { leagueRepository } from '../../mocks/repositories/leagueRepository';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

type HomeData = Awaited<ReturnType<typeof leagueRepository.getHome>> & {
  sponsors: Awaited<ReturnType<typeof leagueRepository.getSponsors>>;
};

export function HomePage() {
  const { t } = useAppSettings();
  const data = useLoaderData() as HomeData;
  return (
    <div className="stack-lg">
      <HeroBlock season={data.season} tournament={data.upcoming} />
      <section className="grid two">
        <div className="stack">
          <h2>{t('home_live_matches')}</h2>
          {data.liveMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
        <div className="stack">
          <StreamPanel streams={data.streams} />
          <SponsorRail sponsors={data.sponsors} />
        </div>
      </section>
    </div>
  );
}
