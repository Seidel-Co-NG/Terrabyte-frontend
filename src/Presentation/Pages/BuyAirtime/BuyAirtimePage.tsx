import React, { useEffect, useRef, useState } from 'react';
import AmountSelector from './AmountSelector';
import { formatNigeriaNumberThree, getBeneficiariesByServiceType, getNetworkName } from './utils';
import type { Beneficiary } from './utils';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import TransactionSuccessfulModal from '../../Components/TransactionSuccessfulModal';
import MessageModal from '../../Components/MessageModal';
import LoadingOverlay from '../../Components/LoadingOverlay';
import { servicesApi } from '../../../core/api';
import { useNavigate } from 'react-router-dom';
import DataNetworkSelector from '../BuyData/Components/DataNetworkSelector';

export default function BuyAirtimePage() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [phoneSuggestions, setPhoneSuggestions] = useState<Beneficiary[]>([]);
  const [amountValidationError, setAmountValidationError] = useState('');
  const [amountToPay, setAmountToPay] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageTitle, setMessageTitle] = useState<string | undefined>(undefined);
  const [messageText, setMessageText] = useState<string | undefined>(undefined);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [modalError, setModalError] = useState<string | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const list = await getBeneficiariesByServiceType('airtime');
      setBeneficiaries(list);
    })();
  }, []);

  useEffect(() => {
    // autoset network when phone reaches prefix length
    const pn = phone.replace(/\s+/g, '');
    if (pn.length >= 4 && pn.length <= 5) {
      const net = getNetworkName(pn);
      setSelectedNetwork(net);
    }
  }, [phone]);

  function updatePhoneSuggestions(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return setPhoneSuggestions([]);
    if (trimmed.replace(/\D/g, '').length >= 11) return setPhoneSuggestions([]);
    const suggestions = beneficiaries.filter((b) => {
      const formatted = formatNigeriaNumberThree(b.phoneNumber);
      return formatted.includes(trimmed) || b.phoneNumber.includes(trimmed);
    }).slice(0,5);
    setPhoneSuggestions(suggestions);
  }

  function selectBeneficiary(b: Beneficiary) {
    setPhone(b.phoneNumber);
    setSelectedNetwork(b.network ?? getNetworkName(b.phoneNumber));
    setPhoneSuggestions([]);
  }

  function handleAmountSelected(a: string) {
    setAmount(a);
    // naive calculation: use amount as number, apply no discounts here but mimic amountToPay
    const amt = Number(a) || 0;
    setAmountToPay(amt);
    // validation: positive and check balance (balance stub omitted)
    if (amt <= 0) setAmountValidationError('Please enter a valid amount greater than ₦0');
    else setAmountValidationError('');
  }

  function validate(): string | null {
    const pn = phone.replace(/\D/g, '');
    if (!selectedNetwork) return 'Please select a network';
    if (pn.length !== 11) return 'Phone number must be 11 digits';
    if (!amount) return 'Please enter an amount';
    if (amountValidationError) return amountValidationError;
    return null;
  }

  async function handleContinue() {
    const err = validate();
    if (err) return alert(err);

    const amtNum = Number(amount) || 0;

    if (amtNum > 3000) {
      const ok = window.confirm('High amount. Please confirm to proceed.');
      if (!ok) return;
    }

    setConfirmOpen(true);
  }

  async function submitWithPin(pin: string, saveAsBeneficiary: boolean) {
    if (pin.length < 4) {
      setModalError('PIN must be 4 digits');
      return;
    }

    setModalError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        network_name: selectedNetwork ?? '',
        phone_number: phone,
        amount,
        transaction_pin: pin,
      };
      const res = await servicesApi.buyAirtime(payload as any);

      // API may return { status: 'success'|'error', message, data }
      const status = (res as any)?.status ?? undefined;
      const message = (res as any)?.message ?? 'Operation completed';
      const data = (res as any)?.data ?? (res as any);

      if (status && String(status).toLowerCase() === 'success') {
        setConfirmOpen(false);
        const transactionId = data?.transaction_id ?? data?.transactionId ?? data?.id ?? undefined;
        setLastTransactionId(transactionId ?? undefined);
        setSuccessMessage(message ?? `Airtime purchase of ₦${amount} to ${displayPhone} was successful.`);
        setSuccessOpen(true);

        // save beneficiary if requested and if successful
        if (saveAsBeneficiary) {
          try {
            const raw = localStorage.getItem('beneficiaries');
            const list = raw ? JSON.parse(raw) : [];
            list.unshift({ id: (data?.transaction_id ?? `local-${Date.now()}`), phoneNumber: phone, network: selectedNetwork });
            localStorage.setItem('beneficiaries', JSON.stringify(list));
          } catch (e) {
            console.error('Failed to save beneficiary', e);
          }
        }

        // reset values on success
        setPhone('');
        setAmount('');
        setSelectedNetwork(null);
        setAmountToPay(0);
        setModalError(null);
      } else {
        // Show error in modal
        const errorMsg = message ?? 'Airtime purchase failed. Please try again.';
        
        // Parse specific error messages
        if (errorMsg.toLowerCase().includes('pin') || errorMsg.toLowerCase().includes('invalid')) {
          setModalError('Invalid PIN. Please try again.');
        } else if (errorMsg.toLowerCase().includes('balance') || errorMsg.toLowerCase().includes('insufficient')) {
          setModalError('Insufficient balance. Please fund your wallet.');
        } else {
          setModalError(errorMsg);
        }
      }
    } catch (err: any) {
      console.error('Buy airtime error', err);
      
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to complete airtime purchase';
      
      // Parse specific error messages
      if (errorMsg.toLowerCase().includes('pin') || errorMsg.toLowerCase().includes('invalid')) {
        setModalError('Invalid PIN. Please try again.');
      } else if (errorMsg.toLowerCase().includes('balance') || errorMsg.toLowerCase().includes('insufficient')) {
        setModalError('Insufficient balance. Please fund your wallet.');
      } else {
        setModalError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  };

  const displayPhone = formatPhone(phone);
  const isValidPhone = phone.replace(/\D/g, '').length === 11;
  const canSubmit = isValidPhone && !!selectedNetwork && !!amount && !amountValidationError;

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Buy Airtime</h1>
        </div>

        <div className="flex flex-col gap-5">
          {/* Recent beneficiaries */}
          {beneficiaries.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="text-sm font-semibold text-[var(--text-secondary)]">Recent Beneficiaries</div>
              <div className="flex gap-3 overflow-x-auto">
                {beneficiaries.map((b) => (
                  <button key={b.id} onClick={() => selectBeneficiary(b)} className={`flex flex-col items-center gap-1 p-2 rounded ${selectedNetwork === (b.network ?? getNetworkName(b.phoneNumber)) ? 'ring-2 ring-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'}`}>
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center">📱</div>
                    <span className="text-xs font-bold">{formatNigeriaNumberThree(b.phoneNumber)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Phone input */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                inputMode="numeric"
                maxLength={14}
                value={displayPhone}
                onChange={(e) => { const raw = e.target.value.replace(/\D/g,'').slice(0,11); setPhone(raw); updatePhoneSuggestions(raw); }}
                placeholder="0801 234 5678"
                className="w-full py-3 px-4 pr-28 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={() => alert('Select contact not implemented')}
                className="absolute right-2 top-1/2 -translate-y-1/2 py-2 px-3 rounded-lg text-sm font-medium text-[var(--accent-primary)] hover:bg-[var(--accent-hover)]"
              >
                Select Contact
              </button>
            </div>
            {phone.length > 0 && phone.length !== 11 && (
              <p className="text-xs text-[var(--error)]">Phone number must be 11 digits</p>
            )}
          </div>

          {/* Network selector */}
          <DataNetworkSelector selectedNetwork={selectedNetwork} onSelect={setSelectedNetwork} />

          {/* Amount selector */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Amount</label>
            <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
              <AmountSelector selectedAmount={amount} onAmountSelected={handleAmountSelected} amountToPay={amountToPay} />
              {amountValidationError && <div className="mt-2 text-sm text-[var(--error)]">{amountValidationError}</div>}
            </div>
          </div>

          <div className="flex-1 min-h-[40px]" />

          <PayButton fullWidth loading={false} loadingText="Processing..." disabled={!canSubmit} onClick={handleContinue} />
        </div>
      </div>

      <ConfirmPaymentModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setModalError(null);
        }}
        networkName={selectedNetwork ?? ''}
        product="Airtime"
        amount={amount}
        mobileNumber={displayPhone}
        amountToPay={amountToPay}
        onConfirmPayment={(pin, save) => submitWithPin(pin, save)}
        isLoading={isSubmitting}
        error={modalError}
        onErrorClear={() => setModalError(null)}
      />

      <LoadingOverlay isOpen={isSubmitting} message="Processing payment..." />

      <MessageModal
        isOpen={messageOpen}
        onClose={() => setMessageOpen(false)}
        title={messageTitle}
        message={messageText}
        type={messageType}
      />

      <TransactionSuccessfulModal
        isOpen={successOpen}
        onClose={() => { setSuccessOpen(false); navigate('/dashboard'); }}
        message={successMessage}
        transactionId={lastTransactionId}
        amount={amount}
      />
    </div>
  );
}
