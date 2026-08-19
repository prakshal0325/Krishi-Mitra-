'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { mockWeatherData } from '@/lib/data/weather';
import { mockMarketPrices } from '@/lib/data/market';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  const { t, language } = useI18n();
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const todayWeather = mockWeatherData[0];
  const topPrices = mockMarketPrices.slice(0, 3);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (language === 'hi') {
      if (hour < 12) return '🌅 सुप्रभात, किसान!';
      if (hour < 17) return '☀️ नमस्ते, किसान!';
      return '🌇 शुभ संध्या, किसान!';
    }
    if (hour < 12) return '🌅 Good Morning, Farmer!';
    if (hour < 17) return '☀️ Good Afternoon, Farmer!';
    return '🌇 Good Evening, Farmer!';
  }, [language]);

  const features = [
    { id: 'crop-doctor', icon: '📷', label: t.featureCropDoctor, desc: t.featureCropDoctorDesc, gradient: 'from-emerald-400 to-green-600' },
    { id: 'weather', icon: '🌦️', label: t.featureWeather, desc: t.featureWeatherDesc, gradient: 'from-sky-400 to-blue-600' },
    { id: 'market', icon: '💰', label: t.featureMarket, desc: t.featureMarketDesc, gradient: 'from-amber-400 to-orange-600' },
    { id: 'crop-plan', icon: '🌱', label: t.featureCropPlan, desc: t.featureCropPlanDesc, gradient: 'from-lime-400 to-green-600' },
    { id: 'soil', icon: '🧪', label: t.featureSoil, desc: t.featureSoilDesc, gradient: 'from-amber-600 to-yellow-700' },
    { id: 'schemes', icon: '🏛️', label: t.featureSchemes, desc: t.featureSchemesDesc, gradient: 'from-indigo-400 to-purple-600' },
    { id: 'assistant', icon: '🤖', label: t.navAssistant, desc: t.chatDisclaimer, gradient: 'from-violet-400 to-fuchsia-600' },
    { id: 'settings', icon: '⚙️', label: t.navSettings, desc: t.settingsLanguage, gradient: 'from-slate-400 to-gray-600' },
  ];

  const weatherConditionIcon: Record<string, string> = {
    sunny: '☀️', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️', foggy: '🌫️', partly_cloudy: '⛅',
  };

  const weatherGradients: Record<string, string> = {
    sunny: 'from-amber-400 via-orange-400 to-yellow-300',
    cloudy: 'from-slate-400 via-gray-400 to-blue-300',
    rainy: 'from-blue-600 via-blue-500 to-sky-400',
    stormy: 'from-slate-700 via-purple-700 to-blue-600',
    foggy: 'from-gray-400 via-gray-300 to-slate-200',
    partly_cloudy: 'from-sky-400 via-blue-400 to-cyan-300',
  };

  const handleVoiceStart = () => {
    setIsListening(true);
    setVoiceText('');

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionCtor = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : language === 'te' ? 'te-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const results = event.results;
        let transcript = '';
        for (let i = 0; i < results.length; i++) {
          transcript += results[i][0].transcript;
        }
        setVoiceText(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Simulate voice for demo
      setTimeout(() => {
        setVoiceText(language === 'hi' ? 'क्या कल बारिश होगी?' : 'Will it rain tomorrow?');
        setIsListening(false);
      }, 2000);
    }
  };

  // Navigate to assistant when voice input completes
  useEffect(() => {
    if (!isListening && voiceText) {
      const timer = setTimeout(() => {
        onNavigate('assistant');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isListening, voiceText, onNavigate]);

  // Duplicated ticker items for seamless scrolling
  const tickerItems = [...topPrices, ...topPrices, ...topPrices, ...topPrices];

  return (
    <div className="space-y-5 -mt-4">
      {/* Hero Banner with Farm Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="hero-banner -mx-4 rounded-none sm:mx-0 sm:rounded-2xl"
        style={{ minHeight: '220px' }}
      >
        <img
          src="/images/hero_farmer.jpg"
          alt="Indian farmer in a field"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: 'hero-parallax 8s ease-in-out infinite' }}
        />
        <div className="hero-overlay" />

        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                background: i % 2 === 0 ? 'rgba(253, 224, 71, 0.6)' : 'rgba(134, 239, 172, 0.5)',
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                ['--tx' as string]: `${-20 + i * 15}px`,
                ['--ty' as string]: `${-40 - i * 10}px`,
                ['--tr' as string]: `${90 + i * 60}deg`,
                ['--duration' as string]: `${5 + i * 1.5}s`,
                ['--delay' as string]: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold text-white drop-shadow-lg"
          >
            {greeting}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-white/80 text-sm mt-1"
          >
            {t.appTagline}
          </motion.p>
        </div>
      </motion.div>

      {/* Voice Button — Floating CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        className="flex flex-col items-center -mt-10 relative z-10"
      >
        <button
          onClick={handleVoiceStart}
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          style={{
            background: isListening
              ? 'linear-gradient(135deg, #dc2626, #ef4444)'
              : 'linear-gradient(135deg, #16a34a, #22c55e)',
            color: 'white',
          }}
          aria-label={t.homeTapToSpeak}
        >
          {isListening ? (
            <div className="flex gap-1 items-end">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{ height: [8, 12 + Math.random() * 20, 8] }}
                  transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.3, delay: i * 0.08 }}
                />
              ))}
            </div>
          ) : (
            <span className="text-4xl">🎙️</span>
          )}

          {/* Pulse rings */}
          <AnimatePresence>
            {isListening && (
              <>
                <motion.span
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-full border-2 border-red-400"
                />
                <motion.span
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                  className="absolute -inset-2 rounded-full border border-red-300"
                />
              </>
            )}
          </AnimatePresence>
        </button>

        <p className={`mt-3 text-sm font-semibold transition-colors ${isListening ? 'text-red-600' : 'text-surface-600'}`}>
          {isListening ? t.homeVoiceListening : t.homeVoicePrompt}
        </p>

        {/* Voice transcription bubble */}
        <AnimatePresence>
          {voiceText && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 px-5 py-3 bg-white rounded-2xl shadow-md border border-surface-200 max-w-sm"
            >
              <p className="text-surface-700 text-center">&ldquo;{voiceText}&rdquo;</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Market Price Ticker */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="ticker-container"
      >
        <div className="ticker-track">
          {tickerItems.map((p, i) => (
            <div key={i} className="ticker-item">
              <span className="text-white/70">💰</span>
              <span className="font-semibold">{p.commodity}</span>
              <span className="text-white/80">₹{p.modalPrice}</span>
              <span className={p.trend === 'up' ? 'ticker-up' : p.trend === 'down' ? 'ticker-down' : 'text-white/60'}>
                {p.trend === 'up' ? '▲' : p.trend === 'down' ? '▼' : '→'} {Math.abs(p.trendPercent)}%
              </span>
              <span className="text-white/30 ml-2">|</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weather Summary Card */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        onClick={() => onNavigate('weather')}
        className={`w-full bg-gradient-to-r ${weatherGradients[todayWeather.condition]} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98] relative overflow-hidden`}
      >
        {/* Animated weather accent */}
        <div className="absolute top-2 right-2 text-6xl opacity-10 animate-float-slow">
          {weatherConditionIcon[todayWeather.condition]}
        </div>

        <div className="flex items-center justify-between relative z-1">
          <div>
            <p className="text-white/80 text-sm font-medium flex items-center gap-1.5">
              <span className="text-base">🌾</span> {t.homeWeatherToday}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-4xl animate-float-slow">{weatherConditionIcon[todayWeather.condition]}</span>
              <div>
                <p className="text-4xl font-bold tracking-tight">{todayWeather.tempMax}°C</p>
                <p className="text-white/70 text-xs">Min {todayWeather.tempMin}°C</p>
              </div>
            </div>
          </div>
          <div className="text-right text-sm space-y-1.5">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-1 backdrop-blur-sm">
              <span>💧</span> <span className="font-semibold">{todayWeather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-1 backdrop-blur-sm">
              <span>🌧️</span> <span className="font-semibold">{todayWeather.rainfall}mm</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-1 backdrop-blur-sm">
              <span>💨</span> <span className="font-semibold">{todayWeather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
        {todayWeather.actions[0] && (
          <div className="mt-3 bg-white/20 rounded-xl px-4 py-2.5 text-sm backdrop-blur-sm flex items-center gap-2 font-medium">
            <span>{todayWeather.actions[0].icon}</span>
            {todayWeather.actions[0].title}
            <span className="ml-auto text-white/60">→</span>
          </div>
        )}
      </motion.button>

      {/* Market Quick Update */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        onClick={() => onNavigate('market')}
        className="w-full card-premium p-5 text-left hover:shadow-lg transition-all active:scale-[0.98]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-surface-800 flex items-center gap-2 text-base">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm">💰</span>
            {t.homeMarketUpdate}
          </h3>
          <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-3 py-1 rounded-full">{t.seeAll} →</span>
        </div>
        <div className="space-y-2.5">
          {topPrices.map((p, idx) => (
            <div key={p.id} className={`flex items-center justify-between py-2 ${idx < topPrices.length - 1 ? 'border-b border-surface-100' : ''}`}>
              <div>
                <span className="font-semibold text-surface-800">{p.commodity}</span>
                <span className="text-xs text-surface-400 ml-1.5">({p.variety})</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-surface-800 text-lg">₹{p.modalPrice}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  p.trend === 'up' ? 'bg-emerald-100 text-emerald-700' :
                  p.trend === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→'} {Math.abs(p.trendPercent)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.button>

      {/* Action Cards from Weather */}
      {todayWeather.actions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          <h3 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-sm">📋</span>
            {t.homeQuickActions}
          </h3>
          <div className="space-y-2.5">
            {todayWeather.actions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.1, duration: 0.4 }}
                className={`action-card ${
                  action.type === 'do_today' ? 'do-today' : action.type === 'avoid' ? 'avoid' : 'check'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{action.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`badge ${
                        action.type === 'do_today' ? 'badge-success' : action.type === 'avoid' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {action.type === 'do_today' ? t.actionDoToday : action.type === 'avoid' ? t.actionAvoid : t.actionCheckAgain}
                      </span>
                    </div>
                    <h4 className="font-semibold text-surface-800 mt-1">{action.title}</h4>
                    <p className="text-sm text-surface-600 mt-0.5">{action.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
      >
        <h3 className="font-bold text-surface-800 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-sm">🚀</span>
          {language === 'hi' ? 'सभी सेवाएं' : 'All Services'}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {features.map((feature, idx) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + idx * 0.05, type: 'spring', stiffness: 200 }}
              onClick={() => onNavigate(feature.id)}
              className="feature-card"
            >
              <div className={`icon-circle bg-gradient-to-br ${feature.gradient} text-white shadow-sm`}>
                <span className="text-xl">{feature.icon}</span>
              </div>
              <span className="text-xs font-semibold text-surface-700 text-center leading-tight">{feature.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bottom spacing */}
      <div className="h-4" />
    </div>
  );
}
