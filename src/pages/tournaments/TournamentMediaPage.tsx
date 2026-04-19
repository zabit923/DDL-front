import { useLoaderData } from 'react-router-dom';
import type { StreamItem } from '../../entities/season/model';
import { StreamPanel } from '../../widgets/stream-panel/StreamPanel';

export function TournamentMediaPage() {
  const streams = useLoaderData() as StreamItem[];
  return <StreamPanel streams={streams} />;
}
