import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Trophy, BarChart2, Lock, CheckCircle2, X } from 'lucide-react';

const FEATURES = [
  { icon: Zap, label: 'Unlimited daily sprints', free: false },
  { icon: Lock, label: 'Hard difficulty mode', free: false },
  { icon: BarChart2, label: 'Advanced analytics', free: false },
  { icon: Trophy, label: 'Full leaderboard access', free: false },
  { icon: CheckCircle2, label: '1 daily sprint (Free)', free: true },
  { icon: CheckCircle2, label: 'Basic stats (Free)', free: true },
];

const plans = {
  monthly: { price: '$9.99', period: '/month', label: 'Monthly' },
  yearly: { price: '$59.99', period: '/year', label: 'Yearly', badge: 'Save 50%' },
  lifetime: { price: '$149', period: 'one-time', label: 'Lifetime' },
};

export default function Paywall() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState('monthly');

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6 flex flex-col">
      {/* Close */}
      <div className="flex justify-end mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-surface-2 rounded-xl flex items-center justify-center border border-border">
          <X size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center mb-4 glow-purple">
          <Zap size={28} className="text-primary" />
        </div>
        <h1 className="text-2xl font-grotesk font-black text-foreground mb-2">Unlock Elite</h1>
        <h2 className="text-2xl font-grotesk font-black text-primary mb-3">Brain Training</h2>
        <p className="text-sm text-muted-foreground">Train without limits. Dominate the leaderboard.</p>
      </motion.div>

      {/* Features */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-surface-1 border border-border rounded-3xl p-5 mb-6">
        <div className="space-y-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${!f.free ? 'bg-primary/10' : 'bg-surface-3'}`}>
                  <Icon size={16} className={!f.free ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <span className={`text-sm font-medium ${!f.free ? 'text-foreground' : 'text-muted-foreground'}`}>{f.label}</span>
                {!f.free && <CheckCircle2 size={14} className="text-neon-cyan ml-auto" />}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Plan selector */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-6">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(plans).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setPlan(key)}
              className={`relative rounded-2xl py-4 px-2 text-center border transition-all ${
                plan === key ? 'bg-primary/10 border-primary' : 'bg-surface-2 border-border'
              }`}
            >
              {val.badge && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-neon-orange text-background text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  {val.badge}
                </span>
              )}
              <p className="text-base font-grotesk font-bold text-foreground">{val.price}</p>
              <p className="text-[10px] text-muted-foreground">{val.period}</p>
              <p className="text-[10px] font-semibold mt-1 text-muted-foreground">{val.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-auto">
        <button className="w-full bg-primary text-primary-foreground font-grotesk font-bold text-lg py-5 rounded-2xl glow-purple transition-all active:scale-95 mb-3">
          Get Elite Access — {plans[plan].price}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Cancel anytime · Secure payment · Instant access
        </p>
      </motion.div>
    </div>
  );
}