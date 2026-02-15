import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Delete, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import { PinDots, PIN_LENGTH } from './Components/PinKeypad';
import { userApi } from '../../../core/api/user.api';

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'back'],
];

const emptyPin = () => Array(PIN_LENGTH).fill('');

const ResetPin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'password' | 'new' | 'confirm'>('password');
  const [newPin, setNewPin] = useState(emptyPin());
  const [confirmPin, setConfirmPin] = useState(emptyPin());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getActivePin = () => (step === 'new' ? newPin : confirmPin);

  const handleKeyTap = (key: string) => {
    if (key === 'back') {
      handleBackspace();
      return;
    }
    setError(null);
    if (step === 'new') {
      const idx = newPin.findIndex((d) => d === '');
      if (idx === -1) return;
      const next = [...newPin];
      next[idx] = key;
      setNewPin(next);
      if (next.every((d) => d !== '')) setStep('confirm');
    } else {
      const idx = confirmPin.findIndex((d) => d === '');
      if (idx === -1) return;
      const next = [...confirmPin];
      next[idx] = key;
      setConfirmPin(next);
      if (next.every((d) => d !== '')) {
        if (next.join('') === newPin.join('')) {
          submitReset();
        } else {
          setError('PINs do not match');
          setConfirmPin(emptyPin());
          setStep('confirm');
        }
      }
    }
  };

  const handleBackspace = () => {
    setError(null);
    if (step === 'new') {
      const idx = newPin.findIndex((d) => d === '') - 1;
      if (idx >= 0) {
        const next = [...newPin];
        next[idx] = '';
        setNewPin(next);
      }
    } else {
      const idx = confirmPin.findIndex((d) => d === '') - 1;
      if (idx >= 0) {
        const next = [...confirmPin];
        next[idx] = '';
        setConfirmPin(next);
      }
    }
  };

  const submitReset = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await userApi.resetTransactionPin({
        current_password: password,
        new_transaction_pin: newPin.join(''),
        new_transaction_pin_confirmation: confirmPin.join(''),
      });
      const ok = res?.status === 'successful' || res?.status === 'success';
      if (ok) {
        toast.success(res?.message ?? 'PIN reset successfully');
        navigate('/dashboard/profile');
      } else {
        setError(res?.message ?? 'Failed to reset PIN');
        setConfirmPin(emptyPin());
        setStep('confirm');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset PIN');
      setConfirmPin(emptyPin());
      setStep('confirm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    setStep('new');
  };

  if (step === 'password') {
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
            Reset PIN
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center mt-2">
            Enter your account password to reset your transaction PIN
          </p>

          <form onSubmit={handlePasswordSubmit} className="w-full mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-[var(--error)]">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark active:scale-[0.98] transition-all"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  const subtitle =
    step === 'new'
      ? 'Create a new 5-digit PIN'
      : 'Re-enter your new 5-digit PIN';

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
          {step === 'new' ? 'Enter new PIN' : 'Confirm new PIN'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center mt-2">
          {subtitle}
        </p>

        <div className="flex justify-center gap-3 sm:gap-4 mt-6">
          <PinDots pin={getActivePin()} />
        </div>

        {error && (
          <p className="text-sm text-[var(--error)] text-center mt-3 px-4">{error}</p>
        )}
        {isSubmitting && (
          <p className="text-sm text-[var(--text-secondary)] text-center mt-2">
            Resetting...
          </p>
        )}

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

export default ResetPin;
