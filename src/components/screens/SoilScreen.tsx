'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { SoilReport, SoilParameter } from '@/lib/types';

const mockSoilReport: SoilReport = {
  id: 'SHC-2026-001', date: '2026-06-15', ph: 6.8, nitrogen: 280, phosphorus: 18, potassium: 210,
  organicCarbon: 0.52, electricalConductivity: 0.38, sulphur: 12, zinc: 0.55, boron: 0.42,
  iron: 5.2, manganese: 3.8, copper: 1.2, texture: 'loamy',
};

function analyzeSoil(report: SoilReport): SoilParameter[] {
  return [
    {
      name: 'pH', value: report.ph, unit: '', 
      status: report.ph < 6 ? 'low' : report.ph > 7.5 ? 'high' : 'normal',
      advice: report.ph < 6 ? 'Apply lime (2-4 quintal/acre) to increase pH.' : report.ph > 7.5 ? 'Apply gypsum or sulphur to reduce pH.' : 'pH is in ideal range for most crops.'
    },
    {
      name: 'Nitrogen (N)', value: report.nitrogen, unit: 'kg/ha',
      status: report.nitrogen < 250 ? 'low' : report.nitrogen > 500 ? 'high' : 'normal',
      advice: report.nitrogen < 250 ? 'Apply urea or organic manure. Green manuring recommended.' : report.nitrogen > 500 ? 'Reduce nitrogen fertilizer. Risk of excess vegetative growth.' : 'Nitrogen level is adequate.'
    },
    {
      name: 'Phosphorus (P)', value: report.phosphorus, unit: 'kg/ha',
      status: report.phosphorus < 15 ? 'low' : report.phosphorus > 40 ? 'high' : 'normal',
      advice: report.phosphorus < 15 ? 'Apply DAP or SSP. Increase organic matter.' : report.phosphorus > 40 ? 'Skip phosphorus fertilizer this season.' : 'Phosphorus is adequate.'
    },
    {
      name: 'Potassium (K)', value: report.potassium, unit: 'kg/ha',
      status: report.potassium < 150 ? 'low' : report.potassium > 350 ? 'high' : 'normal',
      advice: report.potassium < 150 ? 'Apply MOP (Muriate of Potash). Essential for fruiting crops.' : report.potassium > 350 ? 'Potassium is sufficient. No additional needed.' : 'Potassium is adequate.'
    },
    {
      name: 'Organic Carbon', value: report.organicCarbon, unit: '%',
      status: report.organicCarbon < 0.4 ? 'low' : report.organicCarbon > 0.75 ? 'high' : 'normal',
      advice: report.organicCarbon < 0.4 ? 'Add compost, vermicompost, or FYM. Practice crop residue recycling.' : 'Organic carbon is reasonable. Continue organic practices.'
    },
    {
      name: 'EC', value: report.electricalConductivity, unit: 'dS/m',
      status: report.electricalConductivity > 1 ? 'high' : 'normal',
      advice: report.electricalConductivity > 1 ? 'Soil may be saline. Leach with good quality water. Grow salt-tolerant crops.' : 'EC is normal. No salinity concern.'
    },
  ];
}

