// Krishi Mitra — Mock Market Prices
import type { MarketPrice } from '@/lib/types';

export const mockMarketPrices: MarketPrice[] = [
  // Wheat
  { id: 'w1', commodity: 'Wheat', variety: 'Sharbati', market: 'Karnal Mandi', district: 'Karnal', state: 'Haryana', minPrice: 2250, maxPrice: 2450, modalPrice: 2350, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'up', trendPercent: 3.2, distance: 15, transportCost: 80 },
  { id: 'w2', commodity: 'Wheat', variety: 'Sharbati', market: 'Ambala Mandi', district: 'Ambala', state: 'Haryana', minPrice: 2200, maxPrice: 2400, modalPrice: 2300, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'up', trendPercent: 2.5, distance: 45, transportCost: 200 },
  { id: 'w3', commodity: 'Wheat', variety: 'HD-2967', market: 'Ludhiana Mandi', district: 'Ludhiana', state: 'Punjab', minPrice: 2280, maxPrice: 2500, modalPrice: 2400, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'up', trendPercent: 4.1, distance: 80, transportCost: 350 },
  // Rice
  { id: 'r1', commodity: 'Rice (Paddy)', variety: 'Basmati 1121', market: 'Karnal Mandi', district: 'Karnal', state: 'Haryana', minPrice: 3800, maxPrice: 4200, modalPrice: 4000, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'stable', trendPercent: 0.5, distance: 15, transportCost: 80 },
  { id: 'r2', commodity: 'Rice (Paddy)', variety: 'PR-126', market: 'Amritsar Mandi', district: 'Amritsar', state: 'Punjab', minPrice: 2100, maxPrice: 2300, modalPrice: 2200, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'down', trendPercent: -1.8, distance: 120, transportCost: 500 },
  // Tomato
  { id: 't1', commodity: 'Tomato', variety: 'Hybrid', market: 'Azadpur Mandi', district: 'Delhi', state: 'Delhi', minPrice: 1200, maxPrice: 2800, modalPrice: 2000, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'up', trendPercent: 12.5, distance: 200, transportCost: 800 },
  { id: 't2', commodity: 'Tomato', variety: 'Local', market: 'Madanapalle', district: 'Annamayya', state: 'Andhra Pradesh', minPrice: 800, maxPrice: 1800, modalPrice: 1300, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'down', trendPercent: -8.2, distance: 30, transportCost: 120 },
  // Cotton
  { id: 'c1', commodity: 'Cotton', variety: 'DCH-32', market: 'Adilabad Mandi', district: 'Adilabad', state: 'Telangana', minPrice: 6200, maxPrice: 7000, modalPrice: 6600, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'up', trendPercent: 5.3, distance: 25, transportCost: 100 },
  { id: 'c2', commodity: 'Cotton', variety: 'Shankar-6', market: 'Rajkot Mandi', district: 'Rajkot', state: 'Gujarat', minPrice: 6400, maxPrice: 7200, modalPrice: 6800, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'stable', trendPercent: 1.0, distance: 500, transportCost: 2000 },
  // Onion
  { id: 'o1', commodity: 'Onion', variety: 'Red', market: 'Lasalgaon Mandi', district: 'Nashik', state: 'Maharashtra', minPrice: 1000, maxPrice: 1800, modalPrice: 1400, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'down', trendPercent: -6.5, distance: 300, transportCost: 1200 },
  { id: 'o2', commodity: 'Onion', variety: 'White', market: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', minPrice: 900, maxPrice: 1500, modalPrice: 1200, date: new Date().toISOString().slice(0,10), unit: 'quintal', trend: 'stable', trendPercent: 0.8, distance: 150, transportCost: 600 },
];

export const mspPrices: Record<string, number> = {
  'Wheat': 2275,
  'Rice (Paddy)': 2183,
  'Cotton': 6620,
  'Maize': 2090,
  'Soybean': 4600,
  'Mustard': 5650,
  'Groundnut': 6377,
  'Sugarcane': 315,
  'Jowar': 3180,
  'Bajra': 2500,
  'Moong': 8558,
  'Urad': 6950,
  'Chana': 5440,
  'Tur/Arhar': 7000,
};

// Mock price history for chart
export const priceHistory = {
  wheat: [
    { date: '2026-07-01', price: 2180 }, { date: '2026-07-05', price: 2200 },
    { date: '2026-07-10', price: 2220 }, { date: '2026-07-15', price: 2250 },
    { date: '2026-07-20', price: 2280 }, { date: '2026-07-25', price: 2310 },
    { date: '2026-08-01', price: 2340 }, { date: '2026-08-05', price: 2350 },
  ],
  tomato: [
    { date: '2026-07-01', price: 1500 }, { date: '2026-07-05', price: 1650 },
    { date: '2026-07-10', price: 1800 }, { date: '2026-07-15', price: 2100 },
    { date: '2026-07-20', price: 1900 }, { date: '2026-07-25', price: 1750 },
    { date: '2026-08-01', price: 1850 }, { date: '2026-08-05', price: 2000 },
  ],
  cotton: [
    { date: '2026-07-01', price: 6300 }, { date: '2026-07-05', price: 6350 },
    { date: '2026-07-10', price: 6400 }, { date: '2026-07-15', price: 6500 },
    { date: '2026-07-20', price: 6550 }, { date: '2026-07-25', price: 6580 },
    { date: '2026-08-01', price: 6600 }, { date: '2026-08-05', price: 6600 },
  ],
};
