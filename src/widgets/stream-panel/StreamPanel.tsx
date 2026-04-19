import type { StreamItem } from '../../entities/season/model';
import { Badge } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function StreamPanel({ streams }: { streams: StreamItem[] }) {
  const { t } = useAppSettings();
  return (
    <section className="panel">
      <h3>{t('streams_title')}</h3>
      <div className="stack">
        {streams.map((stream) => (
          <div key={stream.id} className="row split">
            <span className="stream-title">{stream.title}</span>
            <span>
              <Badge tone={stream.isLive ? 'live' : 'neutral'}>{stream.isLive ? t('live') : t('offline')}</Badge>
              {stream.isLive ? ` ${stream.viewers}` : ''}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