export default function SoilScreen() {
  const { t } = useI18n();
  const [showReport, setShowReport] = useState(false);
  const report = mockSoilReport;
  const params = analyzeSoil(report);

  const statusColor = (s: string) =>
    s === 'low' ? 'text-red-600 bg-red-50 border-red-200' :
    s === 'high' ? 'text-amber-600 bg-amber-50 border-amber-200' :
    'text-green-600 bg-green-50 border-green-200';

  const statusLabel = (s: string) => s === 'low' ? t.soilLow : s === 'high' ? t.soilHigh : t.soilNormal;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-surface-800 flex items-center gap-2">
        <span>🧪</span> {t.soilTitle}
      </h2>

      {!showReport ? (
        <div className="space-y-4 animate-slide-up">
          <div className="card p-6 text-center">
            <span className="text-6xl mb-4 block">📄</span>
            <h3 className="text-lg font-bold text-surface-800 mb-2">{t.soilUpload}</h3>
            <p className="text-surface-500 text-sm mb-6">Upload your Soil Health Card photo or enter values manually</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="card p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all active:scale-95">
                <span className="text-3xl">📸</span>
                <span className="font-medium text-sm">Photo / OCR</span>
              </button>
              <button
                onClick={() => setShowReport(true)}
                className="card p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all active:scale-95"
              >
                <span className="text-3xl">📊</span>
                <span className="font-medium text-sm">View Demo</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-slide-up">
          {/* Report Header */}
          <div className="card p-4 bg-primary-50 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-800">Soil Health Card</h3>
                <p className="text-sm text-primary-600">Report #{report.id}</p>
                <p className="text-xs text-primary-500">Date: {report.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-700">Texture: <b>{report.texture}</b></p>
                <span className="badge badge-success mt-1">✅ Verified</span>
              </div>
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-3">
            {params.map((param, idx) => (
              <div key={idx} className={`card p-4 border ${statusColor(param.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-surface-800">{param.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{param.value}{param.unit ? ` ${param.unit}` : ''}</span>
                    <span className={`badge ${
                      param.status === 'low' ? 'badge-danger' : param.status === 'high' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {statusLabel(param.status)}
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-surface-200 rounded-full h-2.5 mb-2">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${
                      param.status === 'low' ? 'bg-red-400' : param.status === 'high' ? 'bg-amber-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${Math.min(100, (param.value / (param.name === 'pH' ? 14 : param.name === 'EC' ? 2 : param.name === 'Organic Carbon' ? 1.5 : 600)) * 100)}%` }}
                  />
                </div>
                <p className="text-sm text-surface-600">{param.advice}</p>
              </div>
            ))}
          </div>

          {/* Micro-nutrients */}
          <div className="card p-4">
            <h3 className="font-semibold text-surface-800 mb-3">🔬 Micro-nutrients</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Sulphur', report.sulphur, 'mg/kg', 10],
                ['Zinc', report.zinc, 'mg/kg', 0.6],
                ['Boron', report.boron, 'mg/kg', 0.5],
                ['Iron', report.iron, 'mg/kg', 4.5],
                ['Manganese', report.manganese, 'mg/kg', 2],
                ['Copper', report.copper, 'mg/kg', 0.2],
              ].map(([name, value, unit, threshold]) => (
                <div key={String(name)} className="bg-surface-50 rounded-lg p-3">
                  <p className="text-xs text-surface-500">{name as string}</p>
                  <p className="font-bold text-surface-800">{value as number} {unit as string}</p>
                  <span className={`text-xs ${(value as number) < (threshold as number) ? 'text-red-500' : 'text-green-500'}`}>
                    {(value as number) < (threshold as number) ? '⚠️ Low' : '✅ OK'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable Crops */}
          <div className="card p-4">
            <h3 className="font-semibold text-surface-800 mb-3">🌾 {t.soilSuitable}</h3>
            <div className="flex flex-wrap gap-2">
              {['Wheat', 'Rice', 'Mustard', 'Cotton', 'Tomato', 'Maize', 'Potato'].map(crop => (
                <span key={crop} className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="card p-4">
            <h3 className="font-semibold text-surface-800 mb-3">📈 {t.soilImprove}</h3>
            <div className="space-y-2">
              {[
                'Add 2-3 tonnes FYM or compost per acre to increase organic carbon',
                'Practice crop rotation with legumes to fix nitrogen naturally',
                'Use green manuring crops like dhaincha or sunhemp',
                'Avoid excessive chemical fertilizer — follow soil test recommendations',
                'Mulching helps conserve moisture and improve soil biology',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-surface-700">
                  <span className="text-primary-500">💡</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setShowReport(false)} className="w-full py-3 bg-surface-100 text-surface-700 rounded-xl font-medium">
            ← {t.actionBack}
          </button>
        </div>
      )}
    </div>
  );
}
