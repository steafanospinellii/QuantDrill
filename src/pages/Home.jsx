import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Flame, Zap, ChevronRight, Star, Settings, ChevronDown } from 'lucide-react';
import { hasCompletedTodaysSprint, isStreakAlive } from '@/lib/streakUtils';
import SettingsModal from '@/components/SettingsModal';
import DifficultySheet from '@/components/DifficultySheet';

const DIFFICULTY_LABELS = { easy: 'Easy · 15s', medium: 'Medium · 12s', hard: 'Hard · 8s' };

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [diffSheetOpen, setDiffSheetOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const u = await base44.auth.me();
        setUser(u);
        const s = await base44.entities.Session.list('-created_date', 7);
        setSessions(s);
      } catch (e) {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  const streak = user?.streak_count || 0;
  const lastActive = user?.last_active_date;
  const streakAlive = isStreakAlive(lastActive);
  const completedToday = hasCompletedTodaysSprint(lastActive);
  const lastSession = sessions[0];
  const lastScore = lastSession?.score ?? null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background px-5 pb-6 flex flex-col"
      style={{ paddingTop: 'max(48px, env(safe-area-inset-top, 48px))' }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-grotesk font-bold text-foreground tracking-tight">
              Quant<span className="text-neon-purple">Drill</span>
            </h1>

          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-9 h-9 bg-surface-2 rounded-xl flex items-center justify-center border border-border hover:border-primary transition-colors no-select"
          >
            <Settings size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard
            label="Streak"
            value={streak}
            unit="days"
            icon={<Flame size={16} className={streakAlive ? 'text-neon-orange' : 'text-muted-foreground'} />}
            highlight={streakAlive}
            color="orange"
          />
          <StatCard
            label="Last Score"
            value={lastScore !== null ? lastScore : '—'}
            unit={lastScore !== null ? '/100' : ''}
            icon={<Star size={16} className="text-neon-purple" />}
            color="purple"
          />
          <StatCard
            label="Sessions"
            value={sessions.length}
            unit="total"
            icon={<Zap size={16} className="text-neon-cyan" />}
            color="cyan"
          />
        </div>
      </motion.div>

      {/* Completed today banner */}
      {completedToday && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-surface-2 border border-neon-cyan/20 rounded-2xl px-4 py-3 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-neon-cyan/10 flex items-center justify-center">
            <Zap size={16} className="text-neon-cyan" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Drill Complete!</p>
            <p className="text-xs text-muted-foreground">You've trained today. Keep the streak alive.</p>
          </div>
        </motion.div>
      )}

      {/* Difficulty selector — Bottom Sheet on mobile */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6">
        <p className="text-xs font-medium text-muted-foreground tracking-widest uppercase mb-3">Difficulty</p>
        <button
          onClick={() => setDiffSheetOpen(true)}
          className="w-full flex items-center justify-between bg-surface-2 border border-border rounded-2xl px-4 py-3.5 no-select hover:border-primary/50 transition-colors"
        >
          <span className="text-sm font-semibold text-foreground">{DIFFICULTY_LABELS[difficulty]}</span>
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-auto"
      >
        <button
          onClick={() => navigate(`/drill?difficulty=${difficulty}`)}
          className="w-full bg-primary text-primary-foreground font-grotesk font-bold text-lg py-5 rounded-2xl glow-purple transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 no-select"
        >
          <Zap size={22} />
          {completedToday ? 'Start Another Drill' : 'Start Daily Drill'}
          <ChevronRight size={20} />
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          10 questions · ~3 minutes · Score 0–100
        </p>
      </motion.div>

      {/* Modals */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <DifficultySheet
        open={diffSheetOpen}
        value={difficulty}
        onChange={setDifficulty}
        onClose={() => setDiffSheetOpen(false)}
      />
    </div>
  );
}

function StatCard({ label, value, unit, icon, highlight, color }) {
  const glowClass = highlight
    ? color === 'orange' ? 'border-orange-500/30 bg-orange-500/5'
    : color === 'purple' ? 'border-primary/30 bg-primary/5'
    : 'border-neon-cyan/30 bg-neon-cyan/5'
    : 'border-border bg-surface-2';

  return (
    <div className={`rounded-2xl p-3 border ${glowClass} transition-all`}>
      <div className="flex items-center gap-1.5 mb-2">{icon}<span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span></div>
      <p className="text-xl font-grotesk font-bold text-foreground tabular-nums leading-none">{value}</p>
      {unit && <p className="text-[10px] text-muted-foreground mt-0.5">{unit}</p>}
    </div>
  );
}