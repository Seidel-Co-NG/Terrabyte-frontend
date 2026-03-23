import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../../core/api/auth.api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = useMemo(
    () => (searchParams.get('email') ?? '').trim(),
    [searchParams]
  );
  const otp = useMemo(
    () => (searchParams.get('otp') ?? '').replace(/\D/g, ''),
    [searchParams]
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!newPassword) {
      setError('Please enter your new password');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!confirmPassword) {
      setError('Please confirm your new password');
      return false;
    }
    if (confirmPassword !== newPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validate() || !email || otp.length !== 6) return;

    setIsSubmitting(true);
    try {
      const res = await authApi.resetPassword({
        email,
        otp: parseInt(otp, 10),
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      toast.success(res?.message || 'Password reset successful');
      navigate('/login', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email || otp.length !== 6) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <p className="text-[var(--text-secondary)] mb-4">
            Invalid reset session. Please restart password reset.
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
          Reset Password
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center mt-2 mb-6">
          Enter your new password for {email}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                disabled={isSubmitting}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={isSubmitting}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-[var(--error)]">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

