import { motion } from 'framer-motion';
import { getSpeedPercentile } from '@/lib/questionGenerator';

// Accuracy percentile: simple Gaussian approximation (median ~68%, SD ~12%)
function getAccuracyPercentile(accuracy) {
  const z = (accuracy - 68) / 12;
  const pct = Math.round(50 + 45 * Math.tanh(z));
  return Math.max(2, Math.min(99, pct));
}

// Ring drawing helpers
function Ring({ radius, stroke, progress, color, bg = '#1e2535' }) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));
  const size = (radius + stroke) * 2;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={bg} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetricCard({ label, value, sub, highlight, progress, ringColor, delay = 0, noData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-surface-2 border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-2"
    >
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none">{label}</p>
      <div className="relative flex items-center justify-center my-1">
        <Ring radius={30} stroke={4} progress={noData ? 0 : progress} color={ringColor} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-grotesk font-black tabular-nums text-foreground leading-none">
            {noData ? '—' : value}
          </span>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">
        {noData ? 'No data yet' : sub}
      </p>
    </motion.div>
  );
}

export default function BenchmarkMetrics({ sessions }) {
  const last5 = sessions.slice(0, 5);
  const hasData = last5.length > 0;

  // Accuracy: moving avg of last 5
  const avgAccuracy = hasData
    ? Math.round(last5.reduce((s, r) => s + (r.accuracy ?? 0), 0) / last5.length)
    : 0;
  const accuracyPct = getAccuracyPercentile(avgAccuracy);

  // Speed: moving avg of avg_time across last 5
  const avgSpeed = hasData
    ? parseFloat((last5.reduce((s, r) => s + (r.avg_time ?? 14), 0) / last5.length).toFixed(1))
    : 0;
  // Use a blended percentile across all difficulties (assume medium-ish benchmark)
  const speedPct = hasData ? getSpeedPercentile(avgSpeed, 'medium') : 0;

  // Volume
  const totalSessions = sessions.length;

  // Progress ring values (0–1)
  const accuracyProgress = avgAccuracy / 100;
  const speedProgress = Math.min(1, speedPct / 100);
  const volumeProgress = Math.min(1, totalSessions / 50); // cap ring at 50 sessions

  return (
    <div className="grid grid-cols-3 gap-3">
      <MetricCard
        label="5-Session Accuracy"
        value={`${avgAccuracy}%`}
        sub={<>More accurate than <span className="font-bold text-neon-cyan">{accuracyPct}%</span> of candidates</>}
        progress={accuracyProgress}
        ringColor="hsl(174 100% 45%)"
        delay={0.05}
        noData={!hasData}
      />
      <MetricCard
        label="5-Session Speed"
        value={`${avgSpeed}s`}
        sub={
          speedPct >= 90
            ? <span className="font-bold text-neon-purple">Top 10% fastest candidates</span>
            : speedPct >= 95
            ? <span className="font-bold text-neon-cyan">Top 5% fastest candidates</span>
            : <>Faster than <span className="font-bold text-neon-purple">{speedPct}%</span> of candidates</>
        }
        progress={speedProgress}
        ringColor="hsl(262 83% 68%)"
        delay={0.1}
        noData={!hasData}
      />
      <MetricCard
        label="Total Volume"
        value={totalSessions}
        sub="Sessions completed"
        progress={volumeProgress}
        ringColor="hsl(28 100% 58%)"
        delay={0.15}
        noData={totalSessions === 0}
      />
    </div>
  );
}