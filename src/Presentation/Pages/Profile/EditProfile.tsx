import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import DetailRow from './Components/DetailRow';
import { useAuthStore } from '../../../core/stores/auth.store';
import { compressProfileImage } from '../../../core/utils/imageCompress';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

function formatDate(value: string | undefined): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
  } catch {
    return value;
  }
}

const EditProfile = () => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const userFromStore = useAuthStore((s) => s.user);
  const updateProfilePicture = useAuthStore((s) => s.updateProfilePicture);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploadError(null);
    setUploading(true);
    try {
      const compressed = await compressProfileImage(file);
      const ok = await updateProfilePicture(compressed);
      if (!ok) setUploadError('Failed to update profile picture');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const user = {
    name: userFromStore?.name ?? '—',
    username: userFromStore?.username ?? '—',
    email: userFromStore?.email ?? '—',
    phone: userFromStore?.phone ?? '—',
    userType: (userFromStore?.user_type ?? 'user').replace(/_/g, ' '),
    lastLogin: formatDate(userFromStore?.updated_at ?? userFromStore?.created_at),
  };

  return (
    <div className={pageClass}>
      <div className="max-w-2xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">Edit Profile</h1>

        <section className="mb-6">
          <p className="text-sm text-[var(--text-secondary)] mb-2">Profile Picture</p>
          <div className="flex items-center gap-4">
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
              onChange={handleProfilePictureChange}
              disabled={uploading}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              capture="user"
              className="hidden"
              onChange={handleProfilePictureChange}
              disabled={uploading}
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPhotoMenu((v) => !v)}
                disabled={uploading}
                className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-tertiary)] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {userFromStore?.profile_picture_url ? (
                  <img
                    src={userFromStore.profile_picture_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[var(--text-muted)]">
                    {(userFromStore?.name?.[0] ?? userFromStore?.username?.[0] ?? 'U').toUpperCase()}
                  </span>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs">Uploading...</span>
                  </div>
                )}
              </button>
              {showPhotoMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setShowPhotoMenu(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 z-20 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg py-1 min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPhotoMenu(false);
                        cameraInputRef.current?.click();
                      }}
                      disabled={uploading}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 flex items-center gap-2"
                    >
                      Take selfie
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPhotoMenu(false);
                        uploadInputRef.current?.click();
                      }}
                      disabled={uploading}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 flex items-center gap-2"
                    >
                      Upload from device
                    </button>
                  </div>
                </>
              )}
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Tap to change photo</p>
              {uploadError && <p className="text-sm text-[var(--error)] mt-1">{uploadError}</p>}
            </div>
          </div>
        </section>

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
