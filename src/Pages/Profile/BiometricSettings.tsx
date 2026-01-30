import { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const BiometricSettings = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // Web: biometric APIs are limited; show as optional / coming soon for web
  const isBiometricAvailable = false;

  const handleToggle = () => {
    if (!isBiometricAvailable) return;
    setIsUpdating(true);
    setBiometricEnabled((prev) => !prev);
    setTimeout(() => setIsUpdating(false), 400);
  };

  return (
    <div className={pageClass}>
      <div className="max-w-2xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">
          Biometric Authentication
        </h1>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden mb-6">
          <DetailRow
            label="Biometric Login"
            children={
              <button
                type="button"
                role="switch"
                aria-checked={biometricEnabled}
                disabled={isUpdating || !isBiometricAvailable}
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 ${
                  biometricEnabled ? 'bg-brand-primary' : 'bg-[var(--bg-tertiary)]'
                } ${!isBiometricAvailable ? 'cursor-not-allowed' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                    biometricEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            }
          />
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-primary-lightest text-brand-primary shrink-0">
              <Fingerprint size={20} strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                About Biometric Authentication
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Biometric authentication allows you to use fingerprint or face recognition instead of
                your transaction PIN for app login and transaction authorization. This feature is
                available on the Terrabyte mobile app.
              </p>
              {!isBiometricAvailable && (
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Not available in web. Use the mobile app to enable biometrics.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricSettings;
