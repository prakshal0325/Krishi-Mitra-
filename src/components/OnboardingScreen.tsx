'use client';

import { useState } from 'react';
import { useI18n, languageMeta } from '@/lib/i18n';
import type { Language } from '@/lib/types';
import { crops } from '@/lib/data/crops';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const states = [
  { value: 'haryana', label: 'Haryana / हरियाणा', districts: ['Karnal', 'Ambala', 'Hisar', 'Sirsa', 'Panipat'] },
  { value: 'punjab', label: 'Punjab / ਪੰਜਾਬ', districts: ['Ludhiana', 'Amritsar', 'Patiala', 'Bathinda', 'Jalandhar'] },
  { value: 'telangana', label: 'Telangana / తెలంగాణ', districts: ['Hyderabad', 'Warangal', 'Adilabad', 'Karimnagar', 'Nizamabad'] },
  { value: 'andhra', label: 'Andhra Pradesh / ఆంధ్ర ప్రదేశ్', districts: ['Anantapur', 'Kurnool', 'Guntur', 'Krishna', 'Prakasam'] },
  { value: 'mp', label: 'Madhya Pradesh / मध्य प्रदेश', districts: ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Sagar'] },
  { value: 'rajasthan', label: 'Rajasthan / राजस्थान', districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'] },
];

const stepVariants = {
  initial: { opacity: 0, x: 60, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -60, scale: 0.95 },
};

export default function OnboardingScreen({ onComplete }: Props) {
  const { language, setLanguage, t } = useI18n();
  const [step, setStep] = useState(0);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const toggleCrop = (cropId: string) => {
    setSelectedCrops(prev =>
      prev.includes(cropId) ? prev.filter(c => c !== cropId) : [...prev, cropId]
    );
  };

  const districts = states.find(s => s.value === selectedState)?.districts || [];

  const handleFinish = () => {
    localStorage.setItem('krishi-state', selectedState);
    localStorage.setItem('krishi-district', selectedDistrict);
    localStorage.setItem('krishi-crops', JSON.stringify(selectedCrops));
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #e8f5e9 0%, #ffffff 40%, #fffde7 70%, #fff8e1 100%)',
    }}>
      {/* Floating background particles */}
      <div className="particles-container">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${10 + i * 12}%`,
              top: `${10 + (i % 4) * 20}%`,
              background: i % 3 === 0
                ? 'rgba(34, 197, 94, 0.3)'
                : i % 3 === 1
                  ? 'rgba(253, 224, 71, 0.4)'
                  : 'rgba(14, 165, 233, 0.3)',
              width: `${5 + (i % 3) * 3}px`,
              height: `${5 + (i % 3) * 3}px`,
              ['--tx' as string]: `${-30 + i * 12}px`,
              ['--ty' as string]: `${-50 - i * 8}px`,
              ['--tr' as string]: `${60 + i * 40}deg`,
              ['--duration' as string]: `${6 + i * 1.2}s`,
              ['--delay' as string]: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* Progress Bar — Connected dots */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-surface-200">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-emerald-400 rounded-r-full"
            animate={{ width: `${((step + 1) / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="max-w-sm mx-auto px-8 mt-4 flex items-center justify-between">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              <motion.div
                animate={{
                  scale: step === i ? 1.2 : 1,
                  backgroundColor: step >= i ? '#22c55e' : '#e2e8f0',
                }}
                className="w-3 h-3 rounded-full"
                transition={{ type: 'spring', stiffness: 300 }}
              />
              {i < 3 && (
                <motion.div
                  className="h-0.5 w-16 sm:w-20"
                  animate={{
                    backgroundColor: step > i ? '#22c55e' : '#e2e8f0',
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div
              key="welcome"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center w-full"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                🌾
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-500 bg-clip-text text-transparent mb-2"
              >
                कृषि मित्र
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-surface-600 mb-1"
              >
                Krishi Mitra
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-surface-500 mb-10"
              >
                {t.appTagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full glass rounded-2xl p-6 shadow-xl"
              >
                <h2 className="text-lg font-bold text-surface-800 mb-4">{t.onboardingLanguage}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(languageMeta) as [Language, typeof languageMeta.hi][]).map(([code, meta], idx) => (
                    <motion.button
                      key={code}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLanguage(code)}
                      className={`p-4 rounded-xl text-center transition-all duration-200 border-2 ${
                        language === code
                          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-emerald-50 shadow-md'
                          : 'border-surface-200 bg-white hover:border-primary-300 hover:bg-primary-50/30'
                      }`}
                    >
                      <div className="text-lg font-bold">{meta.nativeName}</div>
                      <div className="text-sm text-surface-500">{meta.name}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                className="mt-8 w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-8 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {t.actionNext} →
              </motion.button>
            </motion.div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <motion.div
              key="location"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-5xl mb-3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  📍
                </motion.div>
                <h2 className="text-2xl font-bold text-surface-800">{t.onboardingLocation}</h2>
                <p className="text-surface-500 mt-1">{t.onboardingLocationDesc}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">State / राज्य</label>
                  <select
                    value={selectedState}
                    onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                    className="w-full p-4 rounded-2xl border-2 border-surface-200 bg-white text-lg focus:border-primary-500 focus:outline-none shadow-sm transition-all"
                  >
                    <option value="">-- Select State --</option>
                    {states.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <AnimatePresence>
                  {districts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-semibold text-surface-700 mb-2">District / ज़िला</label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-surface-200 bg-white text-lg focus:border-primary-500 focus:outline-none shadow-sm transition-all"
                      >
                        <option value="">-- Select District --</option>
                        {districts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(0)}
                  className="flex-1 py-4 rounded-2xl border-2 border-surface-200 text-surface-600 font-bold hover:bg-surface-50 transition-all"
                >
                  {t.actionBack}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedState}
                >
                  {t.actionNext} →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Crops */}
          {step === 2 && (
            <motion.div
              key="crops"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-5xl mb-3"
                  animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  🌱
                </motion.div>
                <h2 className="text-2xl font-bold text-surface-800">{t.onboardingCrop}</h2>
                <p className="text-surface-500 mt-1">{t.onboardingCropDesc}</p>
                {selectedCrops.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-primary-600 font-semibold mt-2 text-sm"
                  >
                    {selectedCrops.length} selected
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {crops.map((crop, idx) => {
                  const isSelected = selectedCrops.includes(crop.id);
                  const nameKey = `name${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof typeof crop;
                  const displayName = (crop[nameKey] as string) || crop.name;
                  return (
                    <motion.button
                      key={crop.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => toggleCrop(crop.id)}
                      className={`p-4 rounded-2xl text-center transition-all duration-200 border-2 ${
                        isSelected
                          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-emerald-50 shadow-lg'
                          : 'border-surface-200 bg-white hover:border-primary-300 hover:shadow-md'
                      }`}
                    >
                      <motion.div
                        className="text-3xl mb-1"
                        animate={isSelected ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        {crop.image}
                      </motion.div>
                      <div className="font-bold text-surface-800">{displayName}</div>
                      <div className="text-xs text-surface-500">{crop.name}</div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-1 w-5 h-5 mx-auto rounded-full bg-primary-500 text-white flex items-center justify-center text-xs"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl border-2 border-surface-200 text-surface-600 font-bold hover:bg-surface-50 transition-all"
                >
                  {t.actionBack}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-2xl font-bold shadow-lg"
                >
                  {t.actionNext} →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Ready */}
          {step === 3 && (
            <motion.div
              key="ready"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center w-full"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-emerald-500 bg-clip-text text-transparent mb-3">
                {t.onboardingReady}
              </h2>
              <p className="text-lg text-surface-600 mb-8">{t.appTagline}</p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 shadow-xl mb-8 text-left"
              >
                <div className="space-y-3">
                  {[
                    { icon: '🗣️', text: t.homeVoicePrompt },
                    { icon: '📸', text: t.featureCropDoctorDesc },
                    { icon: '🌦️', text: t.featureWeatherDesc },
                    { icon: '💰', text: t.featureMarketDesc },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 bg-white/60 rounded-xl p-3"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-surface-700 text-sm font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500 text-white py-4 px-8 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all animate-glow-pulse"
              >
                {t.onboardingStart} 🚀
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
