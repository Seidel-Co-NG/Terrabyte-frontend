import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../core/stores/auth.store';

type FormErrors = {
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { register, googleLogin, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!username.trim()) newErrors.username = 'Please enter a username';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!email.trim()) newErrors.email = 'Please enter your email';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!phone.trim()) newErrors.phone = 'Please enter your phone number';
    if (!password) newErrors.password = 'Please enter your password';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;
    const result = await register({
      fullname: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      ...(referralCode.trim() && { referral: referralCode.trim() }),
    });
    if (result.success) {
      if (result.message) toast.success(result.message);
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      navigate(isAuthenticated ? '/welcome' : '/verify-otp');
    }
  };

  const handleGoogleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const success = await googleLogin(tokenResponse.access_token);
        if (!success) {
          const message = useAuthStore.getState().error;
          toast.error(message || 'Google sign up failed');
          clearError();
          return;
        }
        toast.success('Account created successfully', { icon: '✓', iconTheme: { primary: '#22c55e', secondary: '#fff' } });
        const { fetchUser } = useAuthStore.getState();
        await fetchUser();
        const user = useAuthStore.getState().user;
        if (user && !user.has_transaction_pin) {
          navigate('/set-transaction-pin', { replace: true });
          return;
        }
        navigate('/dashboard', { replace: true });
      } catch (error) {
        toast.error('Google sign up failed. Please try again.');
      }
    },
    onError: () => {
      toast.error('Google sign up failed. Please try again.');
    },
  });

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors';
  const labelClass = 'block text-sm font-medium text-[var(--text-primary)] mb-1.5';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col py-6 sm:py-8">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 sm:px-6">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Link to="/">
            <img src="/img/logo2.png" alt="Terrabyte" className="h-8 sm:h-9 object-contain" />
          </Link>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] text-center">
          Create Account
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center mt-2 mb-6">
          Start your journey with us.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className={labelClass}>Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); clearFieldError('fullName'); }}
              placeholder="Enter your full name"
              className={inputClass}
              autoComplete="name"
            />
            {errors.fullName && <p className="mt-1 text-sm text-[var(--error)]">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="username" className={labelClass}>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); clearFieldError('username'); }}
              placeholder="Choose a username"
              className={inputClass}
              autoComplete="username"
            />
            {errors.username && <p className="mt-1 text-sm text-[var(--error)]">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
              placeholder="Enter your email"
              className={inputClass}
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-sm text-[var(--error)]">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); clearFieldError('phone'); }}
              placeholder="Enter your phone number"
              className={inputClass}
              autoComplete="tel"
            />
            {errors.phone && <p className="mt-1 text-sm text-[var(--error)]">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="referralCode" className={labelClass}>Referral Code (Optional)</label>
            <input
              id="referralCode"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter referral code if you have one"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                placeholder="At least 6 characters"
                className={`${inputClass} pr-12`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-[var(--error)]">{errors.password}</p>}
          </div>

          {error && (
            <p className="text-sm text-[var(--error)]">{error}</p>
          )}

          <p className="text-xs text-[var(--text-muted)]">
            By signing up, you agree to our{' '}
            <Link to="/terms-of-service" className="text-brand-primary font-medium hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/terms-of-service" className="text-brand-primary font-medium hover:underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-color)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[var(--bg-primary)] text-[var(--text-muted)]">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleGoogleSignUp()}
          disabled={isLoading}
          className="w-full py-3 rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-hover)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
