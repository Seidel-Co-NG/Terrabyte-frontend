import { useState, useEffect, useRef, useCallback } from 'react';
import { FiCamera, FiCreditCard, FiCheckCircle, FiVideo, FiLock, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import { kycApi, type KycLevelStatus, type KycLevelCatalogItem } from '../../../core/api/kyc.api';
import { useAuthStore } from '../../../core/stores/auth.store';
import { uploadVideoToCloudinary } from '../../../core/utils/cloudinary';
import { compressDataUrl, compressImageFile } from '../../../core/utils/imageCompress';

function pickRecorderMime(): string {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
  }
  return '';
}

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const KycVerification = () => {
  // Shared
  const [selectedLevel, setSelectedLevel] = useState<2 | 3>(2);
  const [userLevel, setUserLevel] = useState(1);
  const [level2Status, setLevel2Status] = useState<KycLevelStatus | null>(null);
  const [level3Status, setLevel3Status] = useState<KycLevelStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levelCatalog, setLevelCatalog] = useState<KycLevelCatalogItem[]>([]);

  // Level 2
  const [idType, setIdType] = useState<'bvn' | 'nin'>('bvn');
  const [idNumber, setIdNumber] = useState('');
  const [selfie, setSelfie] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Level 3
  const [nin, setNin] = useState('');
  const [ninImage, setNinImage] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [addressImage, setAddressImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoPhrase] = useState(() => {
    const code = Math.floor(1000 + Math.random() * 9000);
    return `My Terrabyte verification code is ${code}.`;
  });
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const recordStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const hasReservedAccount =
    user?.reserved_account && Array.isArray(user.reserved_account) && user.reserved_account.length > 0;

  const level2Done = level2Status === 'approved' || userLevel >= 2;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await kycApi.getStatus();
        setUserLevel(res.user_level ?? 1);
        setLevel2Status((res.levels?.level2?.status as KycLevelStatus) ?? null);
        setLevel3Status((res.levels?.level3?.status as KycLevelStatus) ?? null);
        setLevelCatalog(res.level_catalog ?? []);
        if ((res.levels?.level2?.status === 'approved') || (res.user_level ?? 1) >= 2) {
          setSelectedLevel(3);
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingStatus(false);
      }
    };
    load();
    return () => {
      stopSelfieCamera();
      stopRecordingTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Level 2 selfie ----------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      toast.error('Could not access camera. Please allow camera permission.');
    }
  };

  const stopSelfieCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const captureSelfie = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    compressDataUrl(canvas.toDataURL('image/jpeg', 0.8))
      .then(setSelfie)
      .catch(() => setSelfie(canvas.toDataURL('image/jpeg', 0.6)));
    stopSelfieCamera();
  };

  const readFileAsDataUrl = (file: File, onDone: (v: string) => void) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    compressImageFile(file).then(onDone).catch(() => {
      const reader = new FileReader();
      reader.onload = () => onDone(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleSelfieFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFileAsDataUrl(file, setSelfie);
  };

  const handleSubmitLevel2 = async () => {
    if (idNumber.replace(/\D/g, '').length !== 11) {
      toast.error(`Invalid ${idType.toUpperCase()}. Must be 11 digits.`);
      return;
    }
    if (!selfie) {
      toast.error('Please capture a selfie.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await kycApi.submit({ id_type: idType, id_number: idNumber.replace(/\D/g, ''), selfie });
      const ok = res?.status === 'successful' || res?.status === 'success';
      if (ok) {
        toast.success(res?.message ?? 'KYC submitted. You will be notified once verified.');
        setLevel2Status('pending');
        setSelfie(null);
        setIdNumber('');
        await fetchUser();
      } else {
        toast.error(res?.message ?? 'Submission failed');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Level 3 live video ----------
  const stopRecordingTracks = () => {
    recordStreamRef.current?.getTracks().forEach((t) => t.stop());
    recordStreamRef.current = null;
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24, max: 24 },
        },
        audio: true,
      });
      recordStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.muted = true;
        await liveVideoRef.current.play().catch(() => {});
      }
      chunksRef.current = [];
      const mimeType = pickRecorderMime();
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: 600000,
        audioBitsPerSecond: 64000,
      });
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        stopRecordingTracks();
        setVideoPreview(URL.createObjectURL(blob));
        uploadVideo(blob);
      };
      recorder.start();
      setIsRecording(true);
      autoStopRef.current = setTimeout(() => stopRecording(), 15000);
    } catch {
      toast.error('Could not access camera/microphone. Please allow permissions.');
    }
  };

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const uploadVideo = async (blob: Blob) => {
    setIsUploadingVideo(true);
    try {
      const url = await uploadVideoToCloudinary(blob);
      setVideoUrl(url);
      toast.success('Live video uploaded.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Video upload failed');
      setVideoPreview(null);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const resetVideo = () => {
    setVideoUrl(null);
    setVideoPreview(null);
  };

  const handleSubmitLevel3 = async () => {
    if (nin.replace(/\D/g, '').length !== 11) {
      toast.error('NIN must be 11 digits.');
      return;
    }
    if (!ninImage) return toast.error('Please upload a photo of your NIN.');
    if (!videoUrl) return toast.error('Please record your live verification video.');
    if (!address.trim()) return toast.error('Please enter your residential address.');
    if (!addressImage) return toast.error('Please upload a picture of your address / proof.');

    setIsSubmitting(true);
    try {
      const res = await kycApi.submitLevel3({
        id_number: nin.replace(/\D/g, ''),
        nin_image: ninImage,
        video_url: videoUrl,
        video_phrase: videoPhrase,
        address: address.trim(),
        address_image: addressImage,
      });
      const ok = res?.status === 'successful' || res?.status === 'success';
      if (ok) {
        toast.success(res?.message ?? 'Level 3 KYC submitted. You will be notified once verified.');
        setLevel3Status('pending');
        setNin('');
        setNinImage(null);
        setAddress('');
        setAddressImage(null);
        resetVideo();
        await fetchUser();
      } else {
        toast.error(res?.message ?? 'Submission failed');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- UI helpers ----------
  // NOTE: these are render functions (not components) so React preserves DOM/focus across re-renders.
  const renderShell = (children: React.ReactNode) => (
    <div className={pageClass}>
      <div className="max-w-xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-6">KYC Verification</h1>
        {children}
      </div>
    </div>
  );

  const statusBadge = (status: KycLevelStatus | null) => {
    if (!status) return null;
    const map: Record<KycLevelStatus, string> = {
      approved: 'text-[var(--success)]',
      pending: 'text-amber-500',
      rejected: 'text-red-500',
    };
    const label = status === 'approved' ? 'Verified' : status === 'pending' ? 'Pending' : 'Rejected';
    return <span className={`text-xs ${map[status]}`}>{label}</span>;
  };

  const renderLevelCatalog = () => {
    if (!levelCatalog.length) return null;
    return (
      <div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Account levels &amp; daily limits</h2>
        <div className="flex flex-col gap-3">
          {levelCatalog.map((lvl) => {
            const isCurrent = userLevel === lvl.level;
            return (
              <div
                key={lvl.level}
                className={`rounded-xl border p-3 ${
                  isCurrent
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                    : 'border-[var(--border-color)] bg-[var(--bg-tertiary)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{lvl.name}</span>
                  {isCurrent ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-white">
                      Current
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[var(--accent-primary)]">
                      ₦{lvl.daily_limit.toLocaleString()}/day
                    </span>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Daily limit: ₦{lvl.daily_limit.toLocaleString()}
                  </p>
                )}
                {lvl.requirements && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    <span className="text-[var(--text-muted)]">Requires:</span> {lvl.requirements}
                  </p>
                )}
                {lvl.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">{lvl.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTabs = () => (
    <div className="flex gap-3 mb-6">
      <button
        type="button"
        onClick={() => setSelectedLevel(2)}
        className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium ${
          selectedLevel === 2
            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
            : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
        }`}
      >
        Level 2 {statusBadge(level2Status)}
      </button>
      <button
        type="button"
        disabled={!level2Done}
        onClick={() => level2Done && setSelectedLevel(3)}
        className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-1 ${
          !level2Done
            ? 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
            : selectedLevel === 3
            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
            : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
        }`}
      >
        {!level2Done && <FiLock className="w-3 h-3" />}
        Level 3 {statusBadge(level3Status)}
      </button>
    </div>
  );

  const renderStatusCard = (tone: 'success' | 'pending', title: string, body: string) => (
    <div
      className={`rounded-2xl border p-6 text-center ${
        tone === 'success'
          ? 'border-[var(--success)]/30 bg-[var(--success)]/10'
          : 'border-[var(--border-color)] bg-[var(--bg-card)]'
      }`}
    >
      {tone === 'success' ? (
        <FiCheckCircle className="w-16 h-16 text-[var(--success)] mx-auto mb-4" />
      ) : (
        <span className="text-4xl block mb-3">⏳</span>
      )}
      <h2 className={`text-lg font-bold mb-2 ${tone === 'success' ? 'text-[var(--success)]' : 'text-amber-500'}`}>{title}</h2>
      <p className="text-sm text-[var(--text-secondary)]">{body}</p>
    </div>
  );

  const renderImageField = (label: string, value: string | null, onChange: (v: string | null) => void) => (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{label}</label>
      {value ? (
        <div className="relative">
          <img src={value} alt={label} className="w-full rounded-xl border border-[var(--border-color)] object-cover aspect-video" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 py-1 px-2 rounded bg-black/60 text-white text-xs"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-tertiary)] aspect-video cursor-pointer hover:bg-[var(--bg-hover)]">
          <FiUpload className="w-6 h-6 text-[var(--text-muted)]" />
          <span className="text-sm text-[var(--text-muted)]">Tap to capture or upload</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readFileAsDataUrl(f, (v) => onChange(v));
            }}
          />
        </label>
      )}
    </div>
  );

  // ---------- Render ----------
  if (isLoadingStatus) {
    return renderShell(<div className="mt-8 text-center text-[var(--text-secondary)]">Loading...</div>);
  }

  return renderShell(
    <>
      {renderLevelCatalog()}
      {renderTabs()}

      {selectedLevel === 2 && (
        <>
          {level2Done ? (
            renderStatusCard('success', 'Level 2 Verified', 'Your account is verified at Level 2.')
          ) : level2Status === 'pending' ? (
            renderStatusCard(
              'pending',
              'Pending Review',
              'Your Level 2 submission is under review. You will be notified once verified.'
            )
          ) : (
            <div className="flex flex-col gap-5">
              {level2Status === 'rejected' && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-[var(--text-primary)]">
                  Your previous submission was rejected. Please review your details and submit again.
                </div>
              )}
              {!hasReservedAccount && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm text-[var(--text-primary)]">
                    <strong>Verify to get account number.</strong> Complete KYC to receive your bank account details for wallet funding.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">ID Type</label>
                <div className="flex gap-3">
                  {(['bvn', 'nin'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setIdType(t)}
                      className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium ${
                        idType === t
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  {idType.toUpperCase()} Number
                </label>
                <div className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="11 digits"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Selfie</label>
                {!selfie ? (
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover bg-black" />
                    <div className="p-4 flex gap-2">
                      <button type="button" onClick={startCamera} className="flex-1 py-2 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)]">
                        <FiCamera className="inline w-4 h-4 mr-2" />
                        Start Camera
                      </button>
                      <button type="button" onClick={captureSelfie} className="flex-1 py-2 px-4 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90">
                        Capture
                      </button>
                      <label className="flex-1 py-2 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm font-medium text-center cursor-pointer hover:bg-[var(--bg-hover)]">
                        Upload
                        <input type="file" accept="image/*" capture="user" className="hidden" onChange={handleSelfieFile} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={selfie} alt="Selfie" className="w-full rounded-xl border border-[var(--border-color)] object-cover aspect-video" />
                    <button type="button" onClick={() => setSelfie(null)} className="absolute top-2 right-2 py-1 px-2 rounded bg-black/60 text-white text-xs">
                      Retake
                    </button>
                  </div>
                )}
              </div>

              <PayButton
                fullWidth
                text="Submit Level 2 KYC"
                loading={isSubmitting}
                loadingText="Submitting..."
                disabled={!idNumber.trim() || !selfie || isSubmitting}
                onClick={handleSubmitLevel2}
              />
            </div>
          )}
        </>
      )}

      {selectedLevel === 3 && (
        <>
          {!level2Done ? (
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 text-center">
              <FiLock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
              <h2 className="font-bold text-[var(--text-primary)] mb-1">Complete Level 2 First</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Please complete your Level 2 verification before applying for Level 3.
              </p>
            </div>
          ) : level3Status === 'approved' || userLevel >= 3 ? (
            renderStatusCard(
              'success',
              'Level 3 Verified',
              'You are fully verified. You can now transfer to any bank with the highest daily limit.'
            )
          ) : level3Status === 'pending' ? (
            renderStatusCard(
              'pending',
              'Pending Review',
              'Your Level 3 submission is under review. You will be notified once verified.'
            )
          ) : (
            <div className="flex flex-col gap-5">
              {level3Status === 'rejected' && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-[var(--text-primary)]">
                  Your previous submission was rejected. Please review your details and submit again.
                </div>
              )}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-sm text-[var(--text-primary)]">
                  Level 3 unlocks <strong>bank transfers to any bank</strong> and the highest daily limit. Provide your NIN, a live video, and your address.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">NIN Number</label>
                <div className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    value={nin}
                    onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="11 digits"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              {renderImageField('NIN Slip / Card Image', ninImage, setNinImage)}

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Live Video</label>
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">Record a short video reading this out loud:</p>
                  <div className="rounded-lg bg-[var(--accent-primary)]/10 p-3 mb-3">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">"{videoPhrase}"</p>
                  </div>

                  {videoPreview ? (
                    <div className="relative">
                      <video src={videoPreview} controls playsInline className="w-full rounded-lg aspect-video bg-black" />
                      <div className="flex items-center gap-2 mt-2">
                        {isUploadingVideo ? (
                          <span className="text-xs text-[var(--text-secondary)]">Uploading video...</span>
                        ) : videoUrl ? (
                          <span className="text-xs text-[var(--success)] flex items-center gap-1">
                            <FiCheckCircle /> Uploaded
                          </span>
                        ) : null}
                        <button type="button" onClick={resetVideo} className="ml-auto py-1 px-3 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-xs">
                          Re-record
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video ref={liveVideoRef} autoPlay playsInline muted className="w-full aspect-video object-cover bg-black rounded-lg" />
                      <div className="mt-3">
                        {!isRecording ? (
                          <button type="button" onClick={startRecording} className="w-full py-2 px-4 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2">
                            <FiVideo /> Start Recording (15s max)
                          </button>
                        ) : (
                          <button type="button" onClick={stopRecording} className="w-full py-2 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Stop Recording
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Residential Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="House number, street, city, state"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              {renderImageField('Picture of Address / Proof of Address', addressImage, setAddressImage)}

              <PayButton
                fullWidth
                text="Submit Level 3 KYC"
                loading={isSubmitting}
                loadingText="Submitting..."
                disabled={isSubmitting || isUploadingVideo}
                onClick={handleSubmitLevel3}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default KycVerification;
