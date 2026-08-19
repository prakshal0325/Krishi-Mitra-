// Krishi Mitra — Mock Weather Data
import type { WeatherData } from '@/lib/types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const mockWeatherData: WeatherData[] = [
  {
    date: fmt(today),
    tempMax: 34, tempMin: 26, humidity: 72, rainfall: 0, windSpeed: 12, windDir: 'NW',
    condition: 'partly_cloudy', uvIndex: 7,
    advisory: 'Good day for spraying. Wind speed is moderate. No rain expected for next 6 hours.',
    actions: [
      { type: 'do_today', title: 'Spray pesticide', description: 'Wind < 15 km/h, no rain forecast. Safe to spray before 10 AM.', icon: '🧪', priority: 'high' },
      { type: 'do_today', title: 'Irrigate wheat field', description: 'Temperature rising. Irrigate in evening for best results.', icon: '💧', priority: 'medium' },
      { type: 'check', title: 'Check crop growth', description: 'Crops at flowering stage need extra monitoring.', icon: '🌱', priority: 'low' },
    ],
  },
  {
    date: fmt(addDays(today, 1)),
    tempMax: 32, tempMin: 25, humidity: 82, rainfall: 15, windSpeed: 18, windDir: 'SE',
    condition: 'rainy', uvIndex: 3,
    advisory: 'Light to moderate rain expected. Do not spray today. Check drainage channels.',
    actions: [
      { type: 'avoid', title: 'Do NOT spray', description: 'Rain expected. Spray will wash away and waste money.', icon: '🚫', priority: 'high' },
      { type: 'avoid', title: 'Skip irrigation', description: 'Rain will provide natural watering. Save water.', icon: '💧', priority: 'medium' },
      { type: 'do_today', title: 'Clear drainage', description: 'Remove blockages from drain channels before rain.', icon: '🏗️', priority: 'high' },
    ],
  },
  {
    date: fmt(addDays(today, 2)),
    tempMax: 30, tempMin: 24, humidity: 88, rainfall: 35, windSpeed: 25, windDir: 'E',
    condition: 'stormy', uvIndex: 2,
    advisory: 'Heavy rain warning. Harvest mature vegetables. Protect stored grain. Stay safe.',
    actions: [
      { type: 'do_today', title: 'Harvest ripe vegetables', description: 'Heavy rain can damage mature crops. Harvest now.', icon: '🥬', priority: 'high' },
      { type: 'do_today', title: 'Cover stored grain', description: 'Use tarpaulin. Keep grain above ground level.', icon: '🌾', priority: 'high' },
      { type: 'avoid', title: 'Avoid field work', description: 'High winds and heavy rain make fieldwork unsafe.', icon: '⚠️', priority: 'high' },
    ],
  },
  {
    date: fmt(addDays(today, 3)),
    tempMax: 31, tempMin: 24, humidity: 78, rainfall: 5, windSpeed: 14, windDir: 'NE',
    condition: 'cloudy', uvIndex: 4,
    advisory: 'Light drizzle possible. Good day for transplanting seedlings.',
    actions: [
      { type: 'do_today', title: 'Transplant seedlings', description: 'Cloudy weather with light moisture is ideal for transplanting.', icon: '🌱', priority: 'medium' },
      { type: 'check', title: 'Monitor fungal risk', description: 'High humidity may cause fungal diseases. Inspect leaves.', icon: '🔍', priority: 'medium' },
    ],
  },
  {
    date: fmt(addDays(today, 4)),
    tempMax: 35, tempMin: 27, humidity: 65, rainfall: 0, windSpeed: 8, windDir: 'W',
    condition: 'sunny', uvIndex: 9,
    advisory: 'Hot and sunny day. Irrigate crops in the evening. Avoid midday field work.',
    actions: [
      { type: 'do_today', title: 'Evening irrigation', description: 'High temperature will increase evaporation. Water in evening.', icon: '💧', priority: 'high' },
      { type: 'avoid', title: 'Avoid midday work', description: 'UV index is 9. Risk of heat stroke. Work before 10 AM or after 4 PM.', icon: '☀️', priority: 'medium' },
    ],
  },
  {
    date: fmt(addDays(today, 5)),
    tempMax: 33, tempMin: 26, humidity: 70, rainfall: 2, windSpeed: 10, windDir: 'N',
    condition: 'partly_cloudy', uvIndex: 6,
    advisory: 'Stable weather. Good conditions for fertilizer application.',
    actions: [
      { type: 'do_today', title: 'Apply fertilizer', description: 'Slightly moist soil and cloudy sky. Ideal for urea or DAP.', icon: '🧪', priority: 'medium' },
    ],
  },
  {
    date: fmt(addDays(today, 6)),
    tempMax: 34, tempMin: 27, humidity: 68, rainfall: 0, windSpeed: 11, windDir: 'NW',
    condition: 'sunny', uvIndex: 8,
    advisory: 'Clear skies ahead. Good week for most field activities.',
    actions: [
      { type: 'do_today', title: 'Weed removal', description: 'Dry conditions make weeding easier and more effective.', icon: '🌿', priority: 'low' },
    ],
  },
];
