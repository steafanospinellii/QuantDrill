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
    <div className="flex items-center px-4 bg-background border-b border-border relative" style={{ minHeight: '56px', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <button
        onClick={handleBack}
        className="absolute left-3 bottom-0 top-0 flex items-center gap-1 text-primary no-select py-3"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <ChevronLeft size={22} />
        <span className="text-sm font-medium">Back</span>
      </button>
      {title && (
        <h1 className="flex-1 text-center text-base font-grotesk font-semibold text-foreground truncate px-20"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          {title}
        </h1>
      )}
    </div>
  );
}