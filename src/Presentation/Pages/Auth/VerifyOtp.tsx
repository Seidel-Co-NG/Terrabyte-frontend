import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../core/stores/auth.store';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const {
    pendingVerifyEmail,
    verifyRegistrationOtp,
    resendVerificationEmail,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    clearError();
    setOtpError('');
  }, [clearError]);

  useEffect(() => {
    if (!pendingVerifyEmail) {
      navigate('/signup', { replace: true });
    }
    // Do not auto-redirect when isAuthenticated here: user may be logged in but verifying email (e.g. from purchase error). Redirect only after successful verify in handleVerify.
  }, [pendingVerifyEmail, navigate]);

  const email = pendingVerifyEmail ?? '';

  const validateOtp = (): boolean => {
    const trimmed = otp.replace(/\s/g, '');
    if (!trimmed) {
      setOtpError('Please enter the 6-digit code');
      return false;
    }
    if (!/^\d{6}$/.test(trimmed)) {
      setOtpError('Please enter a valid 6-digit code');
      return false;
    }
    setOtpError('');
    return true;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp() || !email || isLoading) return;
    const code = parseInt(otp.replace(/\s/g, ''), 10);
    const success = await verifyRegistrationOtp(email, code);
    if (success) {
      const path = redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`;
      navigate(path, { replace: true });
    }
  };

  const handleResend = async () => {
    if (!email || isLoading) return;
    clearError();
    await resendVerificationEmail(email);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors text-center text-lg tracking-[0.3em]';

  if (!pendingVerifyEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col py-6 sm:py-8">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 sm:px-6">
        <div className="flex justify-center mb-6 sm:mb-8">
          <Link to="/">
            <img src="/img/logo2.png" alt="Terrabyte" className="h-8 sm:h-9 object-contain" />
          </Link>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] text-center">
          Verify your email
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center mt-2 mb-1">
          We sent a 6-digit code to
        </p>
        <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] text-center mb-6">
          {email}
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5 sr-only">
              Verification code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '');
                setOtp(v);
                setOtpError('');
              }}
              placeholder="000000"
              className={inputClass}
              disabled={isLoading}
            />
            {(otpError || error) && (
              <p className="mt-1.5 text-sm text-[var(--error)] text-center">
                {otpError || error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="font-semibold text-brand-primary hover:text-brand-primary-dark disabled:opacity-70 transition-colors"
            >
              Resend
            </button>
          </p>
        </form>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          <Link to="/signup" className="font-medium text-brand-primary hover:text-brand-primary-dark transition-colors">
            Back to Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
