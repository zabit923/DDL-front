import { useLoaderData } from 'react-router-dom';
import type { Sponsor } from '../../entities/season/model';
import { SponsorRail } from '../../widgets/sponsor-rail/SponsorRail';

export function SponsorsPage() {
  const sponsors = useLoaderData() as Sponsor[];
  return <SponsorRail sponsors={sponsors} />;
}
