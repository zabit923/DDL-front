import { useState } from 'react';
import { leagueRepository } from '../../mocks/repositories/leagueRepository';
import type { Role } from '../../entities/season/model';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function ReportResultAction({ role }: { role: Role }) {
  const { t } = useAppSettings();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  return (
    <div className="action-row">
      <button
        className="btn"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const res = await leagueRepository.performAction('report-result', role);
          setResult(res.message);
          setBusy(false);
        }}
      >
        {busy ? t('action_reporting') : t('action_report')}
      </button>
      {result && <span className="hint">{result}</span>}
    </div>
  );
}
