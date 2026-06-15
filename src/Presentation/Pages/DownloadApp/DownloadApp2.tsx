import { useMemo } from 'react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { apiConfig } from '../../../core/config/api.config';

const DownloadApp2 = () => {
  const qrSrc = useMemo(() => {
    const pageUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/app-download`
        : 'https://terrabyte.com.ng/app-download';
    const encoded = encodeURIComponent(pageUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}&margin=8`;
  }, []);

  const storeButtons = [
    {
      id: 'ios',
      label: 'App Store',
      icon: FaApple,
      url: apiConfig.iosAppUrl,
      className: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    },
    {
      id: 'android',
      label: 'Google Play',
      icon: FaGooglePlay,
      url: apiConfig.androidAppUrl,
      className: 'bg-gradient-to-r from-emerald-500 via-lime-400 to-yellow-400 hover:from-emerald-600 hover:via-lime-500 hover:to-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl px-8 py-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary shadow-lg">
          <img src="/img/logo2.png" alt="Terrabyte" className="h-12 w-12 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Download Our App</h1>
        <p className="text-sm text-gray-500 mb-8">
          Get the best experience on your mobile device
        </p>

        <div className="mx-auto mb-3 inline-block rounded-2xl bg-white p-4 shadow-lg">
          <img
            src={qrSrc}
            alt="Scan to download Terrabyte app"
            className="h-[200px] w-[200px] object-contain"
          />
        </div>
        <p className="text-xs text-gray-400 mb-8">Scan with your phone camera</p>

        <div className="space-y-3">
          {storeButtons.map(({ id, label, icon: Icon, url, className }) =>
            url ? (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-semibold text-white transition-all duration-200 no-underline ${className}`}
              >
                <Icon className="h-6 w-6 shrink-0" aria-hidden />
                {label}
              </a>
            ) : (
              <button
                key={id}
                type="button"
                disabled
                className={`flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-semibold text-white opacity-50 ${className}`}
              >
                <Icon className="h-6 w-6 shrink-0" aria-hidden />
                {label}
              </button>
            ),
          )}
        </div>

        {!apiConfig.androidAppUrl && !apiConfig.iosAppUrl && (
          <p className="mt-6 text-xs text-gray-400">
            Store links are not configured yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DownloadApp2;
