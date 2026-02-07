import { useState } from 'react';
import toast from 'react-hot-toast';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import { servicesApi } from '../../../core/api';

// Mock: cost per SMS (replace with API/config)
const COST_PER_SMS = 5;

const parseRecipients = (text: string): string[] => {
  return text
    .split(/[,\s]+/)
    .map((s) => s.replace(/\D/g, '').trim())
    .filter((s) => s.length >= 10);
};

const BulkSMS = () => {
  const [recipients, setRecipients] = useState('');
  const [senderId, setSenderId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const recipientList = parseRecipients(recipients);
  const quantity = recipientList.length;
  const amountToPay = quantity * COST_PER_SMS;
  const balance = '₦125,450.00';

  const canSubmit =
    recipientList.length > 0 &&
    senderId.trim().length > 0 &&
    message.trim().length > 0 &&
    !isSubmitting;

  const handleSend = () => {
    if (!canSubmit) return;
    setPinModalOpen(true);
  };

  const handleConfirmSend = async (transactionPin: string) => {
    await servicesApi.sendBulkSms({
      from: senderId.trim(),
      to: recipientList.join(','),
      msg: message.trim(),
      transaction_pin: transactionPin,
    });
    toast.success(`Bulk SMS sent to ${quantity} recipient(s) successfully.`);
    setRecipients('');
    setSenderId('');
    setMessage('');
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Bulk SMS</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter Recipients
            </label>
            <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-4">
              <textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Recipients (08012....98, 08023....45,)"
                rows={3}
                className="w-full py-3 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] resize-y min-h-[80px]"
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-xs text-[var(--accent-primary)] font-medium">
                  {amountToPay > 0 ? `Amount to pay: ₦${amountToPay.toLocaleString()}` : ''}
                </span>
                <span className="text-xs text-[var(--text-muted)]">Balance: {balance}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter Sender ID
            </label>
            <input
              type="text"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="Sender ID"
              maxLength={11}
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 160))}
              placeholder="Message"
              maxLength={160}
              rows={5}
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] resize-y min-h-[100px]"
            />
            <p className="text-xs text-[var(--text-muted)]">{message.length}/160</p>
          </div>

          <div className="flex-1 min-h-[40px]" />

          <PayButton
            fullWidth
            text={isSubmitting ? 'Sending...' : 'Send SMS'}
            loading={isSubmitting}
            loadingText="Sending..."
            disabled={!canSubmit}
            onClick={handleSend}
          />
        </div>
      </div>
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Bulk SMS"
        subtitle={`${quantity} recipient(s) • ₦${amountToPay.toLocaleString()}`}
        onConfirm={handleConfirmSend}
      />
    </div>
  );
};

export default BulkSMS;
