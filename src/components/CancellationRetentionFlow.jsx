import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function CancellationRetentionFlow({ open, onClose, user, streakCount, badgesCount }) {
  const [step, setStep] = useState(1);

  const handleContinueCancel = () => {
    setStep(2);
  };

  const handleKeepAccess = () => {
    setStep(1);
    onClose();
  };

  const handleConfirmCancel = async () => {
    if (!user?.stripe_customer_id) {
      alert('To manage your lifetime access contact support@quantdrill.com');
      onClose();
      return;
    }

    try {
      const res = await base44.functions.invoke('getStripePortalUrl', {});
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
        onClose();
      }
    } catch (e) {
      console.error('Failed to open portal:', e);
      alert('Could not open Stripe portal. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[9999]" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] mx-5"
          >
            {step === 1 ? (
              <div className="bg-surface-1 border border-border rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-grotesk font-bold text-foreground">Before you go...</h2>
                  <button onClick={onClose} className="w-8 h-8 bg-surface-2 rounded-xl flex items-center justify-center no-select">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Here's what you'll lose when you cancel:
                </p>

                <div className="space-y-2 mb-8">
                  {[
                    'Unlimited daily drills',
                    'Market Sizing and GMAT/GRE Quant categories',
                    'Hard mode access',
                    'Premium analytics and insights',
                    'All premium badges',
                    'Your current streak at risk',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-3 py-2">
                      <div className="w-5 h-5 flex items-center justify-center text-red-400">✕</div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleKeepAccess}
                  className="w-full bg-primary text-primary-foreground font-grotesk font-bold text-lg py-4 rounded-2xl glow-purple flex items-center justify-center gap-2 no-select active:scale-95 transition-transform mb-3"
                >
                  Keep my Pro access
                  <ChevronRight size={20} />
                </button>

                <button
                  onClick={handleContinueCancel}
                  className="w-full text-sm text-muted-foreground py-2 no-select hover:text-foreground transition-colors"
                >
                  Continue to cancel
                </button>
              </div>
            ) : (
              <div className="bg-surface-1 border border-border rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-grotesk font-bold text-foreground">Are you absolutely sure?</h2>
                  <button onClick={onClose} className="w-8 h-8 bg-surface-2 rounded-xl flex items-center justify-center no-select">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        You've built a {streakCount || 0} day streak and earned {badgesCount || 0} badges.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        These stay on your account but you'll lose access to premium features.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleKeepAccess}
                  className="w-full bg-primary text-primary-foreground font-grotesk font-bold text-lg py-4 rounded-2xl glow-purple flex items-center justify-center gap-2 no-select active:scale-95 transition-transform mb-3"
                >
                  Keep my account
                  <ChevronRight size={20} />
                </button>

                <button
                  onClick={handleConfirmCancel}
                  className="w-full text-center text-xs text-muted-foreground py-2 no-select hover:text-red-400 transition-colors"
                >
                  Yes, cancel my subscription
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}