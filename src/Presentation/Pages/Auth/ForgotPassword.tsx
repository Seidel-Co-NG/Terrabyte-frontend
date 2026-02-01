import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center px-5 sm:px-6 py-8 max-w-md mx-auto w-full">
      <div className="flex justify-center mb-8">
        <Link to="/">
          <img src="/img/logo2.png" alt="Terrabyte" className="h-8 sm:h-9 object-contain" />
        </Link>
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] text-center">
        Forgot Password
      </h1>
      <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center mt-2 mb-6">
        Enter your email address to reset your password. This feature will be available soon.
      </p>
      <Link
        to="/login"
        className="w-full py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark transition-all duration-300 text-center block"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default ForgotPassword;
