'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeScreen,
  CropDoctorScreen,
  WeatherScreen,
  MarketScreen,
  CropPlanScreen,
  SoilScreen,
  SchemesScreen,
  AssistantScreen,
  SettingsScreen,
} from './screens';

type Screen = 'home' | 'crop-doctor' | 'weather' | 'market' | 'crop-plan' | 'soil' | 'schemes' | 'assistant' | 'settings';

const screenVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
};

const headerGradients: Record<Screen, string> = {
  home: 'from-primary-700 via-primary-600 to-emerald-500',
  'crop-doctor': 'from-emerald-600 via-green-600 to-teal-500',
  weather: 'from-sky-600 via-blue-500 to-cyan-400',
  market: 'from-amber-600 via-orange-500 to-yellow-400',
  'crop-plan': 'from-lime-600 via-green-500 to-emerald-400',
  soil: 'from-amber-700 via-yellow-600 to-orange-400',
  schemes: 'from-indigo-600 via-purple-500 to-violet-400',
  assistant: 'from-violet-600 via-fuchsia-500 to-pink-400',
  settings: 'from-slate-600 via-gray-500 to-slate-400',
};

export default function AppShell() {
  const { t } = useI18n();
  const [activeScreen, setActiveScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <HomeScreen onNavigate={(s: string) => setActiveScreen(s as Screen)} />;
      case 'crop-doctor': return <CropDoctorScreen />;
      case 'weather': return <WeatherScreen />;
      case 'market': return <MarketScreen />;
      case 'crop-plan': return <CropPlanScreen />;
      case 'soil': return <SoilScreen />;
      case 'schemes': return <SchemesScreen />;
      case 'assistant': return <AssistantScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <HomeScreen onNavigate={(s: string) => setActiveScreen(s as Screen)} />;
    }
  };

  const navItems: { id: Screen; label: string; icon: string; activeIcon: string }[] = [
    { id: 'home', label: t.navHome, icon: '🏠', activeIcon: '🏡' },
    { id: 'crop-doctor', label: t.navCropDoctor, icon: '📷', activeIcon: '📸' },
    { id: 'weather', label: t.navWeather, icon: '🌤️', activeIcon: '🌦️' },
    { id: 'market', label: t.navMarket, icon: '💰', activeIcon: '💵' },
    { id: 'assistant', label: t.navAssistant, icon: '🤖', activeIcon: '🧠' },
  ];

  return (
    <div className="min-h-screen pb-20" style={{
      background: 'linear-gradient(180deg, #e8f5e9 0%, #f1f8e9 15%, #fffde7 40%, #ffffff 100%)',
    }}>
      {/* Top Header with animated gradient */}
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              🌾
            </motion.span>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent leading-tight">
                {t.appName}
              </h1>
              <p className="text-[10px] text-surface-500 leading-tight font-medium">{t.appTagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9, rotate: 90 }}
              onClick={() => setActiveScreen('settings')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center text-lg shadow-sm hover:shadow-md transition-all"
              aria-label={t.navSettings}
            >
              ⚙️
            </motion.button>
          </div>
        </div>
        {/* Gradient accent line */}
        <div className={`h-0.5 bg-gradient-to-r ${headerGradients[activeScreen]} transition-all duration-500`} />
      </header>

      {/* Screen Content with smooth transitions */}
      <main className="max-w-lg mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation — Premium v2 */}
      <nav className="bottom-nav">
        <div className="max-w-lg mx-auto px-2 flex items-center justify-around">
          {navItems.map(item => {
            const isActive = activeScreen === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                whileTap={{ scale: 0.88 }}
                className={`nav-item ${isActive ? 'active' : 'text-surface-400 hover:text-surface-600'}`}
                aria-label={item.label}
              >
                <motion.span
                  className="nav-icon"
                  animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {isActive ? item.activeIcon : item.icon}
                </motion.span>
                <span className={`text-[10px] leading-tight font-medium ${isActive ? 'font-bold text-primary-700' : ''}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
