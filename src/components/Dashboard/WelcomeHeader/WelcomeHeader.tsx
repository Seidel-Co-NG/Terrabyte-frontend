import './WelcomeHeader.css';

interface WelcomeHeaderProps {
  username?: string;
  userType?: string;
}

const WelcomeHeader = ({ username = 'Mr. Jack', userType = 'Premium' }: WelcomeHeaderProps) => {
  return (
    <div className="welcome-header">
      <div className="welcome-content">
        <div className="welcome-text">
          <h1 className="welcome-title">
            Welcome back, <span className="username">{username}</span>
          </h1>
          <p className="welcome-subtitle">VTU Dashboard - Your one-stop solution for all virtual top-up services</p>
        </div>
        <div className="user-type-badge">
          <span className="user-type-label">Account Type:</span>
          <span className="user-type-value">{userType}</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;

