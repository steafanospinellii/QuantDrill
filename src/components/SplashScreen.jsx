import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_KEY = 'qd_splash_shown';

export default function SplashScreen({ onDone }) {
  const alreadyShown = sessionStorage.getItem(SESSION_KEY);
  const [visible, setVisible] = useState(!alreadyShown);

  useEffect(() => {
    if (alreadyShown) {
      onDone();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, '1');
    // hold = fade-in(0.4s) + hold(1.2s) = 1600ms before starting fade-out
    const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ backgroundColor: '#12082A' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          <img
            src="https://media.base44.com/images/public/69fcb12caee6ab9a4c226c8f/aa9e7382c_Untitleddesign1.png"
            alt="QuantDrill"
            width={160}
            style={{ height: 'auto', display: 'block', backgroundColor: 'transparent' }}
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}