import React from 'react';
import { createPortal } from 'react-dom';

export interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'error';
}

const MessageModal = ({ isOpen, onClose, title = 'Notice', message = '', type = 'info' }: MessageModalProps) => {
  if (!isOpen) return null;

  const colorClass = type === 'success' ? 'bg-green-50' : type === 'error' ? 'bg-red-50' : 'bg-[var(--bg-card)]';

  const modalContent = (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={onClose} />
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
        <div className={`w-full max-w-sm ${colorClass} rounded-2xl p-6 pointer-events-auto border border-[var(--border-color)] shadow-xl`} onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">{message}</p>
            <div className="flex gap-3 w-full">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-medium">OK</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default MessageModal;
