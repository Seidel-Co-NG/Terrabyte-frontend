import { useState, useEffect } from 'react';
import { FiInfo, FiArrowLeft, FiCalendar, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import SelectionDrawer from '../../Components/SelectionDrawer';
import DetailRow from './Components/DetailRow';
import { servicesApi, userApi } from '../../../core/api';

interface AdminBank {
  account_number: string;
  bank_name: string;
  account_name: string;
}

/** Normalize raw config response to AdminBank[]. API returns data.admin_bank_account. */
function normalizeAdminBanks(raw: unknown): AdminBank[] {
  if (!raw || typeof raw !== 'object') return [];
  const data = raw as Record<string, unknown>;
  const list = (data.admin_bank_account ?? data.adminBankAccount) as unknown;
  if (!Array.isArray(list) || list.length === 0) return [];
  return list.map((item: Record<string, unknown>) => ({
    account_number: String(item.account_number ?? item.accountNumber ?? ''),
    bank_name: String(item.bank_name ?? item.bankName ?? ''),
    account_name: String(item.account_name ?? item.accountName ?? ''),
  })).filter((b) => b.account_number && b.bank_name);
}

const ManualBankFunding = () => {
  const [adminBanks, setAdminBanks] = useState<AdminBank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [hasMadeTransfer, setHasMadeTransfer] = useState(false);
  
  // Form state
  const [selectedBank, setSelectedBank] = useState<AdminBank | null>(null);
  const [bankDrawerOpen, setBankDrawerOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [depositorName, setDepositorName] = useState('');
  const [depositorBank, setDepositorBank] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentTime, setPaymentTime] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    userApi.getConfigurations().then((res) => {
      const list = normalizeAdminBanks(res?.data);
      if (list.length > 0) {
        setAdminBanks(list);
      }
    }).catch(() => {}).finally(() => setLoadingBanks(false));
  }, []);

  const amountNum = amount ? parseFloat(amount) : 0;
  const isValidAmount = amountNum >= 100;
  const isFormValid =
    !!selectedBank &&
    isValidAmount &&
    depositorName.trim().length > 0 &&
    depositorBank.trim().length > 0 &&
    paymentDate.trim().length > 0 &&
    paymentTime.trim().length > 0 &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (!isFormValid || !selectedBank || !termsAccepted) return;
    setIsSubmitting(true);
    try {
      // Format date and time: payment_date should be YYYY-MM-DD, payment_time HH:MM
      const dateStr = paymentDate; // Assuming YYYY-MM-DD format from input[type="date"]
      const timeStr = paymentTime; // Assuming HH:MM format from input[type="time"]
      
      const res = await servicesApi.submitBankFundingRequest({
        amount: amountNum,
        bank_paid_to: selectedBank.bank_name,
        account_number_paid_to: selectedBank.account_number,
        depositor_name: depositorName.trim(),
        depositor_bank: depositorBank.trim(),
        payment_date: dateStr,
        payment_time: timeStr,
      });

      const status = (res as { status?: string })?.status ?? '';
      const statusStr = String(status).toLowerCase();
      const isSuccess = statusStr === 'success' || statusStr === 'successful';
      const message = (res as { message?: string })?.message ?? '';
      const data = (res as { data?: Record<string, unknown> })?.data ?? {};
      const reference = (data?.reference ?? data?.transaction_reference ?? data?.id) != null
        ? String(data?.reference ?? data?.transaction_reference ?? data?.id)
        : 'N/A';

      if (isSuccess) {
        toast.success(message || 'Funding request submitted successfully.');
        // Show success modal or navigate
        const successMsg = `Your funding request has been submitted successfully. Your wallet will be credited once the payment is verified.\n\nReference: ${reference}`;
        alert(successMsg); // Could use a proper modal component
        // Reset form
        setHasMadeTransfer(false);
        setSelectedBank(null);
        setAmount('');
        setDepositorName('');
        setDepositorBank('');
        setPaymentDate('');
        setPaymentTime('');
        setTermsAccepted(false);
      } else {
        toast.error(message || 'Failed to submit funding request.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit funding request.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Show bank accounts
  if (!hasMadeTransfer) {
    return (
      <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
        <div className="max-w-xl mx-auto">
          <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
            <div className="absolute left-0">
              <BackButton fallbackTo="/dashboard/fund-wallet" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Manual Bank Funding</h1>
          </div>

          <div className="flex flex-col gap-6">
            {/* Instructions */}
            <p className="text-xs font-medium text-[var(--text-primary)] leading-relaxed">
              MAKE A TRANSFER TO ANY OF THE ACCOUNTS BELOW THEN FILL THE FORM BELOW IT.
            </p>

            {/* Bank accounts list */}
            {loadingBanks ? (
              <div className="flex justify-center py-8">
                <span className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin block" />
              </div>
            ) : adminBanks.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--text-muted)] rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                No bank accounts available. Please contact support.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {adminBanks.map((bank, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 shadow-sm"
                  >
                    <DetailRow label="Account Number" value={bank.account_number} isCopyable />
                    <DetailRow label="Bank Name" value={bank.bank_name} />
                    <DetailRow label="Account Name" value={bank.account_name} />
                  </div>
                ))}
              </div>
            )}

            {/* Important note */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2 mb-2">
                <FiInfo className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-amber-900">IMPORTANT NOTE:</span>
              </div>
              <ul className="text-xs text-amber-900 space-y-1 ml-7">
                <li>• Use your USERNAME as narration when making the transfer.</li>
                <li>• A convenience fee of ₦30 is deducted for amounts lesser than ₦2000.</li>
              </ul>
            </div>

            {/* I have made the transfer button */}
            <PayButton
              fullWidth
              text="I have made the transfer"
              onClick={() => setHasMadeTransfer(true)}
              disabled={adminBanks.length === 0}
            />

            {/* Cancel button */}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show form
  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/fund-wallet" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Bank Funding Form</h1>
        </div>

        <div className="flex flex-col gap-5">
          {/* Back to bank accounts */}
          <button
            type="button"
            onClick={() => setHasMadeTransfer(false)}
            className="flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors self-start"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to bank accounts
          </button>

          {/* Choose bank paid to */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Choose the bank you paid to:
            </label>
            <button
              type="button"
              onClick={() => setBankDrawerOpen(true)}
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              {selectedBank ? `${selectedBank.bank_name} - ${selectedBank.account_number}` : 'Select Bank'}
            </button>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Amount</label>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter amount"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <p className="text-xs text-[var(--text-muted)]">Minimum of ₦100</p>
            {amountNum > 0 && !isValidAmount && (
              <p className="text-xs text-[var(--error)]">Amount must be at least ₦100</p>
            )}
          </div>

          {/* Depositor Name */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Account Name Sent From / Depositor&apos;s Name
            </label>
            <input
              type="text"
              value={depositorName}
              onChange={(e) => setDepositorName(e.target.value)}
              placeholder="Enter your bank account name"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {/* Depositor Bank */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Bank money was transferred from
            </label>
            <input
              type="text"
              value={depositorBank}
              onChange={(e) => setDepositorBank(e.target.value)}
              placeholder="e.g GTBank, First Bank, OPay, Palmpay"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {/* Payment Date & Time */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Date & Time payment was made
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full py-3 px-4 pl-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="time"
                  value={paymentTime}
                  onChange={(e) => setPaymentTime(e.target.value)}
                  className="w-full py-3 px-4 pl-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>
          </div>

          {/* Terms toggle */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 rounded border-[var(--border-color)] shrink-0"
            />
            <label htmlFor="terms" className="text-sm text-[var(--text-secondary)] leading-relaxed cursor-pointer">
              I agree with the terms and conditions, and I have also checked my input values and found no errors.
            </label>
          </div>

          <div className="flex-1 min-h-[40px]" />

          {/* Submit button */}
          <PayButton
            fullWidth
            text={isSubmitting ? 'Submitting...' : 'Submit'}
            loading={isSubmitting}
            loadingText="Submitting..."
            disabled={!isFormValid || !termsAccepted}
            onClick={handleSubmit}
          />
        </div>
      </div>

      {/* Bank selection drawer */}
      <SelectionDrawer
        isOpen={bankDrawerOpen}
        onClose={() => setBankDrawerOpen(false)}
        title="Select Bank"
      >
        <ul className="space-y-1">
          {adminBanks.map((bank, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => {
                  setSelectedBank(bank);
                  setBankDrawerOpen(false);
                }}
                className={`w-full text-left py-3 px-4 rounded-lg border transition-colors ${
                  selectedBank?.account_number === bank.account_number
                    ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)] text-[var(--text-primary)]'
                }`}
              >
                <span className="block font-semibold text-sm">{bank.bank_name}</span>
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">{bank.account_number}</span>
              </button>
            </li>
          ))}
        </ul>
      </SelectionDrawer>
    </div>
  );
};

export default ManualBankFunding;
