import { useState } from 'react';
import { FiCheckCircle, FiInfo, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import VerifyEmailModal from '../../Components/VerifyEmailModal';
import { useVerifyEmailModal } from '../../../Parameters/utils/useVerifyEmailModal';
import { couponApi } from '../../../core/api/coupon.api';

const CouponFunding = () => {
  const [code, setCode] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [validatedAmount, setValidatedAmount] = useState<number | null>(null);
  const [validatedDescription, setValidatedDescription] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const { showModal, message, handleError, closeModal } = useVerifyEmailModal();

  const handleValidate = async () => {
    if (!code.trim()) return;
    setIsValidating(true);
    try {
      const res = await couponApi.validate(code);
      const ok = res?.status === 'successful' || res?.status === 'success';
      if (ok && res?.data) {
        setIsValidated(true);
        setValidatedAmount(res.data.amount ?? 0);
        setValidatedDescription(res.data.description ?? '');
      } else {
        toast.error(res?.message ?? 'Invalid coupon');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Validation failed';
      if (!handleError(msg)) toast.error(msg);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRedeem = () => {
    if (!validatedAmount || !code.trim()) return;
    setPinModalOpen(true);
  };

  const handleConfirmRedeem = async (transactionPin: string) => {
    if (!validatedAmount || !code.trim()) return;
    const res = await couponApi.redeem(code, transactionPin);
    const ok = res?.status === 'successful' || res?.status === 'success';
    if (ok) {
      toast.success(`Coupon redeemed! ₦${validatedAmount.toLocaleString()} has been added to your wallet.`);
      setCode('');
      setIsValidated(false);
      setValidatedAmount(null);
      setValidatedDescription(null);
    } else {
      const msg = res?.message ?? 'Redeem failed';
      if (!handleError(msg)) throw new Error(msg);
    }
  };

  const handleUseDifferent = () => {
    setCode('');
    setIsValidated(false);
    setValidatedAmount(null);
    setValidatedDescription(null);
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/fund-wallet" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Coupon Funding</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Enter your coupon code to fund your wallet
            </label>
            <div className="relative">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Coupon Code"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] uppercase"
                disabled={isValidated}
              />
            </div>
          </div>

          {!isValidated ? (
            <PayButton
              fullWidth
              text="Validate Coupon"
              loading={isValidating}
              loadingText="Validating coupon..."
              disabled={!code.trim() || isValidating}
              onClick={handleValidate}
            />
          ) : (
            <>
              <div className="p-4 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30">
                <div className="flex items-center gap-2 mb-3">
                  <FiCheckCircle className="w-5 h-5 text-[var(--success)]" />
                  <span className="text-sm font-bold text-[var(--success)]">Coupon Valid!</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Amount</span>
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    ₦{validatedAmount?.toLocaleString()}
                  </span>
                </div>
                {validatedDescription && (
                  <div className="flex justify-between items-start gap-2 pt-2 border-t border-[var(--success)]/20">
                    <span className="text-sm text-[var(--text-secondary)] shrink-0">Description</span>
                    <span className="text-sm text-[var(--text-primary)] text-right">{validatedDescription}</span>
                  </div>
                )}
              </div>

              <PayButton
                fullWidth
                text="Redeem Coupon"
                loading={false}
                disabled={false}
                onClick={handleRedeem}
              />

              <button
                type="button"
                onClick={handleUseDifferent}
                className="w-full py-2 text-sm font-medium text-[var(--accent-primary)] hover:underline"
              >
                Use a different coupon
              </button>
            </>
          )}

          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <div className="flex items-center gap-2 mb-2">
              <FiInfo className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm font-bold text-[var(--text-primary)]">How it works</span>
            </div>
            <ul className="text-sm text-[var(--text-secondary)] space-y-1 list-decimal list-inside">
              <li>Enter your coupon code</li>
              <li>Validate to see the coupon amount</li>
              <li>Redeem to add funds to your wallet</li>
            </ul>
          </div>
        </div>
      </div>

      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm coupon redemption"
        subtitle={`Amount: ₦${validatedAmount?.toLocaleString() ?? '0'}`}
        onConfirm={handleConfirmRedeem}
      />

      <VerifyEmailModal
        isOpen={showModal}
        onClose={closeModal}
        message={message}
        title="Email not verified"
        redirectToVerifyPath="/verify-otp?redirect=/dashboard/fund-wallet/coupon"
      />
    </div>
  );
};

export default CouponFunding;
