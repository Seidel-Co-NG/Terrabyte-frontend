import { createPortal } from 'react-dom';

export interface PinReceiptPin {
  serialNumber: string;
  pin: string;
  amount: number;
  network?: string;
}

export interface PinReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionReference: string;
  nameOnCard: string;
  pins: PinReceiptPin[];
}

const PinReceiptModal = ({
  isOpen,
  onClose,
  transactionReference,
  nameOnCard,
  pins,
}: PinReceiptModalProps) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPins = () => {
    const text = pins
      .map(
        (p, i) =>
          `Pin ${i + 1}: ${p.pin} (Serial: ${p.serialNumber}) - ₦${p.amount.toLocaleString()}`
      )
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      // Could show a small toast
    });
  };

  const content = (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[1000]"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-xl pointer-events-auto print:shadow-none print:border print:max-h-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--accent-primary)]">TERRABYTE</h2>
                <p className="text-sm text-[var(--text-muted)]">Recharge Pin Receipt</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors print:hidden"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-4 mb-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Name on Card</span>
                <span className="font-medium text-[var(--text-primary)]">{nameOnCard}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Transaction Ref.</span>
                <span className="font-medium text-[var(--text-primary)] break-all text-right ml-2">
                  {transactionReference}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Quantity</span>
                <span className="font-medium text-[var(--text-primary)]">{pins.length} Pin(s)</span>
              </div>
            </div>

            {pins.length > 0 ? (
              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Pins</h3>
                {pins.map((pin, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[var(--border-color)] p-4 bg-[var(--bg-tertiary)]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[var(--text-muted)]">Pin {index + 1}</span>
                      {pin.network && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-primary)] text-white">
                          {pin.network}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-muted)]">Serial No.</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {pin.serialNumber || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-muted)]">PIN</span>
                      <span className="font-bold text-[var(--text-primary)] font-mono text-base">
                        {pin.pin || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">Amount</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        ₦{pin.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Your pins have been generated. Check your transaction history or contact support for
                PIN details if needed.
              </p>
            )}

            <div className="flex gap-3 print:hidden">
              {pins.length > 0 && (
                <button
                  type="button"
                  onClick={handleCopyPins}
                  className="flex-1 py-2.5 rounded-xl border-2 border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Copy Pins
                </button>
              )}
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default PinReceiptModal;
