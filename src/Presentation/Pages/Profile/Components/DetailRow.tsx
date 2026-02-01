import type { ReactNode } from 'react';

interface DetailRowProps {
  label: string;
  value?: string;
  children?: ReactNode;
}

const DetailRow = ({ label, value, children }: DetailRowProps) => (
  <div className="flex items-center justify-between gap-4 py-3 px-4 border-b border-[var(--border-color)] last:border-b-0">
    <span className="text-sm text-[var(--text-secondary)]">{label}</span>
    {children ?? <span className="text-sm font-semibold text-[var(--text-primary)]">{value ?? '—'}</span>}
  </div>
);

export default DetailRow;
