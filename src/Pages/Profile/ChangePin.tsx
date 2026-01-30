import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import { PinDots, PinKeypad, PIN_LENGTH } from './Components/PinKeypad';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const emptyPin = () => Array(PIN_LENGTH).fill('');

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
    setError(null);
    if (step === 'current') {
      const idx = currentPin.findIndex((d) => d === '');
      if (idx === -1) return;
      const next = [...currentPin];
      next[idx] = key;
      setCurrentPin(next);
      if (next.every((d) => d !== '')) setStep('new');
    } else if (step === 'new') {
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
          setIsSubmitting(true);
          // TODO: API change pin
          setTimeout(() => {
            setIsSubmitting(false);
            navigate('/dashboard/profile');
          }, 600);
        } else {
          setError('New PINs do not match');
          setConfirmPin(emptyPin());
          setStep('confirm');
        }
      }
    }
  };

  const handleBackspace = () => {
    setError(null);
    if (step === 'current') {
      const idx = currentPin.findIndex((d) => d === '') - 1;
      if (idx >= 0) {
        const next = [...currentPin];
        next[idx] = '';
        setCurrentPin(next);
      }
    } else if (step === 'new') {
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

  const labels = {
    current: 'Enter your current 5-Digit PIN',
    new: 'Enter your new 5-Digit PIN',
    confirm: 'Confirm your new 5-Digit PIN',
  };

  return (
    <div className={pageClass}>
      <div className="max-w-md mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">Change Pin</h1>

        <p className="text-sm text-[var(--text-secondary)] text-center mb-4">{labels[step]}</p>
        <div className="flex justify-center mb-4">
          <PinDots pin={getActivePin()} />
        </div>
        {error && <p className="text-sm text-[var(--error)] text-center mb-2">{error}</p>}
        {isSubmitting && <p className="text-sm text-[var(--text-secondary)] text-center">Verifying...</p>}

        <div className="mt-8">
          <PinKeypad
            pin={getActivePin()}
            onKeyTap={handleKeyTap}
            onBackspace={handleBackspace}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePin;
