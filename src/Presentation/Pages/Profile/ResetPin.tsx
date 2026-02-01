import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import { PinDots, PinKeypad, PIN_LENGTH } from './Components/PinKeypad';
import { userApi } from '../../../core/api/user.api';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent';

const emptyPin = () => Array(PIN_LENGTH).fill('');

const ResetPin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [, setPasswordEntered] = useState(false);
  const [newPin, setNewPin] = useState(emptyPin());
  const [confirmPin, setConfirmPin] = useState(emptyPin());
  const [step, setStep] = useState<'password' | 'new' | 'confirm'>('password');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getActivePin = () => (step === 'new' ? newPin : confirmPin);

  const handleKeyTap = async (key: string) => {
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
          setError(null);
          setIsSubmitting(true);
          try {
            const res = await userApi.resetTransactionPin({
              current_password: password,
              new_transaction_pin: newPin.join(''),
              new_transaction_pin_confirmation: next.join(''),
            });
            const ok = res?.status === 'successful' || res?.status === 'success';
            if (ok) {
              toast.success(res?.message ?? 'PIN reset successfully');
              navigate('/dashboard/profile');
            } else {
              setError(res?.message ?? 'Failed to reset PIN');
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset PIN');
          } finally {
            setIsSubmitting(false);
          }
        } else {
          setError('PINs do not match');
          setConfirmPin(emptyPin());
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    setPasswordEntered(() => true);
    setStep('new');
  };

  return (
    <div className={pageClass}>
      <div className="max-w-md mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">Reset Pin</h1>

        {step === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Enter your password to reset your transaction PIN.
            </p>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
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
              className="w-full py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark"
            >
              Continue
            </button>
          </form>
        ) : (
          <>
            <p className="text-sm text-[var(--text-secondary)] text-center mb-4">
              {step === 'new' ? 'Enter your new 5-Digit PIN' : 'Confirm your new 5-Digit PIN'}
            </p>
            <div className="flex justify-center mb-4">
              <PinDots pin={getActivePin()} />
            </div>
            {error && <p className="text-sm text-[var(--error)] text-center mb-2">{error}</p>}
            {isSubmitting && <p className="text-sm text-[var(--text-secondary)] text-center">Resetting...</p>}

            <div className="mt-8">
              <PinKeypad
                pin={getActivePin()}
                onKeyTap={handleKeyTap}
                onBackspace={handleBackspace}
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPin;
