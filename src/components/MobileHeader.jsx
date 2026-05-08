import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function MobileHeader({ title, onBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      className="relative flex items-end justify-center bg-background border-b border-border"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        minHeight: 'calc(56px + env(safe-area-inset-top, 0px))',
      }}
    >
      {/* Back button — very large tap target covering entire left side */}
      <button
        onClick={handleBack}
        className="absolute top-0 left-0 bottom-0 flex items-end gap-1 pb-3 text-primary no-select active:opacity-60 transition-opacity"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingLeft: '12px',
          minWidth: '140px',
        }}
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
        <span className="text-base font-semibold">Back</span>
      </button>

      {title && (
        <h1 className="text-base font-grotesk font-semibold text-foreground truncate max-w-[60%] pb-3 leading-none">
          {title}
        </h1>
      )}
      {!title && <div className="pb-3" />}
    </div>
  );
}