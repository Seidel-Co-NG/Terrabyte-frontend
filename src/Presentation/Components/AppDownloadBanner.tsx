import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const STORAGE_KEY = 'terrabyte_app_banner_dismissed';
const DISMISS_DAYS = 7;

function wasDismissed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function setDismissed(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {}
}

interface AppDownloadBannerProps {
  /** When true, always show (e.g. on landing page) and ignore dismiss state */
  forceShow?: boolean;
}

const AppDownloadBanner = ({ forceShow = false }: AppDownloadBannerProps) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!forceShow && wasDismissed()) {
      setVisible(false);
      return;
    }
    const path = location.pathname;
    if (path === '/download-app' || path === '/dashboard/download-app') {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [location.pathname, forceShow]);

  const handleDismiss = () => {
    setDismissed();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed top-4 right-4 left-4 sm:left-auto sm:max-w-[450px] z-[9999] flex items-center gap-3 sm:gap-4 p-4 rounded-2xl shadow-lg border border-[var(--border-color)] bg-[var(--bg-card)]"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-white overflow-hidden">
        <img src="/img/logo2.png" alt="Terrabyte" className="h-7 w-7 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-white">Install Terrabyte App</h3>
        <p className="text-xs sm:text-sm text-white/80 mt-0.5">Power your connection with Terrabyte.</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/download-app"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors no-underline"
        >
          Install
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default AppDownloadBanner;
