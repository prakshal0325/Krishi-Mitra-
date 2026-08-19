'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { mockMarketPrices, mspPrices, priceHistory } from '@/lib/data/market';
import { motion } from 'framer-motion';

export default function MarketScreen() {
  const { t } = useI18n();
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');

  const commodities = [...new Set(mockMarketPrices.map(p => p.commodity))];
  const filteredPrices = selectedCommodity === 'all'
    ? mockMarketPrices
    : mockMarketPrices.filter(p => p.commodity === selectedCommodity);

  const historyKey = selectedCommodity === 'Wheat' ? 'wheat' : selectedCommodity === 'Tomato' ? 'tomato' : selectedCommodity === 'Cotton' ? 'cotton' : null;
  const history = historyKey ? priceHistory[historyKey] : null;

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: '150px' }}>
        <img
          src="/images/market_hero.jpg"
          alt="Indian mandi market"
          className="w-full h-full object-cover"
          style={{ animation: 'hero-parallax 10s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
            <span>💰</span> {t.marketTitle}
          </h2>
        </div>
      </div>

      {/* Commodity filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scroll-snap-x">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setSelectedCommodity('all')}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
            selectedCommodity === 'all'
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
              : 'bg-white text-surface-700 hover:bg-primary-50'
          }`}
        >
          All
        </motion.button>
        {commodities.map(c => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSelectedCommodity(c)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
              selectedCommodity === c
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-white text-surface-700 hover:bg-primary-50'
            }`}
          >
            {c}
          </motion.button>
        ))}
      </div>

      {/* MSP Banner */}
      {selectedCommodity !== 'all' && mspPrices[selectedCommodity] && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">{t.marketMsp} ({selectedCommodity})</p>
              <p className="text-3xl font-bold text-amber-800 mt-1">
                ₹{mspPrices[selectedCommodity]}
                <span className="text-sm font-normal text-amber-600 ml-1">{t.marketPerQuintal}</span>
              </p>
            </div>
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🏛️
            </motion.span>
          </div>
        </motion.div>
      )}

      {/* Price Trend Chart */}
      {history && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-5"
        >
          <h3 className="font-bold text-surface-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-sm">📈</span>
            {t.marketTrend}
          </h3>
          <div className="flex items-end gap-2 h-36">
            {history.map((point, idx) => {
              const max = Math.max(...history.map(p => p.price));
              const min = Math.min(...history.map(p => p.price));
              const range = max - min || 1;
              const height = ((point.price - min) / range) * 80 + 20;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="text-[9px] text-surface-500 font-semibold"
                  >
                    ₹{point.price}
                  </motion.span>
                  <motion.div
                    className="w-full bg-gradient-to-t from-primary-600 via-primary-400 to-emerald-300 rounded-t-lg shadow-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                  <span className="text-[8px] text-surface-400 font-medium">{point.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Price Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-surface-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm">🏪</span>
          {t.marketNearby}
        </h3>
        {filteredPrices.map((price, idx) => {
          const netPrice = price.modalPrice - (price.transportCost || 0);
          return (
            <motion.div
              key={price.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.08 }}
              className="card-premium p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-surface-800 text-lg">{price.commodity}</h4>
                  <p className="text-xs text-surface-500">{price.variety} • {price.market}</p>
                </div>
                <span className={`badge ${
                  price.trend === 'up' ? 'badge-success' : price.trend === 'down' ? 'badge-danger' : 'badge-info'
                }`}>
                  {price.trend === 'up' ? '↑' : price.trend === 'down' ? '↓' : '→'} {Math.abs(price.trendPercent)}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-surface-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-surface-500 font-medium">{t.marketMin}</p>
                  <p className="font-bold text-surface-700">₹{price.minPrice}</p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-xl p-2.5 text-center border border-primary-200">
                  <p className="text-[10px] text-primary-600 font-medium">{t.marketModal}</p>
                  <motion.p
                    className="font-bold text-primary-700 text-lg"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    ₹{price.modalPrice}
                  </motion.p>
                </div>
                <div className="bg-surface-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-surface-500 font-medium">{t.marketMax}</p>
                  <p className="font-bold text-surface-700">₹{price.maxPrice}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm border-t border-surface-100 pt-3">
                <div className="flex items-center gap-3 text-surface-500 text-xs">
                  <span>📍 {price.distance} {t.km}</span>
                  <span>🚛 ₹{price.transportCost}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-surface-500 font-medium">{t.marketNetPrice}</p>
                  <p className="font-bold text-primary-700 text-lg">₹{netPrice}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sell Now Decision Helper */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-premium p-5 border-2 border-accent-200 bg-gradient-to-br from-accent-50/50 to-orange-50/50"
      >
        <h3 className="font-bold text-surface-800 flex items-center gap-2 text-lg mb-2">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">🤔</span>
          {t.marketSellNow}
        </h3>
        <p className="text-surface-600 text-sm leading-relaxed mb-4">
          Compare selling today vs. storing. Current prices are trending {filteredPrices[0]?.trend === 'up' ? 'upward ↑' : filteredPrices[0]?.trend === 'down' ? 'downward ↓' : 'stable →'}.
          Transport and storage costs can affect your final profit.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100"
          >
            <p className="text-xs text-surface-500 mb-1 font-medium">Sell Today</p>
            <p className="text-2xl font-bold text-green-600">₹{filteredPrices[0]?.modalPrice || 0}</p>
            <p className="text-xs text-surface-500">{t.marketPerQuintal}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 text-center shadow-sm border border-amber-100"
          >
            <p className="text-xs text-surface-500 mb-1 font-medium">Store 1 Week</p>
            <p className="text-2xl font-bold text-amber-600">₹{Math.round((filteredPrices[0]?.modalPrice || 0) * (1 + (filteredPrices[0]?.trendPercent || 0) / 100))}</p>
            <p className="text-xs text-surface-500">estimated</p>
          </motion.div>
        </div>
        <p className="text-xs text-surface-400 mt-3 text-center italic">{t.chatDisclaimer}</p>
      </motion.div>
    </div>
  );
}
