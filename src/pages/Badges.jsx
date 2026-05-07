import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

const BADGES = [
  {
    id: 'getting_started',
    label: 'Getting Started',
    description: 'Complete 10 drills',
    required: 10,
    emoji: '🎯',
    color: 'text-neon-cyan',
    bg: 'bg-neon-cyan/10',
    border: 'border-neon-cyan/30',
  },
  {
    id: 'consistency_builder',
    label: 'Consistency Builder',
    description: 'Complete 50 drills',
    required: 50,
    emoji: '🔥',
    color: 'text-neon-orange',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  {
    id: 'quantified_mind',
    label: 'Quantified Mind',
    description: 'Complete 100 drills',
    required: 100,
    emoji: '⚡',
    color: 'text-neon-purple',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
  },
  {
    id: 'elite_performer',
    label: 'Elite Performer',
    description: 'Complete 500 drills',
    required: 500,
    emoji: '🏆',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
];

export default function Badges() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const s = await base44.entities.Session.list('-date', 500);
        setSessions(s);
      } catch (e) {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  const totalDrills = sessions.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-5 pt-10 pb-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-grotesk font-bold text-foreground mb-1">Achievements</h2>
        <p className="text-sm text-muted-foreground mb-2">Your personal training milestones</p>
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xs text-muted-foreground">{totalDrills} drills completed</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="text-xs text-neon-cyan font-medium">
            {BADGES.filter(b => totalDrills >= b.required).length}/{BADGES.length} unlocked
          </span>
        </div>
      </motion.div>

      {/* Progress to next badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {(() => {
          const next = BADGES.find(b => totalDrills < b.required);
          if (!next) return (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-4 py-3 mb-6 text-center">
              <p className="text-yellow-400 font-grotesk font-bold">🏆 All badges unlocked!</p>
            </div>
          );
          const prev = BADGES[BADGES.indexOf(next) - 1];
          const from = prev?.required || 0;
          const pct = Math.round(((totalDrills - from) / (next.required - from)) * 100);
          return (
            <div className="bg-surface-2 border border-border rounded-2xl px-4 py-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Next Badge</p>
                <span className="text-xs font-semibold text-foreground">{totalDrills}/{next.required} drills</span>
              </div>
              <p className="text-sm font-grotesk font-bold text-foreground mb-3">{next.emoji} {next.label}</p>
              <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{Math.max(0, next.required - totalDrills)} drills to go</p>
            </div>
          );
        })()}
      </motion.div>

      {/* Badge cards */}
      <div className="space-y-3">
        {BADGES.map((badge, i) => {
          const unlocked = totalDrills >= badge.required;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl border ${
                unlocked ? `${badge.bg} ${badge.border}` : 'bg-surface-1 border-border opacity-50'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                unlocked ? badge.bg : 'bg-surface-3'
              }`}>
                {unlocked ? badge.emoji : <Lock size={20} className="text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-grotesk font-bold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
              </div>
              {unlocked && <CheckCircle2 size={18} className={badge.color} />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}