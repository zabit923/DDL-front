import { useState } from 'react';
import type { BracketNode } from '../../entities/season/model';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function BracketView({ nodes }: { nodes: BracketNode[] }) {
  const { t } = useAppSettings();
  const [mode, setMode] = useState<'graph' | 'list'>('graph');
  return (
    <section className="panel">
      <div className="row split">
        <h3>{t('bracket_title')}</h3>
        <div className="row">
          <button className={`chip ${mode === 'graph' ? 'active' : ''}`} onClick={() => setMode('graph')}>{t('bracket_graph')}</button>
          <button className={`chip ${mode === 'list' ? 'active' : ''}`} onClick={() => setMode('list')}>{t('bracket_list')}</button>
        </div>
      </div>
      {mode === 'graph' ? (
        <div className="bracket-grid">
          {nodes.map((n) => (
            <article key={n.id} className="bracket-node">
              <small>{n.round}</small>
              <p>{n.teamA} <strong>{n.scoreA ?? '-'}</strong></p>
              <p>{n.teamB} <strong>{n.scoreB ?? '-'}</strong></p>
            </article>
          ))}
        </div>
      ) : (
        <ul className="list">
          {nodes.map((n) => (
            <li key={n.id}>{n.round}: {n.teamA} vs {n.teamB}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
