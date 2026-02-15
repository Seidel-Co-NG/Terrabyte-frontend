import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Delete } from 'lucide-react';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import { userApi } from '../../../core/api/user.api';
import { PinDots, PIN_LENGTH } from './Components/PinKeypad';

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['complete', '0', 'back'],
];

const emptyPin = () => Array(PIN_LENGTH).fill('');

const stepLabels: Record<string, { title: string; subtitle: string }> = {
  current: { title: 'Enter current PIN', subtitle: 'Enter your current 5-digit PIN' },
  new: { title: 'Enter new PIN', subtitle: 'Create a new 5-digit PIN' },
  confirm: { title: 'Confirm new PIN', subtitle: 'Re-enter your new 5-digit PIN' },
};

const ChangePin = () => {
  const navigate = useNavigate();
  const [currentPin, setCurrentPin] = useState(emptyPin());
  const [newPin, setNewPin] = useState(emptyPin());
  const [confirmPin, setConfirmPin] = useState(emptyPin());
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getActivePin = () => {
    if (step === 'current') return currentPin;
    if (step === 'new') return newPin;
    return confirmPin;
  };

  const handleKeyTap = (key: string) => {
    if (key === 'back') {
      handleBackspace();
      return;
    }
    if (key === 'complete') return;
    setError(null);
    const pin = getActivePin();
    const idx = pin.findIndex((d) => d === '');
    if (idx === -1) return;
    const next = [...pin];
    next[idx] = key;
    if (step === 'current') {
      setCurrentPin(next);
      if (next.every((d) => d !== '')) setStep('new');
    } else if (step === 'new') {
      setNewPin(next);
      if (next.every((d) => d !== '')) setStep('confirm');
    } else {
      setConfirmPin(next);
      if (next.every((d) => d !== '')) {
        if (next.join('') !== newPin.join('')) {
          setError('New PINs do not match');
          setConfirmPin(emptyPin());
          setStep('confirm');
        }
      }
    }
  };

  const handleBackspace = () => {
    setError(null);
    const pin = getActivePin();
    const idx = pin.findIndex((d) => d === '') - 1;
    if (idx < 0) return;
    const next = [...pin];
    next[idx] = '';
    if (step === 'current') setCurrentPin(next);
    else if (step === 'new') setNewPin(next);
    else setConfirmPin(next);
  };

  const submitChange = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await userApi.changeTransactionPin({
        current_transaction_pin: currentPin.join(''),
        new_transaction_pin: newPin.join(''),
        new_transaction_pin_confirmation: confirmPin.join(''),
      });
      const ok = res?.status === 'successful' || res?.status === 'success';
      if (ok) {
        toast.success(res?.message ?? 'PIN changed successfully');
        navigate('/dashboard/profile');
      } else {
        setError(res?.message ?? 'Failed to change PIN');
        setCurrentPin(emptyPin());
        setNewPin(emptyPin());
        setConfirmPin(emptyPin());
        setStep('current');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change PIN');
      setCurrentPin(emptyPin());
      setNewPin(emptyPin());
      setConfirmPin(emptyPin());
      setStep('current');
    } finally {
      setIsSubmitting(false);
    }
  };

  const labels = stepLabels[step];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="flex-1 flex flex-col items-center pt-8 sm:pt-10 pb-6 px-5 max-w-md mx-auto w-full relative">
        <div className="absolute left-4 top-8">
          <BackButton fallbackTo="/dashboard/profile" />
        </div>

        <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center">
          <Lock className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] text-center mt-4 px-4">
          Change PIN
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center mt-2">
          {labels.subtitle}
        </p>

        <div className="flex justify-center gap-3 sm:gap-4 mt-6">
          <PinDots pin={getActivePin()} />
        </div>

        {error && (
          <p className="text-sm text-[var(--error)] text-center mt-3 px-4">{error}</p>
        )}
        {isSubmitting && (
          <p className="text-sm text-[var(--text-secondary)] text-center mt-2">
            Verifying...
          </p>
        )}

        {step === 'confirm' && (
          <a
            href="/dashboard/profile/change-pin"
            onClick={(e) => {
              e.preventDefault();
              setStep('current');
              setCurrentPin(emptyPin());
              setNewPin(emptyPin());
              setConfirmPin(emptyPin());
              setError(null);
            }}
            className="text-sm font-medium text-brand-primary hover:text-brand-primary-dark mt-3"
          >
            Start over
          </a>
        )}

        <div className="mt-6">
          <a
            href="/dashboard/profile/reset-pin"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard/profile/reset-pin');
            }}
            className="text-xs text-[var(--text-muted)]"
          >
            Forgot PIN? Reset your PIN
          </a>
        </div>

        <div className="flex-1 min-h-[120px]" />

        <div className="w-full max-w-[280px] mx-auto">
          {KEYPAD_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-2 sm:gap-4 mb-2">
              {row.map((key) =>
                key === 'back' ? (
                  <button
                    key="back"
                    type="button"
                    onClick={handleBackspace}
                    disabled={isSubmitting}
                    className="flex-1 max-w-[72px] h-12 sm:h-14 rounded-2xl flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:scale-95 transition-all disabled:opacity-50"
                    aria-label="Backspace"
                  >
                    <Delete size={26} strokeWidth={2} />
                  </button>
                ) : key === 'complete' ? (
                  step === 'confirm' && confirmPin.every((d) => d !== '') && confirmPin.join('') === newPin.join('') ? (
                    <button
                      key="complete"
                      type="button"
                      onClick={submitChange}
                      disabled={isSubmitting}
                      className="flex-1 max-w-[72px] h-12 sm:h-14 rounded-2xl flex items-center justify-center text-white bg-brand-primary hover:bg-brand-primary-dark active:scale-95 transition-all disabled:opacity-50"
                    >
                      ✓
                    </button>
                  ) : (
                    <div key="complete" className="flex-1 max-w-[72px] h-12 sm:h-14" />
                  )
                ) : key === '' ? (
                  <div key="empty" className="flex-1 max-w-[72px] h-12 sm:h-14" />
                ) : (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeyTap(key)}
                    disabled={isSubmitting}
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

export default ChangePin;
