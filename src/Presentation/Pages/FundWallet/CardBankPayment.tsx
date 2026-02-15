import { useState, useEffect } from 'react';
import { FiShield, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import { servicesApi } from '../../../core/api/services.api';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 1500, 2000, 2500];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 2500;

interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  min_amount: number;
  max_amount: number;
  charge_type: string;
  charge_value: number;
  is_available: boolean;
}

function getChargeDisplay(method: PaymentMethod): string {
  if (method.charge_type === 'percentage') {
    return `${method.charge_value.toFixed(1)}%`;
  }
  return `₦${method.charge_value.toFixed(0)}`;
}

const CardBankPayment = () => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isLoadingMethods, setIsLoadingMethods] = useState(true);

  const amountNum = amount ? parseFloat(amount) : 0;
  const isValidAmount = amountNum >= MIN_AMOUNT && amountNum <= MAX_AMOUNT;
  const canProceed = isValidAmount && selectedMethod != null && !isSubmitting;

  const fetchPaymentMethods = async () => {
    setIsLoadingMethods(true);
    try {
      const res = await servicesApi.getPaymentMethods();
      const data = res?.data as PaymentMethod[] | undefined;
      const methods = Array.isArray(data) ? data : [];
      const available = methods.filter((m) => m.is_available);
      setPaymentMethods(available);
      setSelectedMethod(available.length > 0 ? available[0] : null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load payment methods');
      setPaymentMethods([]);
      setSelectedMethod(null);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleProceed = async () => {
    if (!canProceed || !selectedMethod) return;
    if (amountNum < MIN_AMOUNT) {
      toast.error('Minimum amount is ₦100');
      return;
    }
    if (amountNum > MAX_AMOUNT) {
      toast.error('Maximum amount for card payment is ₦2,500. Use bank transfer for larger amounts.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await servicesApi.initFundingAtmPayment({
        payment_type: selectedMethod.id,
        real_amount: amountNum,
      });

      const status = (res as { status?: string })?.status;
      const message = (res as { message?: string })?.message;
      const data = (res as { data?: { paylink?: string } })?.data;
      const paylink = data?.paylink;

      if (status === 'successful' && paylink) {
        const a = document.createElement('a');
        a.href = paylink;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
        setAmount('');
        toast.success('Payment page opened. Complete payment in the new tab.');
      } else {
        toast.error(message || 'Failed to initialize payment');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to initialize payment';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/fund-wallet" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Bank & Card Payment</h1>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-6 px-2">
          Maximum amount for card payment is ₦2,500. Use bank transfer for larger amounts.
        </p>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Select Payment Gateway
          </label>
          {isLoadingMethods ? (
            <div className="flex items-center justify-center h-28 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <FiRefreshCw className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] gap-2">
              <FiCreditCard className="w-8 h-8 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-muted)]">No payment methods available</p>
              <button
                type="button"
                onClick={fetchPaymentMethods}
                className="text-sm font-medium text-[var(--accent-primary)] hover:underline"
              >
                Reload
              </button>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod?.id === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`shrink-0 w-24 p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-hover)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-primary)]/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                      <FiCreditCard className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{method.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">Fee: {getChargeDisplay(method)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Enter Amount (₦100 – ₦2,500)
            </label>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <input
                type="tel"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Amount"
                className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_AMOUNTS.map((a) => {
                  const isSelected = amount === String(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAmount(isSelected ? '' : String(a))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[var(--accent-hover)] text-[var(--accent-primary)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      ₦{a.toLocaleString()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <PayButton
            fullWidth
            text="Proceed to Payment"
            loading={isSubmitting}
            loadingText="Initializing payment..."
            disabled={!canProceed}
            onClick={handleProceed}
          />

          <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] text-xs">
            <FiShield className="w-4 h-4 shrink-0" />
            <span>Secure payment powered by trusted gateways</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBankPayment;
