import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Lock } from 'lucide-react';

// Simulated leaderboard data (would be real in full backend version)
const MOCK_LEADERS = [
  { rank: 1, name: 'K.Nakamura', score: 97, streak: 18, badge: '👑' },
  { rank: 2, name: 'A.Chen', score: 94, streak: 12, badge: '🥈' },
  { rank: 3, name: 'M.Patel', score: 91, streak: 9, badge: '🥉' },
  { rank: 4, name: 'J.Williams', score: 88, streak: 7, badge: '' },
  { rank: 5, name: 'S.Johnson', score: 85, streak: 11, badge: '' },
  { rank: 6, name: 'L.Kim', score: 83, streak: 5, badge: '' },
  { rank: 7, name: 'R.Torres', score: 80, streak: 3, badge: '' },
  { rank: 8, name: 'E.Fischer', score: 77, streak: 6, badge: '' },
  { rank: 9, name: 'T.Okafor', score: 74, streak: 2, badge: '' },
  { rank: 10, name: 'D.Rossi', score: 71, streak: 4, badge: '' },
];

export default function Leaderboard() {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('weekly');

  useEffect(() => {
    async function load() {
      try {
        const [u, s] = await Promise.all([
          base44.auth.me(),
          base44.entities.Session.list('-score', 5),
        ]);
        setUser(u);
        setSessions(s);
      } catch (e) {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  const myBestScore = sessions.length ? Math.max(...sessions.map(s => s.score)) : null;
  const myRank = myBestScore
    ? MOCK_LEADERS.findIndex(l => myBestScore >= l.score) + 1 || MOCK_LEADERS.length + 1
    : null;

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
        <h2 className="text-2xl font-grotesk font-bold text-foreground mb-1">Leaderboard</h2>
        <p className="text-sm text-muted-foreground mb-6">Weekly rankings reset every Monday</p>
      </motion.div>

      {/* Tab */}
      <div className="flex bg-surface-2 rounded-xl p-1 mb-6 gap-1">
        {['weekly', 'alltime'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {t === 'weekly' ? 'This Week' : 'All Time'}
          </button>
        ))}
      </div>

      {/* My rank */}
      {myBestScore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3 mb-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">#{myRank || '—'}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">You</p>
              <p className="text-xs text-muted-foreground">Best score: {myBestScore}/100</p>
            </div>
          </div>
          <Trophy size={20} className="text-primary" />
        </motion.div>
      )}

      {/* Leaderboard list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-2">
        {MOCK_LEADERS.map((leader, i) => (
          <LeaderRow key={leader.rank} leader={leader} isTop3={i < 3} index={i} />
        ))}
      </motion.div>

      {/* Premium lock */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-surface-2 border border-border rounded-2xl p-4 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-neon-orange/10 flex items-center justify-center">
          <Lock size={18} className="text-neon-orange" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Elite Access</p>
          <p className="text-xs text-muted-foreground">Unlock full leaderboard + detailed ranks</p>
        </div>
        <button
          onClick={() => window.location.href = '/paywall'}
          className="bg-neon-orange/10 text-neon-orange border border-neon-orange/30 text-xs font-semibold px-3 py-1.5 rounded-lg"
        >
          Unlock
        </button>
      </motion.div>
    </div>
  );
}

function LeaderRow({ leader, isTop3, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
        isTop3 ? 'bg-surface-2 border-primary/20' : 'bg-surface-1 border-border'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
        leader.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
        leader.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
        leader.rank === 3 ? 'bg-orange-600/20 text-orange-400' :
        'bg-surface-3 text-muted-foreground'
      }`}>
        {leader.badge || leader.rank}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{leader.name}</p>
        <p className="text-xs text-muted-foreground">🔥 {leader.streak} day streak</p>
      </div>
      <span className={`text-lg font-grotesk font-black tabular-nums ${
        leader.rank === 1 ? 'text-yellow-400' : leader.rank <= 3 ? 'text-neon-purple' : 'text-foreground'
      }`}>
        {leader.score}
      </span>
    </motion.div>
  );
}