import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Clock, Target, TrendingUp } from 'lucide-react';

const FEATURES = [
  {
    icon: <Zap size={18} style={{ color: '#9B6FE8' }} />,
    title: 'Speed arithmetic under pressure',
    desc: 'Train at the pace of a real case interview or GMAT question set — not at your leisure.',
  },
  {
    icon: <Target size={18} style={{ color: '#00E5C4' }} />,
    title: 'Accuracy across every question type',
    desc: 'Percentages, growth rates, market sizing, breakevens — the exact math that separates top candidates.',
  },
  {
    icon: <TrendingUp size={18} style={{ color: '#FF9933' }} />,
    title: 'Progressive difficulty',
    desc: 'Start at your level and advance through Easy, Medium, and Hard — matching real interview complexity.',
  },
  {
    icon: <Clock size={18} style={{ color: '#9B6FE8' }} />,
    title: 'Short, focused daily drills',
    desc: '2, 5, or 10-minute sessions that fit your prep schedule and build a daily training habit.',
  },
];

const AUDIENCES = ['MBB', 'IB', 'GMAT', 'GRE'];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ background: '#12082A' }}
    >
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 pt-safe" style={{ paddingTop: 'max(20px, env(safe-area-inset-top, 20px))', paddingBottom: 16 }}>
        <span className="text-xl font-grotesk font-black" style={{ color: '#fff' }}>
          Quant<span style={{ color: '#9B6FE8' }}>Drill</span>
        </span>
        <button
          onClick={() => navigate('/home')}
          className="text-sm font-semibold px-4 py-2 rounded-xl no-select"
          style={{ color: '#9B6FE8', border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.08)' }}
        >
          Log in
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-6 pt-10 pb-12">
        {/* Audience pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-8 flex-wrap justify-center"
        >
          {AUDIENCES.map(a => (
            <span
              key={a}
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'rgba(124,58,237,0.15)', color: '#9B6FE8', border: '1px solid rgba(124,58,237,0.3)' }}
            >
              {a}
            </span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl font-grotesk font-black leading-tight mb-5"
          style={{ color: '#fff', maxWidth: 340 }}
        >
          The mental math edge for{' '}
          <span style={{ color: '#9B6FE8' }}>MBB, IB, GMAT & GRE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm leading-relaxed mb-8"
          style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 300 }}
        >
          A daily mental math training tool built for high-stakes recruiting and exams. 
          Train the skills that elite candidates develop — and most ignore.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate('/home')}
          className="font-grotesk font-bold text-base text-white py-4 px-10 rounded-2xl no-select active:scale-95 transition-transform flex items-center gap-2"
          style={{ background: '#7C3AED', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}
        >
          <Zap size={20} />
          Start Training Now
        </motion.button>

        <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>No credit card required</p>
      </section>

      {/* ── Divider ── */}
      <div className="mx-6 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* ── Features ── */}
      <section className="px-6 py-10 flex flex-col gap-5">
        <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          What you train
        </p>
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="flex gap-4 items-start"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: '#fff' }}>{f.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── Claim strip ── */}
      <section className="mx-6 mb-8 rounded-2xl px-5 py-5" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <p className="text-sm font-semibold leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
          "The mental math skills that separate top candidates are trainable — and QuantDrill is built to develop exactly those skills."
        </p>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 pb-safe flex flex-col items-center gap-4" style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))' }}>
        <button
          onClick={() => navigate('/home')}
          className="w-full font-grotesk font-bold text-base text-white py-4 rounded-2xl no-select active:scale-95 transition-transform"
          style={{ background: '#7C3AED', boxShadow: '0 0 20px rgba(124,58,237,0.35)' }}
        >
          Start For Free Now
        </button>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Cancel anytime · No commitment
        </p>
      </section>
    </div>
  );
}