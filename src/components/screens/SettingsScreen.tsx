'use client';

import { useI18n, languageMeta } from '@/lib/i18n';
import type { Language } from '@/lib/types';

export default function SettingsScreen() {
  const { t, language, setLanguage } = useI18n();

  const handleReset = () => {
    if (confirm('Reset onboarding? You will see the welcome screen again.')) {
      localStorage.removeItem('krishi-onboarded');
      localStorage.removeItem('krishi-lang');
      localStorage.removeItem('krishi-state');
      localStorage.removeItem('krishi-district');
      localStorage.removeItem('krishi-crops');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-surface-800 flex items-center gap-2">
        <span>⚙️</span> {t.settingsTitle}
      </h2>

      {/* Language Selection */}
      <div className="card p-4">
        <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
          <span>🗣️</span> {t.settingsLanguage}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(languageMeta) as [Language, typeof languageMeta.hi][]).map(([code, meta]) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`p-3 rounded-xl text-center transition-all border-2 ${
                language === code
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-surface-200 bg-white hover:border-primary-300'
              }`}
            >
              <div className="font-bold text-lg">{meta.nativeName}</div>
              <div className="text-xs text-surface-500">{meta.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="card p-4">
        <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
          <span>📍</span> {t.settingsLocation}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
            <span className="text-surface-600">State</span>
            <span className="font-medium text-surface-800">{localStorage.getItem('krishi-state') || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
            <span className="text-surface-600">District</span>
            <span className="font-medium text-surface-800">{localStorage.getItem('krishi-district') || 'Not set'}</span>
          </div>
        </div>
      </div>

      {/* My Crops */}
      <div className="card p-4">
        <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
          <span>🌾</span> {t.settingsCrops}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(() => {
            try {
              const crops = JSON.parse(localStorage.getItem('krishi-crops') || '[]');
              return crops.length > 0 ? crops.map((c: string) => (
                <span key={c} className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {c}
                </span>
              )) : <span className="text-surface-500">No crops selected</span>;
            } catch { return <span className="text-surface-500">No crops selected</span>; }
          })()}
        </div>
      </div>

      {/* App Info */}
      <div className="card p-4">
        <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
          <span>ℹ️</span> {t.settingsAbout}
        </h3>
        <div className="space-y-2 text-sm text-surface-600">
          <p><strong>कृषि मित्र (Krishi Mitra)</strong></p>
          <p>AI-powered farming assistant for Indian farmers</p>
          <p>Version 1.0.0 MVP</p>
          <p className="text-xs text-surface-400 mt-2">
            Data sources: IMD, AGMARKNET, e-NAM, ICAR, State Agri Universities, KVKs.
            AI suggestions are not a substitute for professional advice.
          </p>
        </div>
      </div>

      {/* Notifications Toggle */}
      <div className="card p-4">
        <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
          <span>🔔</span> {t.settingsNotifications}
        </h3>
        <div className="space-y-3">
          {['Weather Alerts', 'Market Price Updates', 'Crop Reminders', 'Scheme Notifications'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <span className="text-surface-700">{item}</span>
              <div className="w-12 h-7 bg-primary-500 rounded-full p-0.5 cursor-pointer">
                <div className="w-6 h-6 bg-white rounded-full shadow-sm transform translate-x-5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family Mode */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-surface-800 flex items-center gap-2">
              <span>👨‍👩‍👧‍👦</span> {t.settingsFamilyMode}
            </h3>
            <p className="text-xs text-surface-500 mt-1">Allow family members to help without taking over</p>
          </div>
          <div className="w-12 h-7 bg-surface-300 rounded-full p-0.5 cursor-pointer">
            <div className="w-6 h-6 bg-white rounded-full shadow-sm transition-transform" />
          </div>
        </div>
      </div>

      {/* Help & Reset */}
      <div className="space-y-3">
        <button className="w-full card p-4 text-left hover:shadow-lg transition-all flex items-center gap-3">
          <span className="text-xl">❓</span>
          <span className="font-medium text-surface-800">{t.settingsHelp}</span>
        </button>
        <button
          onClick={handleReset}
          className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200 hover:bg-red-100 transition-all"
        >
          🔄 Reset App / Restart Onboarding
        </button>
      </div>
    </div>
  );
}
