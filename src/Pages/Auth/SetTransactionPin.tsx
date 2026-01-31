import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Delete } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';

const PIN_LENGTH = 5;
const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'back'],
];

type Step = 'create' | 'confirm';

const SetTransactionPin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setTransactionPin, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState<Step>('create');
  const [createPin, setCreatePin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [clearError, step]);

  const pin = step === 'create' ? createPin : confirmPin;
  const setPin = step === 'create' ? setCreatePin : setConfirmPin;

  const handleKeyTap = (key: string) => {
    if (key === 'back') {
      handleBackspace();
      return;
    }
    if (key === '' || pin.every((d) => d !== '')) return;
    setLocalError(null);
    const idx = pin.findIndex((d) => d === '');
    const next = [...pin];
    next[idx] = key;
    setPin(next);
    if (next.every((d) => d !== '')) {
      const fullPin = next.join('');
      if (step === 'create') {
        setStep('confirm');
        setConfirmPin(Array(PIN_LENGTH).fill(''));
      } else {
        const created = createPin.join('');
        if (fullPin === created) {
          submitPin(fullPin);
        } else {
          setLocalError("PINs don't match. Please try again.");
          setConfirmPin(Array(PIN_LENGTH).fill(''));
        }
      }
    }
  };

  const handleBackspace = () => {
    setLocalError(null);
    const idx = pin.findIndex((d) => d === '') - 1;
    if (idx < 0) return;
    const next = [...pin];
    next[idx] = '';
    setPin(next);
  };

  const submitPin = async (pinValue: string) => {
    const success = await setTransactionPin(pinValue, pinValue);
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleBackToCreate = () => {
    setStep('create');
    setCreatePin(Array(PIN_LENGTH).fill(''));
    setConfirmPin(Array(PIN_LENGTH).fill(''));
    setLocalError(null);
    clearError();
  };

  if (!isAuthenticated) {
    return null;
  }

  const displayError = localError ?? error;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="flex-1 flex flex-col items-center pt-8 sm:pt-10 pb-6 px-5 max-w-md mx-auto w-full">
        <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center">
          <Lock className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] text-center mt-4 px-4">
          Set transaction PIN
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center mt-2">
          {step === 'create'
            ? 'Create a 5-digit PIN to secure your transactions'
            : 'Confirm your 5-digit PIN'}
        </p>

        {/* PIN dots */}
        <div className="flex justify-center gap-3 sm:gap-4 mt-6">
          {pin.map((digit, i) => (
            <div
              key={i}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] border-2 border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-input)]"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  digit ? 'bg-[var(--text-primary)]' : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>

        {displayError && (
          <p className="text-sm text-[var(--error)] text-center mt-3 px-4">
            {displayError}
          </p>
        )}

        {isLoading && (
          <p className="text-sm text-[var(--text-secondary)] text-center mt-2">
            Setting PIN...
          </p>
        )}

        {step === 'confirm' && (
          <button
            type="button"
            onClick={handleBackToCreate}
            disabled={isLoading}
            className="text-sm font-medium text-brand-primary hover:text-brand-primary-dark mt-3 disabled:opacity-50"
          >
            Back to create PIN
          </button>
        )}

        <div className="flex-1 min-h-[120px]" />

        {/* Keypad */}
        <div className="w-full max-w-[280px] mx-auto">
          {KEYPAD_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex justify-center gap-2 sm:gap-4 mb-2"
            >
              {row.map((key) =>
                key === 'back' ? (
                  <button
                    key="back"
                    type="button"
                    onClick={() => handleBackspace()}
                    className="flex-1 max-w-[72px] h-12 sm:h-14 rounded-2xl flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:scale-95 transition-all"
                    aria-label="Backspace"
                  >
                    <Delete size={26} strokeWidth={2} />
                  </button>
                ) : key === '' ? (
                  <div key="empty" className="flex-1 max-w-[72px] h-12 sm:h-14" />
                ) : (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeyTap(key)}
                    disabled={isLoading}
                    className="flex-1 max-w-[72px] h-12 sm:h-14 rounded-2xl text-2xl font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {key}
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetTransactionPin;
