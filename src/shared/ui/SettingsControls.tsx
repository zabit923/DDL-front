import { useAppSettings } from '../providers/AppSettingsProvider';

export function SettingsControls() {
  const { locale, setLocale, theme, setTheme, t } = useAppSettings();

  return (
    <div className="settings-controls">
      <label className="setting-group">
        <span className="sr-only">{t('settings_language')}</span>
        <select value={locale} onChange={(e) => setLocale(e.target.value as 'ru' | 'en')}>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
      </label>
      <button
        className={`theme-toggle ${theme}`}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        type="button"
        aria-label={`${t('settings_theme')}: ${theme === 'dark' ? t('theme_dark') : t('theme_light')}`}
        title={`${t('settings_theme')}: ${theme === 'dark' ? t('theme_dark') : t('theme_light')}`}
      >
        <span className="theme-toggle-track" aria-hidden="true">
          <span className="theme-icon sun">☼</span>
          <span className="theme-icon moon">◐</span>
        </span>
      </button>
    </div>
  );
}
