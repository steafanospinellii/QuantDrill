import { motion } from 'framer-motion';
import { Zap, TrendingUp, DivideSquare, BarChart2, Globe } from 'lucide-react';

const typeConfig = {
  percentage_change: { label: 'Percentage Change', icon: TrendingUp, color: 'text-neon-purple' },
  multiplication: { label: 'Multiplication', icon: Zap, color: 'text-neon-cyan' },
  division: { label: 'Division', icon: DivideSquare, color: 'text-neon-orange' },
  growth_rate: { label: 'Growth Rate', icon: TrendingUp, color: 'text-neon-purple' },
  business_math: { label: 'Business Math', icon: BarChart2, color: 'text-neon-cyan' },
  market_sizing: { label: 'Market Sizing', icon: Globe, color: 'text-neon-orange' },
};

export default function QuestionCard({ question, questionNumber, total }) {
  const cfg = typeConfig[question.type] || typeConfig.multiplication;
  const Icon = cfg.icon;

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} className={cfg.color} />
        <span className={`text-xs font-medium tracking-widest uppercase ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      <p className="text-xl sm:text-2xl font-grotesk font-semibold text-foreground leading-snug">
        {question.prompt}
      </p>
    </motion.div>
  );
}