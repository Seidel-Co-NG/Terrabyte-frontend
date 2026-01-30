import * as React from 'react';

export interface SelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Shared drawer/modal used for plan selection across Buy Data, Cable TV, Internet, Electricity, etc.
 * Uses absolute positioning so the modal is centered within the page content area (nearest relative ancestor).
 * Ensure the page root has position: relative so the overlay and modal center in the page.
 */
const SelectionDrawer = ({ isOpen, onClose, title, children }: SelectionDrawerProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Fixed overlay covers full viewport so no white footer shows below */}
      <div
        className="fixed inset-0 z-[1000] bg-black/50 min-h-[100dvh]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal stays centered in page content area (absolute) */}
      <div className="absolute inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-[28rem] max-h-[85vh] flex flex-col bg-[var(--bg-card)] rounded-t-2xl sm:rounded-xl shadow-xl pointer-events-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto p-4 flex-1 min-h-0">{children}</div>
        </div>
      </div>
    </>
  );
};

export default SelectionDrawer;
