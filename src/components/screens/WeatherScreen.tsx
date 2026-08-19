'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { mockWeatherData } from '@/lib/data/weather';
import { motion } from 'framer-motion';

export default function WeatherScreen() {
  const { t } = useI18n();
  const [selectedDay, setSelectedDay] = useState(0);
  const weather = mockWeatherData;
  const current = weather[selectedDay];

  const conditionIcon: Record<string, string> = {
    sunny: '☀️', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️', foggy: '🌫️', partly_cloudy: '⛅',
  };

  const conditionLabel: Record<string, string> = {
    sunny: t.weatherSunny, cloudy: t.weatherCloudy, rainy: t.weatherRainy,
    stormy: t.weatherStormy, foggy: t.weatherFoggy, partly_cloudy: t.weatherPartlyCloudy,
  };

  const conditionGradient: Record<string, string> = {
    sunny: 'from-amber-400 via-orange-400 to-yellow-300',
    cloudy: 'from-slate-500 via-gray-400 to-blue-300',
    rainy: 'from-blue-700 via-blue-500 to-sky-400',
    stormy: 'from-slate-800 via-purple-700 to-blue-600',
    foggy: 'from-gray-500 via-gray-300 to-slate-300',
    partly_cloudy: 'from-sky-500 via-blue-400 to-cyan-300',
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // UV level helpers
  const getUvColor = (uv: number) => {
    if (uv >= 8) return 'text-red-500';
    if (uv >= 5) return 'text-amber-500';
    return 'text-green-500';
  };

  const getUvBg = (uv: number) => {
    if (uv >= 8) return 'from-red-400 to-red-600';
    if (uv >= 5) return 'from-amber-400 to-amber-600';
    return 'from-green-400 to-green-600';
  };

  return (
    <div className="space-y-5">
      {/* Header with hero image */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: '160px' }}>
        <img
          src="/images/weather_hero.jpg"
          alt="Farmland sky"
          className="w-full h-full object-cover"
          style={{ animation: 'hero-parallax 10s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
            <span>🌦️</span> {t.weatherTitle}
          </h2>
        </div>
      </div>

      {/* Current Weather Hero Card */}
      <motion.div
        key={selectedDay}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className={`bg-gradient-to-br ${conditionGradient[current.condition]} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}
      >
        {/* Floating weather icon background */}
        <div className="absolute top-4 right-4 text-7xl opacity-15 animate-float-slow">
          {conditionIcon[current.condition]}
        </div>

        <div className="flex items-center justify-between relative z-1">
          <div>
            <p className="text-white/80 text-sm font-medium">{selectedDay === 0 ? t.weatherToday : selectedDay === 1 ? t.weatherTomorrow : new Date(current.date).toLocaleDateString()}</p>
            <div className="flex items-center gap-3 mt-2">
              <motion.span
                className="text-6xl"
                animate={{ y: [0, -4, 0], rotate: [0, 3, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                {conditionIcon[current.condition]}
              </motion.span>
              <div>
                <p className="text-5xl font-bold tracking-tight">{current.tempMax}°</p>
                <p className="text-white/70 text-sm">↓ {current.tempMin}°C</p>
              </div>
            </div>
            <p className="mt-2 text-lg font-semibold">{conditionLabel[current.condition]}</p>
          </div>
          <div className="text-right space-y-2">
            <div className="bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">{t.weatherHumidity}</p>
              <p className="font-bold text-lg">{current.humidity}%</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">{t.weatherRainfall}</p>
              <p className="font-bold text-lg">{current.rainfall}mm</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">{t.weatherWind}</p>
              <p className="font-bold text-lg">{current.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 7-day forecast scroll with snap */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scroll-snap-x">
        {weather.map((day, idx) => {
          const date = new Date(day.date);
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelectedDay(idx)}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl min-w-[72px] transition-all duration-300 ${
                idx === selectedDay
                  ? 'bg-gradient-to-b from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white text-surface-700 shadow-sm hover:bg-primary-50 hover:shadow-md'
              }`}
            >
              <span className="text-xs font-semibold">{idx === 0 ? t.today : dayNames[date.getDay()]}</span>
              <motion.span
                className="text-2xl my-1.5"
                animate={idx === selectedDay ? { y: [0, -3, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {conditionIcon[day.condition]}
              </motion.span>
              <span className="text-sm font-bold">{day.tempMax}°</span>
              <span className={`text-xs ${idx === selectedDay ? 'text-white/70' : 'text-surface-400'}`}>{day.tempMin}°</span>
            </motion.button>
          );
        })}
      </div>

      {/* Agricultural Advisory */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-premium p-5"
      >
        <h3 className="font-bold text-surface-800 flex items-center gap-2 mb-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-sm">🌾</span>
          {t.weatherAdvisory}
        </h3>
        <p className="text-surface-700 leading-relaxed bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl p-4 border border-primary-100">
          {current.advisory}
        </p>
      </motion.div>

      {/* Action Cards */}
      <div className="space-y-2.5">
        <h3 className="font-bold text-surface-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-sm">📋</span>
          {t.homeQuickActions}
        </h3>
        {current.actions.map((action, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className={`action-card ${
              action.type === 'do_today' ? 'do-today' : action.type === 'avoid' ? 'avoid' : 'check'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{action.icon}</span>
              <div className="flex-1">
                <span className={`badge ${
                  action.type === 'do_today' ? 'badge-success' : action.type === 'avoid' ? 'badge-danger' : 'badge-warning'
                }`}>
                  {action.type === 'do_today' ? t.actionDoToday : action.type === 'avoid' ? t.actionAvoid : t.actionCheckAgain}
                </span>
                <h4 className="font-semibold text-surface-800 mt-1.5">{action.title}</h4>
                <p className="text-sm text-surface-600 mt-0.5">{action.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weather detail grid with visual gauges */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-premium p-4 text-center">
          <span className="text-2xl">🌡️</span>
          <p className="text-xs text-surface-500 mt-1 font-medium">{t.weatherTemp}</p>
          <p className="text-lg font-bold text-surface-800">{current.tempMin}° – {current.tempMax}°C</p>
          {/* Mini temp bar */}
          <div className="mt-2 h-2 bg-surface-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((current.tempMax / 50) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card-premium p-4 text-center">
          <span className="text-2xl">💧</span>
          <p className="text-xs text-surface-500 mt-1 font-medium">{t.weatherHumidity}</p>
          <p className="text-lg font-bold text-surface-800">{current.humidity}%</p>
          <div className="mt-2 h-2 bg-surface-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-300 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${current.humidity}%` }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-premium p-4 text-center">
          <span className="text-2xl">🌧️</span>
          <p className="text-xs text-surface-500 mt-1 font-medium">{t.weatherRainfall}</p>
          <p className="text-lg font-bold text-surface-800">{current.rainfall} mm</p>
          <div className="mt-2 h-2 bg-surface-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((current.rainfall / 30) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="card-premium p-4 text-center">
          <span className="text-2xl">☀️</span>
          <p className="text-xs text-surface-500 mt-1 font-medium">UV Index</p>
          <p className={`text-lg font-bold ${getUvColor(current.uvIndex)}`}>
            {current.uvIndex} {current.uvIndex >= 8 ? '(High!)' : current.uvIndex >= 5 ? '(Moderate)' : '(Low)'}
          </p>
          <div className="mt-2 h-2 bg-surface-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${getUvBg(current.uvIndex)}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((current.uvIndex / 11) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
