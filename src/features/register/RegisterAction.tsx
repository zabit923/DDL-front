import { useState } from 'react';
import { leagueRepository } from '../../mocks/repositories/leagueRepository';
import type { Role } from '../../entities/season/model';
import { useAppSettings } from '../../shared/providers/AppSettingsProvider';

export function RegisterAction({ role }: { role: Role }) {
  const { t } = useAppSettings();
  const [result, setResult] = useState<string>('');
  const [busy, setBusy] = useState(false);

  return (
    <div className="action-row">
      <button
        className="btn primary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const res = await leagueRepository.performAction('register', role);
          setResult(res.message);
          setBusy(false);
        }}
      >
        {busy ? t('action_registering') : t('action_register')}
      </button>
      {result && <span className="hint">{result}</span>}
    </div>
  );
}
