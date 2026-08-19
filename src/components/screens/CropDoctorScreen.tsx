'use client';

import { useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { crops } from '@/lib/data/crops';
import { diseases } from '@/lib/data/crops';
import { motion, AnimatePresence } from 'framer-motion';

export default function CropDoctorScreen() {
  const { t, language } = useI18n();
  const [step, setStep] = useState<'select' | 'upload' | 'analyzing' | 'results'>('select');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<typeof diseases[0] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setStep('analyzing');
        // Simulate AI analysis
        setTimeout(() => {
          const cropDiseases = diseases.filter(d => d.crop === selectedCrop);
          const result = cropDiseases.length > 0 ? cropDiseases[0] : diseases[0];
          setDiagnosisResult({ ...result, confidence: 75 + Math.floor(Math.random() * 20) });
          setStep('results');
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoAnalysis = () => {
    setStep('analyzing');
    setTimeout(() => {
      const cropDiseases = diseases.filter(d => d.crop === selectedCrop);
      const result = cropDiseases.length > 0 ? cropDiseases[0] : diseases[0];
      setDiagnosisResult({ ...result, confidence: 78 });
      setStep('results');
    }, 2500);
  };

  const getCropName = (crop: typeof crops[0]) => {
    if (language === 'hi') return crop.nameHi;
    if (language === 'pa') return crop.namePa;
    if (language === 'te') return crop.nameTe;
    return crop.name;
  };

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: '160px' }}>
        <img
          src="/images/crop_doctor_hero.jpg"
          alt="AI crop scanning"
          className="w-full h-full object-cover"
          style={{ animation: 'hero-parallax 10s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
            <span>📷</span> {t.cropDoctorTitle}
          </h2>
        </div>
        {/* Scanning line animation */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* Step: Select Crop */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <p className="text-surface-600 font-medium">{t.cropDoctorSelectCrop}</p>
            <div className="grid grid-cols-3 gap-3">
              {crops.map((crop, idx) => (
                <motion.button
                  key={crop.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`feature-card ${selectedCrop === crop.id ? 'active' : ''}`}
                >
                  <motion.span
                    className="text-3xl"
                    animate={selectedCrop === crop.id ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {crop.image}
                  </motion.span>
                  <span className="text-xs font-semibold">{getCropName(crop)}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {selectedCrop && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <p className="text-surface-600 font-semibold">{t.cropDoctorTakeFullPhoto}</p>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="upload-zone p-6 flex flex-col items-center gap-3 transition-all bg-white"
                    >
                      <motion.span
                        className="text-4xl"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        📸
                      </motion.span>
                      <span className="font-semibold text-surface-800 text-sm">{t.cropDoctorCamera}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="upload-zone p-6 flex flex-col items-center gap-3 transition-all bg-white"
                    >
                      <motion.span
                        className="text-4xl"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                      >
                        📁
                      </motion.span>
                      <span className="font-semibold text-surface-800 text-sm">{t.cropDoctorUpload}</span>
                    </motion.button>
                  </div>

                  {/* Demo button */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDemoAnalysis}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-50 to-emerald-50 text-primary-700 rounded-xl font-semibold border border-primary-200 hover:from-primary-100 hover:to-emerald-100 transition-all"
                  >
                    🔬 Demo Analysis (No Photo)
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Step: Analyzing */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10"
          >
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-48 h-48 mx-auto rounded-2xl overflow-hidden mb-6 shadow-xl relative"
              >
                <img src={imagePreview} alt="Uploaded crop" className="w-full h-full object-cover" />
                {/* Scanning overlay */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
                <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-2xl" />
              </motion.div>
            )}

            {/* DNA-style spinner */}
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary-200"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-1 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-4 border-b-emerald-400 border-r-transparent border-t-transparent border-l-transparent"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xl">🧬</span>
              </div>
            </div>

            <p className="text-lg font-bold text-surface-700">{t.cropDoctorAnalyzing}</p>
            <div className="mt-4 space-y-2.5 text-sm">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-surface-500 flex items-center justify-center gap-2"
              >
                <motion.span animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 2 }}>🔍</motion.span>
                Identifying crop type...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="text-surface-500 flex items-center justify-center gap-2"
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>🧬</motion.span>
                Analyzing symptoms...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="text-surface-500 flex items-center justify-center gap-2"
              >
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1 }}>📚</motion.span>
                Searching knowledge base...
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Step: Results */}
        {step === 'results' && diagnosisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Warning Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <motion.span
                className="text-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ⚠️
              </motion.span>
              <p className="text-sm text-amber-800 font-medium">{t.cropDoctorNotConfirmed}</p>
            </motion.div>

            {/* Diagnosis Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-premium p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-surface-800">{t.cropDoctorPossible}</h3>
                <span className={`badge ${
                  (diagnosisResult.confidence || 0) >= 80 ? 'badge-success' : 'badge-warning'
                }`}>
                  {t.cropDoctorConfidence}: {diagnosisResult.confidence}%
                </span>
              </div>

              {/* Confidence meter */}
              <div className="confidence-meter mb-4">
                <motion.div
                  className="fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${diagnosisResult.confidence}%` }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  style={{
                    background: (diagnosisResult.confidence || 0) >= 80
                      ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                      : 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                  }}
                />
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-100 mb-4">
                <h4 className="text-lg font-bold text-red-800">{language === 'hi' ? diagnosisResult.nameHi : diagnosisResult.name}</h4>
                <p className="text-sm text-red-700 mt-1">{diagnosisResult.name}</p>
                <span className={`badge mt-2 ${
                  diagnosisResult.severity === 'critical' ? 'badge-danger' :
                  diagnosisResult.severity === 'high' ? 'badge-warning' : 'badge-info'
                }`}>
                  Severity: {diagnosisResult.severity.toUpperCase()}
                </span>
              </div>

              {/* Symptoms */}
              <div className="mb-4">
                <h4 className="font-bold text-surface-800 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center text-xs">🔍</span>
                  Symptoms
                </h4>
                <ul className="space-y-2">
                  {diagnosisResult.symptoms.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="flex items-start gap-2 text-sm text-surface-700 bg-red-50/50 rounded-lg p-2"
                    >
                      <span className="text-red-400 mt-0.5 font-bold">•</span> {s}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Treatment */}
              <div className="mb-4">
                <h4 className="font-bold text-surface-800 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center text-xs">💊</span>
                  {t.cropDoctorTreatment}
                </h4>
                <div className="space-y-2">
                  {diagnosisResult.treatment.map((tr, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="action-card do-today"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 font-bold text-lg">{i + 1}.</span>
                        <p className="text-sm text-surface-700">{tr}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Prevention */}
              <div className="mb-4">
                <h4 className="font-bold text-surface-800 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-xs">🛡️</span>
                  {t.cropDoctorPrevention}
                </h4>
                <ul className="space-y-2">
                  {diagnosisResult.prevention.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      className="flex items-start gap-2 text-sm text-surface-700 bg-blue-50/50 rounded-lg p-2"
                    >
                      <span className="text-primary-500 mt-0.5">✓</span> {p}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Expert Escalation */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>📞</span> {t.cropDoctorExpert}
            </motion.button>

            {/* Scan Again */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setStep('select'); setImagePreview(null); setDiagnosisResult(null); }}
              className="w-full py-3.5 bg-surface-100 text-surface-700 rounded-2xl font-semibold hover:bg-surface-200 transition-all"
            >
              🔄 Scan Another
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
