import { Link } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const EditProfile = () => {
  // TODO: from user context/API
  const user = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '08012345678',
    userType: 'regular',
    lastLogin: '30 Jan 2025, 10:30 AM',
  };

  return (
    <div className={pageClass}>
      <div className="max-w-2xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">Edit Profile</h1>

        <section className="mb-6">
          <p className="text-sm text-[var(--text-secondary)] mb-2">User Details</p>
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <DetailRow label="Name" value={user.name} />
            <DetailRow label="Username" value={user.username} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Phone Number" value={user.phone} />
          </div>
        </section>

        <section className="mb-6">
          <p className="text-sm text-[var(--text-secondary)] mb-2">User Type</p>
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <DetailRow label="User Type" value={user.userType?.replace(/_/g, ' ').toUpperCase()} />
            {user.userType !== 'top_user' && (
              <div className="p-4 border-t border-[var(--border-color)]">
                <Link
                  to="/dashboard/profile/user-limit"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark"
                >
                  Upgrade User Type
                </Link>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  Upgrade your user type to get better rates and exclusive benefits
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-6">
          <p className="text-sm text-[var(--text-secondary)] mb-2">Account Status</p>
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <DetailRow label="Last Login" value={user.lastLogin} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProfile;
