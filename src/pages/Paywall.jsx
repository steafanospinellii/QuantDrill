import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, BarChart2, Award } from 'lucide-react';
import { Infinity as InfinityIcon } from 'lucide-react';
import MobileHeader from '@/components/MobileHeader';

const PLANS = [
  { key: 'monthly',  label: 'Monthly',  price: '$9.99',  period: '/mo',   badge: null },
  { key: 'yearly',   label: 'Yearly',   price: '$59.99', period: '/yr',   badge: 'Best Value' },
  { key: 'lifetime', label: 'Lifetime', price: '$149',   period: 'once',  badge: null },
];

const PREMIUM_FEATURES = [
  { icon: <Zap size={16} className="text-neon-cyan" />,        text: 'Unlimited daily drills' },
  { icon: <Zap size={16} className="text-neon-purple" />,      text: 'All 5 categories + Hard mode' },
  { icon: <BarChart2 size={16} className="text-neon-orange" />, text: 'Advanced performance analytics' },
  { icon: <Award size={16} className="text-yellow-400" />,     text: 'Full achievement system' },
];

export default function Paywall({ onClose }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('yearly');

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileHeader title="" onBack={handleClose} />

      <div className="flex-1 flex flex-col px-5 pt-2 pb-8 overflow-y-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4">🏋️</div>
          <h1 className="text-2xl font-grotesk font-black text-foreground leading-tight mb-2">
            Unlock Elite<br />
            <span className="text-neon-purple">Quant Training</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Train without limits. Built for GMAT, consulting, and finance candidates who take performance seriously.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-2 border border-border rounded-2xl px-4 py-4 mb-6 space-y-3"
        >
          {PREMIUM_FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-surface-3 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <span className="text-sm font-medium text-foreground">{f.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Plan selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="space-y-2.5 mb-6"
        >
          {PLANS.map(plan => (
            <button
              key={plan.key}
              onClick={() => setSelected(plan.key)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border transition-all no-select ${
                selected === plan.key
                  ? 'bg-primary/10 border-primary'
                  : 'bg-surface-2 border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === plan.key ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {selected === plan.key && <Check size={11} className="text-white" />}
                </div>
                <span className="text-sm font-semibold text-foreground">{plan.label}</span>
                {plan.badge && (
                  <span className="text-[10px] font-bold text-neon-orange bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-base font-grotesk font-bold text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="mt-auto"
        >
          <button className="w-full bg-primary text-primary-foreground font-grotesk font-bold text-base py-4 rounded-2xl glow-purple active:scale-95 transition-all no-select mb-3">
            Train Without Limits →
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Cancel anytime · No ads · Secure payment
          </p>
        </motion.div>
      </div>
    </div>
  );
}