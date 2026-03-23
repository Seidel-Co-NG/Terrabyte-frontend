import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../../core/api/auth.api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, []);

  const validate = (): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email');
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedEmail)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    setError('');
    try {
      const normalizedEmail = email.trim();
      const res = await authApi.sendResetOtp({ email: normalizedEmail });
      toast.success(res?.message || 'Reset OTP sent successfully');
      navigate(
        `/forgot-password/verify-otp?email=${encodeURIComponent(normalizedEmail)}`,
        { replace: true }
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send reset OTP';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-6 py-8 sm:py-12 max-w-md mx-auto w-full">
        <div className="flex justify-center mb-8 sm:mb-12">
          <Link to="/">
            <img
              src="/img/logo2.png"
              alt="Terrabyte"
              className="h-8 sm:h-9 object-contain"
            />
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] text-center">
          Forgot Password
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center mt-2 mb-6">
          Enter your email address to reset your password
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors disabled:opacity-70"
            />
            {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
