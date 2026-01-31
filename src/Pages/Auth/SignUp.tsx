import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../assets/logo2.png';
import { useAuthStore } from '../../stores/auth.store';

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
  const { register, isLoading, error, clearError } = useAuthStore();

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

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors';
  const labelClass = 'block text-sm font-medium text-[var(--text-primary)] mb-1.5';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col py-6 sm:py-8">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 sm:px-6">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Link to="/">
            <img src={Logo} alt="Terrabyte" className="h-8 sm:h-9 object-contain" />
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
