import { useEffect, useMemo, useState } from 'react';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import TransactionSuccessfulModal from '../../Components/TransactionSuccessfulModal';
import LoadingOverlay from '../../Components/LoadingOverlay';
import MessageModal from '../../Components/MessageModal';
import { servicesApi } from '../../../core/api/services.api';
import { isApiSuccessResponse } from '../../../core/utils/apiResponse';
import { calculateSocialTotal, formatNaira } from '../../../core/utils/socialPricing';
import { useAuthStore } from '../../../core/stores/auth.store';

type Plan = {
  id: number | string;
  name: string;
  description?: string | null;
  category?: string | null;
  averageTime?: string | null;
  smartUserAmount: number;
  smartEarnerAmount: number;
  topUserAmount: number;
  minQuantity?: number;
  maxQuantity?: number;
  refill?: boolean;
  cancel?: boolean;
  dripfeed?: boolean;
  active?: boolean;
};

const SocialMediaBoost = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [popupType, setPopupType] = useState<'info' | 'success' | 'error'>('info');
  const [highAmountOpen, setHighAmountOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [successDescription, setSuccessDescription] = useState<string | undefined>(undefined);
  const [lastTransactionId, setLastTransactionId] = useState<string | undefined>(undefined);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const user = useAuthStore((s) => s.user);
  const userType = (user as any)?.user_type ?? (user as any)?.userType ?? 'smart_user';

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const res = await servicesApi.getSocialPlans();
      const pls = (res as any)?.data?.plans ?? (res as any)?.data ?? (res as any)?.plans ?? [];
      const raw = Array.isArray(pls) ? pls : [];
      const normalized = raw.map((p: any) => ({
        id: p.id ?? p.plan_id,
        name: p.name ?? p.title ?? 'Service',
        description: p.description ?? p.desc ?? null,
        category: p.category ?? p.description ?? null,
        averageTime: p.average_time ?? p.averageTime ?? null,
        minQuantity: p.min_quantity ?? p.minQuantity ?? undefined,
        maxQuantity: p.max_quantity ?? p.maxQuantity ?? undefined,
        smartUserAmount: Number(p.smart_user_amount ?? p.smartUserAmount ?? 0),
        smartEarnerAmount: Number(p.smart_earner_amount ?? p.smartEarnerAmount ?? 0),
        topUserAmount: Number(p.top_user_amount ?? p.topUserAmount ?? 0),
        refill: p.refill ?? false,
        cancel: p.cancel ?? false,
        dripfeed: p.dripfeed ?? false,
        active: p.active ?? undefined,
      }));
      setPlans(normalized);
    } catch (e) {
      console.error('Failed to load social plans', e);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    plans.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [plans]);

  const filteredPlans = useMemo(() => {
    if (!selectedCategory) return plans;
    return plans.filter((p) => p.category === selectedCategory);
  }, [plans, selectedCategory]);

  const getPricePer1000 = (plan: Plan | null) => {
    if (!plan) return 0;
    if (userType === 'smart_earner') return Number(plan.smartEarnerAmount ?? 0);
    if (userType === 'top_user') return Number(plan.topUserAmount ?? 0);
    return Number(plan.smartUserAmount ?? 0);
  };

  const totalAmount = () => {
    if (!selectedPlan || quantity <= 0) return 0;
    return calculateSocialTotal(getPricePer1000(selectedPlan), quantity);
  };

  const validate = (): string | null => {
    if (!selectedPlan) return 'Please select a service/plan';
    if (!link.trim()) return 'Please enter the social media/post link';
    if (!quantity || quantity <= 0) return 'Please enter a valid quantity';
    if (selectedPlan?.minQuantity && quantity < selectedPlan.minQuantity) return `Minimum quantity is ${selectedPlan.minQuantity}`;
    if (selectedPlan?.maxQuantity && quantity > selectedPlan.maxQuantity) return `Maximum quantity is ${selectedPlan.maxQuantity}`;
    return null;
  };

  const handlePlaceOrder = () => {
    const err = validate();
    if (err) {
      setPopupMessage(err);
      setPopupType('error');
      setPopupOpen(true);
      return;
    }

    if (totalAmount() > 3000) {
      setHighAmountOpen(true);
      return;
    }

    setModalError(null);
    setConfirmOpen(true);
  };

  const submitWithPin = async (pin: string, _saveAsBeneficiary: boolean) => {
    if (pin.length < 4) {
      setModalError('PIN must be 4 digits');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const payload = {
        plan_id: selectedPlan?.id,
        link: link.trim(),
        quantity,
        transaction_pin: pin,
      };

      const res = await servicesApi.buySocial(payload as any);
      const message = (res as any)?.message ?? 'Operation completed';
      const data = (res as any)?.data ?? res;
      const charged = Number(data?.amount ?? totalAmount());

      if (isApiSuccessResponse(res)) {
        setConfirmOpen(false);
        setPaidAmount(charged);
        setPopupMessage(message ?? 'Order placed successfully');
        setPopupType('success');
        setPopupOpen(true);
        setLastTransactionId((data?.transaction_id ?? data?.id ?? data?.transactionId) as string | undefined);
        setSuccessMessage(message ?? 'Order placed successfully');
        setSuccessDescription(data?.description ?? undefined);
        setSuccessOpen(true);
        setSelectedCategory('');
        setSelectedPlan(null);
        setLink('');
        setQuantity(0);
      } else {
        const errMsg = message ?? 'Order failed. Please try again.';
        if (String(errMsg).toLowerCase().includes('pin') || String(errMsg).toLowerCase().includes('invalid')) {
          setModalError('Invalid PIN. Please try again.');
        } else if (String(errMsg).toLowerCase().includes('balance') || String(errMsg).toLowerCase().includes('insufficient')) {
          setPopupMessage('Insufficient balance. Please fund your wallet.');
          setPopupType('error');
          setPopupOpen(true);
        } else {
          setPopupMessage(errMsg);
          setPopupType('error');
          setPopupOpen(true);
        }
      }
    } catch (err: any) {
      console.error('Buy social error', err);
      const message = err?.response?.data?.message || err?.message || 'Failed to place order';
      if (String(message).toLowerCase().includes('pin') || String(message).toLowerCase().includes('invalid')) {
        setModalError('Invalid PIN. Please try again.');
      } else if (String(message).toLowerCase().includes('balance') || String(message).toLowerCase().includes('insufficient')) {
        setPopupMessage('Insufficient balance. Please fund your wallet.');
        setPopupType('error');
        setPopupOpen(true);
      } else {
        setPopupMessage(message);
        setPopupType('error');
        setPopupOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const planBadges = (plan: Plan) => {
    const badges: string[] = [];
    if (plan.refill) badges.push('Refill');
    if (plan.cancel) badges.push('Cancel');
    if (plan.dripfeed) badges.push('Dripfeed');
    return badges;
  };

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0"><BackButton /></div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Social Media Boost</h1>
        </div>

        <div className="flex flex-col gap-5">
          {categories.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedPlan(null);
                }}
                className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Social Media/Post Link</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Enter post link" className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Quantity</label>
            <input value={quantity > 0 ? String(quantity) : ''} onChange={(e) => setQuantity(Number(e.target.value || 0))} inputMode="numeric" placeholder="Quantity" className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm" />
            {selectedPlan && (
              <p className="text-xs text-[var(--text-secondary)]">
                Min: {selectedPlan.minQuantity ?? 1} — Max: {selectedPlan.maxQuantity ?? '∞'}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Order Service</label>
            <p className="text-xs text-[var(--text-secondary)]">Prices shown are per 1,000 units</p>
            <div>
              <button type="button" className="w-full text-left py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                {selectedPlan
                  ? `${selectedPlan.name} — ${formatNaira(getPricePer1000(selectedPlan))} / 1k`
                  : 'Select Service'}
              </button>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                {filteredPlans.map((p) => {
                  const badges = planBadges(p);
                  return (
                    <button
                      key={String(p.id)}
                      type="button"
                      onClick={() => setSelectedPlan(p)}
                      className={`w-full text-left p-3 rounded ${selectedPlan?.id === p.id ? 'ring-2 ring-[var(--accent-primary)] bg-[var(--accent-hover)]' : 'bg-[var(--bg-card)]'}`}
                    >
                      <div className="flex justify-between gap-3">
                        <div className="font-semibold">{p.name}</div>
                        <div className="font-medium whitespace-nowrap">{formatNaira(getPricePer1000(p))} / 1k</div>
                      </div>
                      {p.averageTime && <div className="text-xs text-[var(--text-secondary)] mt-1">Avg. time: {p.averageTime}</div>}
                      {badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {badges.map((b) => (
                            <span key={b} className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">{b}</span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {selectedPlan && quantity > 0 && (
            <div className="p-4 bg-[var(--bg-card)] rounded">
              <div className="flex justify-between"><span className="font-medium">Quantity</span><span>{quantity}</span></div>
              <div className="flex justify-between"><span className="font-medium">Price per 1,000</span><span>{formatNaira(getPricePer1000(selectedPlan))}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between text-[var(--accent-primary)] font-semibold"><span>Total Amount</span><span>{formatNaira(totalAmount())}</span></div>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={handlePlaceOrder} disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-[var(--accent-primary)] text-white font-medium">Place Order Now</button>
          </div>
        </div>
      </div>

      <ConfirmPaymentModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setModalError(null); }}
        networkName={selectedPlan?.category ?? selectedPlan?.name ?? 'Social Media'}
        product={selectedPlan?.name ?? 'Social Media Boost'}
        amount={String(totalAmount().toFixed(2))}
        mobileNumber={link}
        amountToPay={String(totalAmount().toFixed(2))}
        onConfirmPayment={(pin) => submitWithPin(pin, false)}
        isLoading={isSubmitting}
        error={modalError}
        onErrorClear={() => setModalError(null)}
      />

      <MessageModal isOpen={popupOpen} onClose={() => setPopupOpen(false)} title={popupType === 'error' ? 'Error' : popupType === 'success' ? 'Success' : 'Notice'} message={popupMessage} type={popupType} />

      <MessageModal
        isOpen={highAmountOpen}
        onClose={() => {
          setHighAmountOpen(false);
          setModalError(null);
          setConfirmOpen(true);
        }}
        title="Confirm High Amount"
        message="High amount. Please confirm to proceed."
        type="info"
      />

      <LoadingOverlay isOpen={isLoading || isSubmitting} message={isLoading ? 'Loading...' : 'Processing...'} />

      <TransactionSuccessfulModal
        isOpen={successOpen}
        onClose={() => { setSuccessOpen(false); }}
        message={successMessage}
        description={successDescription}
        transactionId={lastTransactionId}
        amount={(paidAmount || totalAmount()).toFixed(2)}
        transactionType="Social Media Boost"
        date={new Date().toISOString().split('T')[0]}
        recipient={link}
      />
    </div>
  );
};

export default SocialMediaBoost;
