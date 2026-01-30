import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Delete } from 'lucide-react';

const PIN_LENGTH = 5;
const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'back'],
];

const Welcome = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // TODO: Get from auth context when implemented (e.g. after login)
  const username = 'User';

  const handleKeyTap = (key: string) => {
    if (key === 'back') {
      handleBackspace();
      return;
    }
    if (key === '' || pin.every((d) => d !== '')) return;
    setError(null);
    const idx = pin.findIndex((d) => d === '');
    const next = [...pin];
    next[idx] = key;
    setPin(next);
    if (next.every((d) => d !== '')) {
      verifyPin(next.join(''));
    }
  };

  const handleBackspace = () => {
    setError(null);
    const idx = pin.findIndex((d) => d === '') - 1;
    if (idx < 0) return;
    const next = [...pin];
    next[idx] = '';
    setPin(next);
  };

  const verifyPin = async (_enteredPin: string) => {
    setIsVerifying(true);
    setError(null);
    // TODO: Replace with actual API - confirmTransactionPin
    await new Promise((r) => setTimeout(r, 600));
    setIsVerifying(false);
    // Simulate success for now; replace with API response check
    navigate('/dashboard', { replace: true });
    // On API failure: setError('Invalid PIN. Please try again.'); setPin(Array(PIN_LENGTH).fill(''));
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    // TODO: Call logout API when implemented
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="flex-1 flex flex-col items-center pt-8 sm:pt-10 pb-6 px-5 max-w-md mx-auto w-full">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center">
          <User className="w-6 h-6 text-[var(--text-muted)]" strokeWidth={2} />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] text-center mt-4 px-4">
          Welcome Back {username}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center mt-2">
          Enter your 5-Digit PIN
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

        {error && (
          <p className="text-sm text-[var(--error)] text-center mt-3 px-4">
            {error}
          </p>
        )}

        {isVerifying && (
          <p className="text-sm text-[var(--text-secondary)] text-center mt-2">
            Verifying PIN...
          </p>
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
                    disabled={isVerifying}
                    className="flex-1 max-w-[72px] h-12 sm:h-14 rounded-2xl text-2xl font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {key}
                  </button>
                )
              )}
            </div>
          ))}
        </div>

        {/* Not your account? Log out */}
        <div className="flex items-center justify-center gap-1 mt-6 pb-6">
          <span className="text-sm text-[var(--text-secondary)]">
            Not your account?
          </span>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="text-sm font-bold text-[var(--text-primary)] underline hover:text-brand-primary transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowLogoutConfirm(false)}>
          <div
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Logout
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-[var(--error)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
