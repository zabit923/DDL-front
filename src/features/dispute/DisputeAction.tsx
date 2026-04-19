import { useState } from 'react';
import { leagueRepository } from '../../mocks/repositories/leagueRepository';
import type { Role } from '../../entities/season/model';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function DisputeAction({ role }: { role: Role }) {
  const { t } = useAppSettings();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  return (
    <div className="action-row">
      <button
        className="btn danger"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const res = await leagueRepository.performAction('dispute', role);
          setResult(res.message);
          setBusy(false);
        }}
      >
        {busy ? t('action_submitting') : t('action_dispute')}
      </button>
      {result && <span className="hint">{result}</span>}
    </div>
  );
}
