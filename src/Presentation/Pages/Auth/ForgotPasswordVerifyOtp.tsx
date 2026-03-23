import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../../core/api/auth.api';

const ForgotPasswordVerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  const email = useMemo(
    () => (searchParams.get('email') ?? '').trim(),
    [searchParams]
  );

  const validateOtp = (): boolean => {
    const trimmed = otp.replace(/\s/g, '');
    if (!trimmed) {
      setError('Please enter the OTP');
      return false;
    }
    if (!/^\d{6}$/.test(trimmed)) {
      setError('OTP must be 6 digits');
      return false;
    }
    setError('');
    return true;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !validateOtp()) return;

    setIsSubmitting(true);
    try {
      await authApi.verifyResetOtp({
        email,
        otp: parseInt(otp.replace(/\s/g, ''), 10),
      });
      toast.success('OTP verified successfully');
      navigate(
        `/forgot-password/reset?email=${encodeURIComponent(email)}&otp=${otp.replace(
          /\s/g,
          ''
        )}`,
        { replace: true }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OTP verification failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || isResending) return;
    setIsResending(true);
    try {
      const res = await authApi.sendResetOtp({ email });
      toast.success(res?.message || 'OTP sent');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <p className="text-[var(--text-secondary)] mb-4">
            Missing email for password reset.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block px-5 py-2.5 rounded-full bg-brand-primary text-white font-semibold"
          >
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-6 py-8 sm:py-12 max-w-md mx-auto w-full">
        <div className="flex justify-center mb-8 sm:mb-12">
          <Link to="/">
            <img src="/img/logo2.png" alt="Terrabyte" className="h-8 sm:h-9 object-contain" />
          </Link>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] text-center">
          Verify OTP
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center mt-2 mb-6">
          Enter the 6-digit code sent to {email}
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ''));
                if (error) setError('');
              }}
              placeholder="000000"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors tracking-[0.25em]"
            />
            {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-semibold text-brand-primary hover:text-brand-primary-dark disabled:opacity-70 transition-colors"
          >
            {isResending ? 'Sending...' : 'Resend'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordVerifyOtp;

