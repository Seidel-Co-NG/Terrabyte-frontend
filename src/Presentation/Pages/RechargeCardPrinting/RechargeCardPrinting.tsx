import { useState } from 'react';
import toast from 'react-hot-toast';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import PinReceiptModal from '../../Components/PinReceiptModal';
import { servicesApi } from '../../../core/api';

const NETWORK_LOGOS: Record<string, string> = {
  MTN: '/img/mtn.png',
  GLO: '/img/glo.png',
  AIRTEL: '/img/airtel.png',
  '9MOBILE': '/img/9mobile.png',
};

const RECHARGE_TYPES: { name: string; amounts: number[] }[] = [
  { name: 'MTN', amounts: [100, 200, 400, 500, 1000] },
  { name: 'AIRTEL', amounts: [100, 200, 500, 1000] },
  { name: 'GLO', amounts: [100, 200, 500, 1000] },
  { name: '9MOBILE', amounts: [100, 200, 500, 1000] },
];

const RechargeCardPrinting = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    transactionReference: string;
    nameOnCard: string;
    pins: { serialNumber: string; pin: string; amount: number; network?: string }[];
  } | null>(null);

  const selectedConfig = RECHARGE_TYPES.find((t) => t.name === selectedNetwork);
  const amountNum = amount ? parseFloat(amount) : 0;
  const qty = quantity ? parseInt(quantity, 10) : 0;
  const validQty = Number.isNaN(qty) ? 0 : Math.max(0, qty);
  const totalAmount = amountNum * validQty;

  const isFormValid =
    !!selectedNetwork &&
    amountNum > 0 &&
    nameOnCard.trim().length > 0 &&
    validQty >= 1 &&
    !isSubmitting;

  const handleContinue = () => {
    if (!isFormValid) return;
    setPinModalOpen(true);
  };

  const handleConfirmPay = async (transactionPin: string) => {
    if (!selectedNetwork || amountNum <= 0 || validQty < 1) return;
    setIsSubmitting(true);
    try {
      const res = await servicesApi.buyRechargePins({
        pin_name: selectedNetwork,
        name_on_card: nameOnCard.trim(),
        quantity: validQty,
        amount: amountNum,
        transaction_pin: transactionPin,
      });

      const status = (res as { status?: string })?.status ?? '';
      const statusStr = String(status).toLowerCase();
      const isSuccess = statusStr === 'success' || statusStr === 'successful';
      const data = (res as { data?: Record<string, unknown> })?.data ?? {};
      const message = (res as { message?: string })?.message ?? '';

      if (isSuccess) {
        setPinModalOpen(false);
        const transactionReference =
          (data?.transaction_reference as string) ??
          (data?.id != null ? String(data.id) : 'N/A');

        const mapRawToPin = (p: Record<string, unknown>): { serialNumber: string; pin: string; amount: number; network?: string } => ({
          serialNumber: String(p?.serial_number ?? p?.serialNumber ?? ''),
          pin: String(p?.pin ?? ''),
          amount: Number(p?.amount ?? amountNum),
          network: selectedNetwork ?? undefined,
        });

        let pins: { serialNumber: string; pin: string; amount: number; network?: string }[] = [];
        const providerResponse = data?.provider_source_response;
        if (typeof providerResponse === 'string') {
          try {
            const parsed = JSON.parse(providerResponse);
            const list = parsed?.pins ?? parsed?.content?.pins ?? (Array.isArray(parsed) ? parsed : []);
            pins = (list as Record<string, unknown>[]).map((p) => mapRawToPin(p));
          } catch {
            // ignore
          }
        } else if (Array.isArray(providerResponse)) {
          pins = (providerResponse as Record<string, unknown>[]).map((p) => mapRawToPin(p));
        }

        // If no pins in response, try getPinsByBuyId (matches Flutter getPinsByBuyId endpoint)
        const buyId = (data?.buy_id ?? data?.id ?? data?.transaction_id) != null
          ? String(data?.buy_id ?? data?.id ?? data?.transaction_id)
          : null;
        if (pins.length === 0 && buyId) {
          try {
            const pinsRes = await servicesApi.getPinsByBuyId(buyId);
            const pinsData = (pinsRes as { data?: unknown })?.data;
            let list: unknown[] = [];
            if (Array.isArray(pinsData)) list = pinsData;
            else if (pinsData && typeof pinsData === 'object' && 'pins' in (pinsData as object)) {
              list = ((pinsData as Record<string, unknown>).pins as unknown[]) ?? [];
            }
            pins = (list as Record<string, unknown>[]).map((p) => mapRawToPin(p));
          } catch {
            // keep pins empty
          }
        }

        setReceiptData({
          transactionReference,
          nameOnCard: nameOnCard.trim(),
          pins,
        });
        setReceiptOpen(true);
        toast.success(message || `Recharge pin purchase successful. Ref: ${transactionReference}`);

        setSelectedNetwork(null);
        setAmount('');
        setNameOnCard('');
        setQuantity('');
      } else {
        const errorMsg = message || 'Recharge pin purchase failed. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete purchase.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Recharge Card Printing</h1>
        </div>

        <div className="flex flex-col gap-5">
          {/* Select Network */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Select Network
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {RECHARGE_TYPES.map((rechargeType) => {
                const networkName = rechargeType.name;
                const isSelected = selectedNetwork === networkName;
                const logo = NETWORK_LOGOS[networkName];
                return (
                  <button
                    key={networkName}
                    type="button"
                    onClick={() => {
                      setSelectedNetwork(networkName);
                      setAmount('');
                    }}
                    className={`flex flex-col items-center justify-center min-h-[72px] sm:min-h-[80px] py-2 sm:py-3 rounded-xl border-2 transition-all duration-200
                      ${isSelected
                        ? 'bg-[var(--accent-hover)] border-[var(--accent-primary)]'
                        : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
                      }`}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2 shrink-0 p-0.5">
                      {logo ? (
                        <img
                          src={logo}
                          alt={networkName}
                          className="w-full h-full object-contain rounded-full"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[var(--text-muted)]">
                          {networkName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-bold truncate max-w-full px-0.5 ${
                        isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {networkName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Amount */}
          {selectedNetwork && selectedConfig && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Select Amount
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedConfig.amounts.map((amt) => {
                  const isSelected = amount === String(amt);
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(String(amt))}
                      className={`px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all
                        ${isSelected
                          ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                          : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                        }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Name on Card */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Name on Card
            </label>
            <input
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              placeholder="Enter name"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Quantity
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter quantity"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <p className="text-xs text-[var(--text-muted)]">Minimum quantity: 1</p>
          </div>

          {/* Total Amount */}
          {amountNum > 0 && validQty >= 1 && (
            <div className="rounded-xl p-4 bg-[var(--success)]/10 border border-[var(--success)]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-[var(--success)]">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-[40px]" />

          <PayButton
            fullWidth
            text={isSubmitting ? 'Processing...' : 'Continue'}
            loading={isSubmitting}
            loadingText="Processing..."
            disabled={!isFormValid}
            onClick={handleContinue}
          />
        </div>
      </div>

      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Recharge Pin Purchase"
        subtitle={
          selectedNetwork && amount && validQty >= 1
            ? `${selectedNetwork} • ${validQty} x ₦${amountNum.toLocaleString()} = ₦${totalAmount.toLocaleString()}`
            : undefined
        }
        onConfirm={handleConfirmPay}
      />

      {receiptData && (
        <PinReceiptModal
          isOpen={receiptOpen}
          onClose={() => {
            setReceiptOpen(false);
            setReceiptData(null);
          }}
          transactionReference={receiptData.transactionReference}
          nameOnCard={receiptData.nameOnCard}
          pins={receiptData.pins}
        />
      )}
    </div>
  );
};

export default RechargeCardPrinting;
