'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { schemes } from '@/lib/data/schemes';
import type { GovernmentScheme } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function SchemesScreen() {
  const { t, language } = useI18n();
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedDocs, setCompletedDocs] = useState<Set<number>>(new Set());

  const toggleDoc = (idx: number) => {
    setCompletedDocs(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const categoryColors: Record<string, string> = {
    income: 'from-green-400 to-emerald-500',
    insurance: 'from-blue-400 to-indigo-500',
    credit: 'from-amber-400 to-orange-500',
    equipment: 'from-slate-400 to-gray-500',
    irrigation: 'from-sky-400 to-cyan-500',
    market: 'from-orange-400 to-red-400',
    solar: 'from-yellow-400 to-amber-500',
    organic: 'from-lime-400 to-green-500',
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-surface-800 flex items-center gap-2">
        <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-lg">🏛️</span>
        {t.schemesTitle}
      </h2>

      <AnimatePresence mode="wait">
        {!selectedScheme ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-3"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-indigo-50 via-purple-50 to-violet-50 border border-indigo-200 rounded-2xl p-4 mb-2"
            >
              <p className="text-indigo-800 font-semibold flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ✨
                </motion.span>
                {t.schemesEligible}
              </p>
            </motion.div>

            {schemes.map((scheme, idx) => (
              <motion.button
                key={scheme.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedScheme(scheme)}
                className="w-full card-premium p-4 text-left hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: [0, 5, -5, 0] }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[scheme.category] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-2xl shadow-sm`}
                  >
                    {scheme.icon}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-surface-800 truncate">
                      {language === 'hi' ? scheme.nameHi : scheme.name}
                    </h3>
                    <p className="text-sm text-surface-500 line-clamp-2 mt-0.5">
                      {language === 'hi' ? scheme.descriptionHi : scheme.description}
                    </p>
                  </div>
                  <span className="text-surface-300 text-lg">→</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Scheme Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-5 bg-gradient-to-br ${categoryColors[selectedScheme.category] || 'from-gray-400 to-gray-500'} text-white shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.span
                  className="text-4xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {selectedScheme.icon}
                </motion.span>
                <div>
                  <h3 className="text-xl font-bold drop-shadow">
                    {language === 'hi' ? selectedScheme.nameHi : selectedScheme.name}
                  </h3>
                  <p className="text-sm text-white/80">{selectedScheme.ministry}</p>
                </div>
              </div>
              <p className="text-white/90 leading-relaxed text-sm">
                {language === 'hi' ? selectedScheme.descriptionHi : selectedScheme.description}
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-premium p-5"
            >
              <h4 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-green-100 flex items-center justify-center text-sm">🎁</span>
                {t.schemesBenefits}
              </h4>
              <div className="space-y-2">
                {selectedScheme.benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="flex items-start gap-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100"
                  >
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-sm text-surface-700">{b}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-premium p-5"
            >
              <h4 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-sm">📋</span>
                {t.schemesCheckEligibility}
              </h4>
              <div className="space-y-2">
                {selectedScheme.eligibility.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.06 }}
                    className="flex items-start gap-2 text-sm text-surface-700 bg-blue-50/50 rounded-lg p-2"
                  >
                    <span className="text-primary-500 mt-0.5 font-bold">•</span>
                    <span>{e}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Required Documents — Interactive Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium p-5"
            >
              <h4 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-amber-100 flex items-center justify-center text-sm">📄</span>
                {t.schemesDocuments}
                <span className="ml-auto text-xs text-surface-400 font-medium">
                  {completedDocs.size}/{selectedScheme.documents.length}
                </span>
              </h4>
              {/* Progress bar */}
              <div className="h-2 bg-surface-100 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                  animate={{ width: `${(completedDocs.size / selectedScheme.documents.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="space-y-2">
                {selectedScheme.documents.map((doc, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleDoc(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      completedDocs.has(i)
                        ? 'bg-gradient-to-r from-primary-50 to-emerald-50 border border-primary-200'
                        : 'bg-surface-50 border border-surface-100'
                    }`}
                  >
                    <motion.div
                      animate={completedDocs.has(i) ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        completedDocs.has(i)
                          ? 'bg-primary-500 text-white'
                          : 'bg-surface-200 text-surface-500'
                      }`}
                    >
                      {completedDocs.has(i) ? '✓' : ''}
                    </motion.div>
                    <span className={`text-sm font-medium ${completedDocs.has(i) ? 'text-primary-700 line-through' : 'text-surface-700'}`}>
                      {doc}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Application Steps — Animated Stepper */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-premium p-5"
            >
              <h4 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-violet-100 flex items-center justify-center text-sm">📝</span>
                {t.schemesSteps}
              </h4>
              <div className="space-y-0">
                {selectedScheme.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    {/* Stepper indicator */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0"
                      >
                        {i + 1}
                      </motion.div>
                      {i < selectedScheme.steps.length - 1 && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                          className="w-0.5 bg-gradient-to-b from-primary-400 to-primary-200 my-1 min-h-[20px]"
                        />
                      )}
                    </div>
                    {/* Step content */}
                    <motion.button
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                      className={`flex-1 text-left p-3 rounded-xl border transition-all mb-2 ${
                        expandedStep === i
                          ? 'bg-gradient-to-r from-primary-50 to-emerald-50 border-primary-200 shadow-sm'
                          : 'bg-surface-50 border-surface-100 hover:bg-surface-100'
                      }`}
                    >
                      <span className="text-sm text-surface-700 font-medium">{step}</span>
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Helpline & Website */}
            <div className="grid grid-cols-2 gap-3">
              <motion.a
                whileTap={{ scale: 0.95 }}
                href={selectedScheme.website}
                target="_blank"
                rel="noopener noreferrer"
                className="card-premium p-4 text-center hover:shadow-lg transition-all"
              >
                <motion.span
                  className="text-2xl block mb-1"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🌐
                </motion.span>
                <span className="text-sm font-semibold text-primary-600">Website</span>
              </motion.a>
              {selectedScheme.helpline && (
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href={`tel:${selectedScheme.helpline}`}
                  className="card-premium p-4 text-center hover:shadow-lg transition-all"
                >
                  <motion.span
                    className="text-2xl block mb-1"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    📞
                  </motion.span>
                  <span className="text-sm font-semibold text-primary-600">{selectedScheme.helpline}</span>
                </motion.a>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedScheme(null); setCompletedDocs(new Set()); setExpandedStep(null); }}
              className="w-full py-3.5 bg-surface-100 text-surface-700 rounded-2xl font-semibold hover:bg-surface-200 transition-all"
            >
              ← {t.actionBack}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
