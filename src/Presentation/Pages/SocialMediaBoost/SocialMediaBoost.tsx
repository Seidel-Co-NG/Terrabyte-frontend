import { useEffect, useState } from 'react';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import TransactionSuccessfulModal from '../../Components/TransactionSuccessfulModal';
import LoadingOverlay from '../../Components/LoadingOverlay';
import MessageModal from '../../Components/MessageModal';
import { servicesApi } from '../../../core/api/services.api';
import { useAuthStore } from '../../../core/stores/auth.store';

type Category = {
  id: number | string;
  name: string;
  icon?: string | null;
  active?: boolean;
};

type Plan = {
  id: number | string;
  socialCategoryId?: number | string;
  name: string;
  description?: string | null;
  averageTime?: string | null;
  smartUserAmount: number;
  smartEarnerAmount: number;
  topUserAmount: number;
  minQuantity?: number;
  maxQuantity?: number;
  active?: boolean;
};

const SocialMediaBoost = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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

  const user = useAuthStore((s) => s.user);
  const userType = (user as any)?.user_type ?? (user as any)?.userType ?? 'smart_user';

  useEffect(() => {
    loadCategories();
    loadPlans();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await servicesApi.getSocialCategories();
      const cats = (res as any)?.data?.categories ?? (res as any)?.data ?? (res as any)?.categories ?? [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      console.error('Failed to load social categories', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const res = await servicesApi.getSocialPlans();
      const pls = (res as any)?.data?.plans ?? (res as any)?.data ?? (res as any)?.plans ?? [];
      const raw = Array.isArray(pls) ? pls : [];
      const normalized = raw.map((p: any) => ({
        id: p.id ?? p.plan_id,
        socialCategoryId: p.social_category_id ?? p.socialCategoryId ?? p.socialCategory ?? p.category_id,
        name: p.name ?? p.title ?? 'Service',
        description: p.description ?? p.desc ?? null,
        averageTime: p.average_time ?? p.averageTime ?? null,
        minQuantity: p.min_quantity ?? p.minQuantity ?? undefined,
        maxQuantity: p.max_quantity ?? p.maxQuantity ?? undefined,
        // Coerce numeric amounts safely
        smartUserAmount: Number(p.smart_user_amount ?? p.smartUserAmount ?? p.smart_user_amount ?? p.smartUserAmount ?? 0),
        smartEarnerAmount: Number(p.smart_earner_amount ?? p.smartEarnerAmount ?? 0),
        topUserAmount: Number(p.top_user_amount ?? p.topUserAmount ?? 0),
        active: p.active ?? undefined,
      }));
      setPlans(normalized);
    } catch (e) {
      console.error('Failed to load social plans', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getUnitPrice = (plan: Plan | null) => {
    if (!plan) return 0;
    if (userType === 'smart_earner') return Number(plan.smartEarnerAmount ?? 0);
    if (userType === 'top_user') return Number(plan.topUserAmount ?? 0);
    return Number(plan.smartUserAmount ?? 0);
  };

  const totalAmount = () => {
    if (!selectedPlan || quantity <= 0) return 0;
    return getUnitPrice(selectedPlan) * quantity;
  };

  const validate = (): string | null => {
    if (!selectedCategory) return 'Please select a category';
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
      // show error via popup
      setPopupMessage(err);
      setPopupType('error');
      setPopupOpen(true);
      return;
    }

    // if high amount, confirm via popup modal
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

      const status = (res as any)?.status ?? undefined;
      const message = (res as any)?.message ?? 'Operation completed';
      const data = (res as any)?.data ?? res;

      if (status && String(status).toLowerCase() === 'success') {
        setConfirmOpen(false);
        setPopupMessage(message ?? 'Order placed successfully');
        setPopupType('success');
        setPopupOpen(true);
        setLastTransactionId((data?.transaction_id ?? data?.id ?? data?.transactionId) as string | undefined);
        setSuccessMessage(message ?? 'Order placed successfully');
        setSuccessDescription(data?.description ?? undefined);
        setSuccessOpen(true);
        // reset
        setSelectedCategory(null);
        setSelectedPlan(null);
        setLink('');
        setQuantity(0);
      } else {
        // show error as popup or modal for pin
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

  const filteredPlans = selectedCategory ? plans.filter((p) => String(p.socialCategoryId ?? (p as any).social_category_id ?? (p as any).socialCategoryId) === String(selectedCategory.id)) : plans;

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0"><BackButton /></div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Social Media Boost</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Category</label>
            <div>
              <select
                value={selectedCategory ? String(selectedCategory.id) : ''}
                onChange={(e) => {
                  const id = e.target.value;
                  const cat = categories.find((c) => String(c.id) === id) ?? null;
                  setSelectedCategory(cat as Category | null);
                  setSelectedPlan(null);
                }}
                className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Social Media/Post Link</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Enter post link" className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Quantity</label>
            <input value={quantity > 0 ? String(quantity) : ''} onChange={(e) => setQuantity(Number(e.target.value || 0))} inputMode="numeric" placeholder="Quantity" className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Order Service</label>
            <div>
              <button onClick={() => { /* no-op */ }} className="w-full text-left py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">{selectedPlan ? `${selectedPlan.name} - ₦${getUnitPrice(selectedPlan).toFixed(2)}` : 'Select Service'}</button>
              <div className="mt-2 space-y-2">
                {filteredPlans.map((p) => (
                  <button key={String(p.id)} onClick={() => setSelectedPlan(p)} className={`w-full text-left p-3 rounded ${selectedPlan?.id === p.id ? 'ring-2 ring-[var(--accent-primary)] bg-[var(--accent-hover)]' : 'bg-[var(--bg-card)]'}`}>
                    <div className="flex justify-between"><div className="font-semibold">{p.name}</div><div className="font-medium">₦{getUnitPrice(p).toFixed(2)}</div></div>
                    {p.description && <div className="text-xs text-[var(--text-secondary)] mt-1">{p.description}</div>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedPlan && quantity > 0 && (
            <div className="p-4 bg-[var(--bg-card)] rounded">
              <div className="flex justify-between"><span className="font-medium">Quantity</span><span>{quantity}</span></div>
              <div className="flex justify-between"><span className="font-medium">Unit Price</span><span>₦{getUnitPrice(selectedPlan).toFixed(2)}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between text-[var(--accent-primary)] font-semibold"><span>Total Amount</span><span>₦{totalAmount().toFixed(2)}</span></div>
            </div>
          )}

          <div className="flex-1" />

          <div className="flex gap-3">
            <button onClick={handlePlaceOrder} disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-[var(--accent-primary)] text-white font-medium">Place Order Now</button>
          </div>
        </div>
      </div>

      <ConfirmPaymentModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setModalError(null); }}
        networkName={selectedCategory?.name ?? 'Social Media'}
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
          // open PIN modal after confirming
          setModalError(null);
          setConfirmOpen(true);
        }}
        title="Confirm High Amount"
        message={`High amount. Please confirm to proceed.`}
        type="info"
      />

      <LoadingOverlay isOpen={isLoading || isSubmitting} message={isLoading ? 'Loading...' : 'Processing...'} />

      <TransactionSuccessfulModal
        isOpen={successOpen}
        onClose={() => { setSuccessOpen(false); }}
        message={successMessage}
        description={successDescription}
        transactionId={lastTransactionId}
        amount={totalAmount().toFixed(2)}
        transactionType="Social Media Boost"
        date={new Date().toISOString().split('T')[0]}
        recipient={link}
      />
    </div>
  );
};

export default SocialMediaBoost;
