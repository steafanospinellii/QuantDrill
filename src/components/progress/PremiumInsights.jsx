import { motion } from 'framer-motion';
import { Lock, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS } from '@/lib/badges';

const CATEGORIES = ['mental_math', 'percentages_growth', 'business_math', 'market_sizing', 'gmat_quant'];
const ELITE_BENCHMARKS = {
  mental_math: 88,
  percentages_growth: 85,
  business_math: 82,
  market_sizing: 80,
  gmat_quant: 87,
};

export default function PremiumInsights({ sessions, isPremium, user }) {
  const navigate = useNavigate();

  // Compute stats
  const catStats = CATEGORIES.map(cat => {
    const catSessions = sessions.filter(s => s.category === cat);
    const avgScore = catSessions.length
      ? Math.round(catSessions.reduce((s, r) => s + r.score, 0) / catSessions.length)
      : 0;
    const avgAcc = catSessions.length
      ? Math.round(catSessions.reduce((s, r) => s + (r.accuracy || 0), 0) / catSessions.length)
      : 0;
    const avgTime = catSessions.length
      ? parseFloat((catSessions.reduce((s, r) => s + (r.avg_time || 0), 0) / catSessions.length).toFixed(1))
      : 0;
    return { cat, avgScore, avgAcc, avgTime, count: catSessions.length };
  }).filter(c => c.count > 0);

  const sorted = [...catStats].sort((a, b) => b.avgScore - a.avgScore);
  const weakest = [...catStats].sort((a, b) => a.avgScore - b.avgScore);

  // Speed under pressure (< 8 seconds)
  const fastAnswers = sessions.filter(s => s.avg_time && s.avg_time < 8);
  const fastAccuracy = fastAnswers.length
    ? Math.round(fastAnswers.reduce((s, r) => s + (r.accuracy || 0), 0) / fastAnswers.length)
    : 0;

  // Consistency — std dev of recent 10 scores
  const recent10 = sessions.slice(0, 10);
  const consistency = recent10.length
    ? (() => {
        const mean = recent10.reduce((s, r) => s + r.score, 0) / recent10.length;
        const variance = recent10.reduce((s, r) => s + Math.pow(r.score - mean, 2), 0) / recent10.length;
        const stdDev = Math.sqrt(variance);
        return Math.max(0, 100 - stdDev * 5); // Scale to 0–100, inverted
      })()
    : 0;

  // Improvement: last 7 vs previous 7
  const sorted_by_date = [...sessions].sort((a, b) => a.date > b.date ? -1 : 1);
  const last7 = sorted_by_date.slice(0, 7);
  const prev7 = sorted_by_date.slice(7, 14);

  const lastAvgScore = last7.length ? Math.round(last7.reduce((s, r) => s + r.score, 0) / last7.length) : 0;
  const prevAvgScore = prev7.length ? Math.round(prev7.reduce((s, r) => s + r.score, 0) / prev7.length) : 0;
  const lastAvgAcc = last7.length ? Math.round(last7.reduce((s, r) => s + (r.accuracy || 0), 0) / last7.length) : 0;
  const prevAvgAcc = prev7.length ? Math.round(prev7.reduce((s, r) => s + (r.accuracy || 0), 0) / prev7.length) : 0;

  const scoreDelta = lastAvgScore - prevAvgScore;
  const accDelta = lastAvgAcc - prevAvgAcc;

  // Blurred state for free users
  const blurClass = isPremium ? '' : 'blur-xl brightness-50';
  const showLock = !isPremium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.52 }}
      className="relative"
    >
      {/* Section label */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Premium Insights</p>
        {showLock && <Lock size={12} className="text-muted-foreground" />}
      </div>

      {/* Blurred container */}
      <div className={`relative transition-all duration-300 ${blurClass}`}>
        <div className="space-y-3">
          {/* Card 1: Elite Gap Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54 }}
            className="bg-surface-2 border border-border rounded-2xl p-4"
          >
            <p className="text-xs font-semibold text-foreground mb-3">Elite Gap Tracker</p>
            <div className="space-y-2.5">
              {catStats.map(({ cat, avgScore }) => {
                const elite = ELITE_BENCHMARKS[cat];
                const yourWidth = Math.min(100, (avgScore / elite) * 100);
                const eliteWidth = 100;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[cat]}</p>
                      <span className="text-xs font-semibold text-foreground">{avgScore} vs {elite}</span>
                    </div>
                    <div className="flex gap-2 h-1.5">
                      <div className="flex-1 bg-surface-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neon-purple rounded-full transition-all"
                          style={{ width: `${yourWidth}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-surface-3 rounded-full overflow-hidden opacity-40">
                        <div className="h-full bg-muted-foreground rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Card 2: Weakness Radar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56 }}
            className="bg-surface-2 border border-border rounded-2xl p-4"
          >
            <p className="text-xs font-semibold text-foreground mb-3">Weakness Radar</p>
            <div className="space-y-2">
              {weakest.map(({ cat, avgScore }) => {
                let color = 'text-red-400';
                let bgColor = 'bg-red-500/10';
                if (avgScore >= 50 && avgScore < 70) {
                  color = 'text-yellow-400';
                  bgColor = 'bg-yellow-500/10';
                } else if (avgScore >= 70) {
                  color = 'text-emerald-400';
                  bgColor = 'bg-emerald-500/10';
                }
                return (
                  <div key={cat} className={`${bgColor} rounded-lg px-3 py-2 flex items-center justify-between`}>
                    <span className="text-xs text-foreground">{CATEGORY_LABELS[cat]}</span>
                    <span className={`text-xs font-bold ${color}`}>{avgScore}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Card 3: Speed Under Pressure */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            className="bg-surface-2 border border-border rounded-2xl p-4"
          >
            <p className="text-xs font-semibold text-foreground mb-3">Speed Under Pressure</p>
            <div className="text-center">
              <p className="text-3xl font-grotesk font-black text-neon-cyan">{fastAccuracy}%</p>
              <p className="text-xs text-muted-foreground mt-1">Correct answers under 8 seconds</p>
              {fastAnswers.length > 0 && (
                <p className="text-[10px] text-muted-foreground/60 mt-1">({fastAnswers.length} answers)</p>
              )}
            </div>
          </motion.div>

          {/* Card 4: Consistency Score */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.60 }}
            className="bg-surface-2 border border-border rounded-2xl p-4"
          >
            <p className="text-xs font-semibold text-foreground mb-3">Consistency Score</p>
            <div className="text-center">
              <p className="text-3xl font-grotesk font-black text-neon-purple">{Math.round(consistency)}</p>
              <p className="text-xs text-muted-foreground mt-1">Stability across sessions</p>
              {recent10.length > 0 && (
                <p className="text-[10px] text-muted-foreground/60 mt-1">(last {recent10.length} sessions)</p>
              )}
            </div>
          </motion.div>

          {/* Card 5: Improvement Momentum */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62 }}
            className="bg-surface-2 border border-border rounded-2xl p-4"
          >
            <p className="text-xs font-semibold text-foreground mb-3">Improvement Momentum</p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Score Trend</span>
                <div className="flex items-center gap-2">
                  {scoreDelta >= 0 ? (
                    <TrendingUp size={12} className="text-emerald-400" />
                  ) : (
                    <TrendingDown size={12} className="text-red-400" />
                  )}
                  <span className={`text-xs font-bold ${scoreDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {scoreDelta >= 0 ? '+' : ''}{scoreDelta}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Accuracy Trend</span>
                <div className="flex items-center gap-2">
                  {accDelta >= 0 ? (
                    <TrendingUp size={12} className="text-emerald-400" />
                  ) : (
                    <TrendingDown size={12} className="text-red-400" />
                  )}
                  <span className={`text-xs font-bold ${accDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {accDelta >= 0 ? '+' : ''}{accDelta}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Unlock CTA for free users */}
      {showLock && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none">
          <button
            onClick={() => navigate('/paywall')}
            className="px-6 py-3 bg-primary text-primary-foreground text-xs font-bold rounded-xl pointer-events-auto no-select active:scale-95 transition-transform"
          >
            Unlock Premium Insights →
          </button>
        </div>
      )}
    </motion.div>
  );
}