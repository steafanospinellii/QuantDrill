import { motion } from 'framer-motion';
import { subDays, startOfDay } from 'date-fns';

export default function TrainingCalendar({ sessions }) {
  // Build a set of trained dates (last 30 days)
  const today = startOfDay(new Date());
  const trainedDates = new Set(sessions.map(s => s.date));

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = subDays(today, 29 - i);
    const dateStr = d.toISOString().split('T')[0];
    return { dateStr, trained: trainedDates.has(dateStr), dayNum: d.getDate() };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.48 }}
      className="mb-6"
    >
      <div className="bg-surface-1 border border-border rounded-3xl p-5">
        <p className="text-xs font-medium text-muted-foreground tracking-widest uppercase mb-4">Training Streak — Last 30 Days</p>
        <div className="grid grid-cols-10 gap-1.5">
          {days.map((day) => (
            <div
              key={day.dateStr}
              className={`aspect-square rounded-lg flex items-center justify-center text-[9px] font-semibold transition-colors ${
                day.trained
                  ? 'bg-neon-purple text-white'
                  : 'bg-surface-2 text-muted-foreground'
              }`}
            >
              {day.dayNum}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}