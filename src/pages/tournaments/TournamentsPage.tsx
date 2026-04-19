import { useMemo } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import type { Tournament } from '../../entities/season/model';
import { TournamentCard } from '../../widgets/tournament-overview/TournamentCard';
import { EmptyState } from '../../shared/ui/StateBlocks';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';
import { formatKeyMap, statusKeyMap } from '../../shared/lib/labels';

export function TournamentsPage() {
  const { t } = useAppSettings();
  const tournaments = useLoaderData() as Tournament[];
  const [search, setSearch] = useSearchParams();

  const status = search.get('status') ?? 'all';
  const format = search.get('format') ?? 'all';
  const region = search.get('region') ?? 'all';

  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      if (status !== 'all' && t.status !== status) return false;
      if (format !== 'all' && t.format !== format) return false;
      if (region !== 'all' && t.region !== region) return false;
      return true;
    });
  }, [tournaments, status, format, region]);

  return (
    <section className="stack">
      <h1>{t('tournaments_title')}</h1>
      <div className="panel row wrap">
        <Filter
          label={t('filter_status')}
          value={status}
          options={['all', 'registration_open', 'check_in_open', 'live', 'completed']}
          optionLabel={(o) => (o === 'all' ? t('filter_all') : t(statusKeyMap[o as keyof typeof statusKeyMap]))}
          onChange={(v) => apply(search, setSearch, 'status', v)}
        />
        <Filter
          label={t('filter_format')}
          value={format}
          options={['all', 'single_elimination', 'double_elimination', 'swiss']}
          optionLabel={(o) => (o === 'all' ? t('filter_all') : t(formatKeyMap[o as keyof typeof formatKeyMap]))}
          onChange={(v) => apply(search, setSearch, 'format', v)}
        />
        <Filter
          label={t('filter_region')}
          value={region}
          options={['all', 'CIS', 'EU']}
          optionLabel={(o) => (o === 'all' ? t('filter_all') : o)}
          onChange={(v) => apply(search, setSearch, 'region', v)}
        />
      </div>
      {!filtered.length ? (
        <EmptyState title={t('tournaments_empty_title')} text={t('tournaments_empty_text')} />
      ) : (
        <div className="grid two">
          {filtered.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </section>
  );
}

function Filter({
  label,
  value,
  options,
  optionLabel,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  optionLabel: (option: string) => string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{optionLabel(o)}</option>
        ))}
      </select>
    </label>
  );
}

function apply(current: URLSearchParams, setSearch: (params: URLSearchParams) => void, key: string, value: string) {
  const next = new URLSearchParams(current);
  next.set(key, value);
  setSearch(next);
}
