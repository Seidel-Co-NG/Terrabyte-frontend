import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import BackButton from '../../Components/BackButton';
import { apiConfig } from '../../../core/config/api.config';

const PLAY_STORE_IMAGE = '/img/playstore.png';
const APP_STORE_IMAGE = '/img/appstore.png';

const dashboardPageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';
const publicPageClass =
  'p-6 md:p-5 lg:p-8 min-h-screen bg-[var(--bg-primary)] pt-16';

function getDevice(): 'android' | 'ios' | 'other' {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'android';
  if (/iPad|iPhone|iPod/i.test(ua)) return 'ios';
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return 'ios'; // iPad iOS 13+
  return 'other';
}

const DownloadApp = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const pageClass = isDashboard ? dashboardPageClass : publicPageClass;
  const fallbackTo = isDashboard ? '/dashboard/profile' : '/';

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const device = getDevice();
    if (device === 'android' && apiConfig.androidAppUrl) {
      window.location.href = apiConfig.androidAppUrl;
      return;
    }
    if (device === 'ios' && apiConfig.iosAppUrl) {
      window.location.href = apiConfig.iosAppUrl;
      return;
    }
    setShowOptions(true);
  }, []);

  const options = [
    {
      id: 'android',
      title: 'Google Play',
      subtitle: 'Get it on Android',
      image: PLAY_STORE_IMAGE,
      url: apiConfig.androidAppUrl,
      disabled: !apiConfig.androidAppUrl,
    },
    {
      id: 'ios',
      title: 'App Store',
      subtitle: 'Download for iPhone & iPad',
      image: APP_STORE_IMAGE,
      url: apiConfig.iosAppUrl,
      disabled: !apiConfig.iosAppUrl,
    },
  ].filter((o) => o.url);

  return (
    <div className={pageClass}>
      <div className="max-w-md mx-auto">
        <BackButton fallbackTo={fallbackTo} />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-2">
          Download Terrabyte
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Get the app for the best experience on your device.
        </p>

        {!showOptions ? (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
            <Smartphone className="w-12 h-12 mb-3 animate-pulse" strokeWidth={1.5} />
            <p className="text-sm">Opening store...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {options.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                Store links are not configured. Please set VITE_ANDROID_APP_URL and
                VITE_IOS_APP_URL in your .env file.
              </p>
            ) : (
              options.map((opt) => (
                <a
                  key={opt.id}
                  href={opt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 w-full px-4 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors no-underline text-left"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] shrink-0">
                    <img
                      src={opt.image}
                      alt={opt.title}
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{opt.title}</p>
                    {opt.subtitle && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{opt.subtitle}</p>
                    )}
                  </div>
                  <span className="text-[var(--text-muted)] shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </span>
                </a>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadApp;
