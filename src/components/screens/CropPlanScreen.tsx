'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { crops } from '@/lib/data/crops';
import type { CropInfo } from '@/lib/types';

export default function CropPlanScreen() {
  const { t, language } = useI18n();
  const [selectedSeason, setSelectedSeason] = useState<'kharif' | 'rabi' | 'zaid'>('kharif');
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);

  const seasonCrops = crops.filter(c => c.season.includes(selectedSeason));

  const getCropName = (crop: CropInfo) => {
    if (language === 'hi') return crop.nameHi;
    if (language === 'pa') return crop.namePa;
    if (language === 'te') return crop.nameTe;
    return crop.name;
  };

  const riskProfiles = selectedCrop ? [
    {
      level: t.cropPlanLowRisk,
      emoji: '🛡️',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 border-green-200',
      profit: [Math.round(selectedCrop.expectedYield[0] * (selectedCrop.msp || 2000) - selectedCrop.costPerAcre * 0.8), Math.round(selectedCrop.expectedYield[0] * (selectedCrop.msp || 2000) - selectedCrop.costPerAcre)],
      desc: 'Conservative approach. Use resistant varieties, proven methods.',
    },
    {
      level: t.cropPlanBalanced,
      emoji: '⚖️',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 border-blue-200',
      profit: [Math.round((selectedCrop.expectedYield[0] + selectedCrop.expectedYield[1]) / 2 * (selectedCrop.msp || 2500) - selectedCrop.costPerAcre), Math.round(selectedCrop.expectedYield[1] * (selectedCrop.msp || 2500) - selectedCrop.costPerAcre)],
      desc: 'Balanced risk-reward. Good varieties with moderate investment.',
    },
    {
      level: t.cropPlanHighReturn,
      emoji: '🚀',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 border-amber-200',
      profit: [Math.round(selectedCrop.expectedYield[1] * (selectedCrop.msp || 3000) * 0.9 - selectedCrop.costPerAcre * 1.3), Math.round(selectedCrop.expectedYield[1] * (selectedCrop.msp || 3500) - selectedCrop.costPerAcre * 1.3)],
      desc: 'Higher investment, premium varieties. More risk, more potential return.',
    },
  ] : [];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-surface-800 flex items-center gap-2">
        <span>🌱</span> {t.cropPlanTitle}
      </h2>

      {/* Season Tabs */}
      <div className="flex gap-2">
        {([['kharif', t.cropPlanKharif, '🌧️'], ['rabi', t.cropPlanRabi, '❄️'], ['zaid', t.cropPlanZaid, '☀️']] as const).map(([season, label, icon]) => (
          <button
            key={season}
            onClick={() => { setSelectedSeason(season); setSelectedCrop(null); }}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedSeason === season
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-surface-700 shadow-sm'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Crop Selection */}
      <div className="grid grid-cols-3 gap-3">
        {seasonCrops.map(crop => (
          <button
            key={crop.id}
            onClick={() => setSelectedCrop(crop)}
            className={`feature-card ${selectedCrop?.id === crop.id ? 'active' : ''}`}
          >
            <span className="text-3xl">{crop.image}</span>
            <span className="text-xs font-medium">{getCropName(crop)}</span>
          </button>
        ))}
      </div>

      {selectedCrop && (
        <div className="space-y-4 animate-slide-up">
          {/* Crop Summary */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{selectedCrop.image}</span>
              <div>
                <h3 className="text-lg font-bold text-surface-800">{getCropName(selectedCrop)}</h3>
                <p className="text-sm text-surface-500">{selectedCrop.name} • {selectedCrop.daysToHarvest[0]}–{selectedCrop.daysToHarvest[1]} days</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-surface-50 rounded-lg p-2">
                <p className="text-xs text-surface-500">💧 Water</p>
                <p className="font-bold text-sm">{selectedCrop.waterReq}</p>
              </div>
              <div className="bg-surface-50 rounded-lg p-2">
                <p className="text-xs text-surface-500">🌡️ Temp</p>
                <p className="font-bold text-sm">{selectedCrop.idealTemp[0]}–{selectedCrop.idealTemp[1]}°C</p>
              </div>
              <div className="bg-surface-50 rounded-lg p-2">
                <p className="text-xs text-surface-500">📊 Yield</p>
                <p className="font-bold text-sm">{selectedCrop.expectedYield[0]}–{selectedCrop.expectedYield[1]} q</p>
              </div>
            </div>
          </div>

          {/* 3 Risk Profiles */}
          <h3 className="font-semibold text-surface-800">{t.cropPlanRecommended}</h3>
          <div className="space-y-3">
            {riskProfiles.map((profile, idx) => (
              <div key={idx} className={`card p-4 border ${profile.bgColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{profile.emoji}</span>
                  <h4 className="font-bold text-surface-800">{profile.level}</h4>
                </div>
                <p className="text-sm text-surface-600 mb-3">{profile.desc}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-surface-500">{t.cropPlanExpectedProfit} {t.perAcre}</p>
                    <p className="text-xl font-bold text-primary-700">₹{profile.profit[0].toLocaleString()} – ₹{profile.profit[1].toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="card p-4">
            <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
              <span>💰</span> {t.cropPlanCostBreakdown} ({t.perAcre})
            </h3>
            <div className="space-y-2">
              {[
                ['🌾 Seed', Math.round(selectedCrop.costPerAcre * 0.15)],
                ['🧪 Fertilizer', Math.round(selectedCrop.costPerAcre * 0.25)],
                ['👷 Labour', Math.round(selectedCrop.costPerAcre * 0.30)],
                ['💧 Irrigation', Math.round(selectedCrop.costPerAcre * 0.15)],
                ['🚛 Transport', Math.round(selectedCrop.costPerAcre * 0.08)],
                ['📦 Other', Math.round(selectedCrop.costPerAcre * 0.07)],
              ].map(([label, cost]) => (
                <div key={String(label)} className="flex items-center justify-between py-1.5 border-b border-surface-100 last:border-0">
                  <span className="text-sm text-surface-700">{label}</span>
                  <span className="font-semibold text-surface-800">₹{Number(cost).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t-2 border-surface-200">
                <span className="font-bold text-surface-800">Total Cost</span>
                <span className="font-bold text-lg text-surface-900">₹{selectedCrop.costPerAcre.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Crop Calendar */}
          <div className="card p-4">
            <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
              <span>📅</span> {t.cropPlanCalendar}
            </h3>
            <div className="space-y-3">
              {selectedCrop.stages.map((stage, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-lg">
                      {stage.icon}
                    </div>
                    {idx < selectedCrop.stages.length - 1 && (
                      <div className="w-0.5 h-8 bg-primary-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-surface-800">{stage.name}</h4>
                      <span className="text-xs text-surface-500">Day {stage.dayRange[0]}–{stage.dayRange[1]}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {stage.activities.map((act, i) => (
                        <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">{act}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
