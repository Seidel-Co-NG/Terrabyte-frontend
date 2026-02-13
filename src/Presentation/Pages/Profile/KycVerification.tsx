import { useState, useEffect, useRef } from 'react';
import { FiCamera, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import { kycApi } from '../../../core/api/kyc.api';
import { useAuthStore } from '../../../core/stores/auth.store';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const KycVerification = () => {
  const [idType, setIdType] = useState<'bvn' | 'nin'>('bvn');
  const [idNumber, setIdNumber] = useState('');
  const [selfie, setSelfie] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const hasReservedAccount =
    user?.reserved_account && Array.isArray(user.reserved_account) && user.reserved_account.length > 0;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await kycApi.getStatus();
        if (res?.data) {
          setKycStatus(res.data.status as 'pending' | 'approved' | 'rejected');
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingStatus(false);
      }
    };
    load();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('Could not access camera. Please allow camera permission.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureSelfie = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setSelfie(dataUrl);
    stopCamera();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setSelfie(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!idNumber.trim() || !selfie) {
      toast.error('Please enter ID number and capture a selfie.');
      return;
    }
    const num = idType === 'bvn' ? 11 : 11;
    if (idNumber.replace(/\D/g, '').length !== num) {
      toast.error(`Invalid ${idType.toUpperCase()}. Must be ${num} digits.`);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await kycApi.submit({
        id_type: idType,
        id_number: idNumber.replace(/\D/g, ''),
        selfie,
      });
      const ok = res?.status === 'successful' || res?.status === 'success';
      if (ok) {
        toast.success(res?.message ?? 'KYC submitted. You will be notified once verified.');
        setKycStatus('pending');
        setSelfie(null);
        setIdNumber('');
        await fetchUser();
      } else {
        toast.error(res?.message ?? 'Submission failed');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <div className={pageClass}>
        <div className="max-w-xl mx-auto">
          <BackButton fallbackTo="/dashboard/profile" />
          <div className="mt-8 text-center text-[var(--text-secondary)]">Loading...</div>
        </div>
      </div>
    );
  }

  if (kycStatus === 'approved') {
    return (
      <div className={pageClass}>
        <div className="max-w-xl mx-auto">
          <BackButton fallbackTo="/dashboard/profile" />
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">KYC Verification</h1>
          <div className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-6 text-center">
            <FiCheckCircle className="w-16 h-16 text-[var(--success)] mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[var(--success)] mb-2">Account Verified</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Your KYC has been verified. Your limits have been increased.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (kycStatus === 'pending') {
    return (
      <div className={pageClass}>
        <div className="max-w-xl mx-auto">
          <BackButton fallbackTo="/dashboard/profile" />
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">KYC Verification</h1>
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <div className="flex items-center gap-3 text-amber-500">
              <span className="text-2xl">⏳</span>
              <div>
                <h2 className="font-bold">Pending Review</h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Your KYC submission is under review. You will receive an email once verified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageClass}>
      <div className="max-w-xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">KYC Verification</h1>

        {!hasReservedAccount && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-[var(--text-primary)]">
              <strong>Verify to get account number.</strong> Complete KYC to receive your bank account details for wallet funding.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">ID Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIdType('bvn')}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium ${
                  idType === 'bvn'
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                }`}
              >
                BVN
              </button>
              <button
                type="button"
                onClick={() => setIdType('nin')}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium ${
                  idType === 'nin'
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                }`}
              >
                NIN
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {idType === 'bvn' ? 'BVN' : 'NIN'} Number
            </label>
            <div className="relative">
              <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="tel"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder={idType === 'bvn' ? '11 digits' : '11 digits'}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Selfie</label>
            {!selfie ? (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video object-cover bg-black"
                />
                <div className="p-4 flex gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 py-2 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  >
                    <FiCamera className="inline w-4 h-4 mr-2" />
                    Start Camera
                  </button>
                  <button
                    type="button"
                    onClick={captureSelfie}
                    className="flex-1 py-2 px-4 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90"
                  >
                    Capture
                  </button>
                  <label className="flex-1 py-2 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm font-medium text-center cursor-pointer hover:bg-[var(--bg-hover)]">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={selfie}
                  alt="Selfie"
                  className="w-full rounded-xl border border-[var(--border-color)] object-cover aspect-video"
                />
                <button
                  type="button"
                  onClick={() => setSelfie(null)}
                  className="absolute top-2 right-2 py-1 px-2 rounded bg-black/60 text-white text-xs"
                >
                  Retake
                </button>
              </div>
            )}
          </div>

          <PayButton
            fullWidth
            text="Submit KYC"
            loading={isSubmitting}
            loadingText="Submitting..."
            disabled={!idNumber.trim() || !selfie || isSubmitting}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default KycVerification;
