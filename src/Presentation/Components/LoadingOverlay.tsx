
interface Props {
  isOpen: boolean;
  message?: string;
}

const LoadingOverlay = ({ isOpen, message = 'Processing...' }: Props) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col items-center gap-3 shadow-lg">
        <div className="w-10 h-10 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-[var(--text-primary)]">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
