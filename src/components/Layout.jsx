import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Award } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/progress', icon: BarChart2, label: 'Progress' },
  { path: '/badges', icon: Award, label: 'Badges' },
];

export default function Layout() {
  const location = useLocation();
  const isDrill = location.pathname === '/drill';

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <main className={`flex-1 ${isDrill ? '' : 'pb-20'}`} style={{ paddingBottom: isDrill ? undefined : 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      {!isDrill && (
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-surface-1 border-t border-border z-50 no-select"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center justify-around px-2 py-3">
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-all duration-200 no-select ${
                    active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-primary' : ''}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}