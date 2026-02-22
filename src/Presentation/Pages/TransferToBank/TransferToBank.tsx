import { useState, useMemo, useEffect } from 'react';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import SelectionDrawer from '../../Components/SelectionDrawer';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import { useAuthStore } from '../../../core/stores/auth.store';
import { servicesApi } from '../../../core/api';
import { userApi } from '../../../core/api/user.api';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

interface BankOption {
  id: number;
  name: string;
  code: string;
}

interface BankTransferChargeConfig {
  charge: number;
  percentage: number;
}

const TransferToBank = () => {
  const user = useAuthStore((s) => s.user);
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [bankDrawerOpen, setBankDrawerOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [validatingAccount, setValidatingAccount] = useState(false);
  const [chargeConfig, setChargeConfig] = useState<BankTransferChargeConfig | null>(null);

  useEffect(() => {
    userApi.getConfigurations().then((res) => {
      const data = res?.data as { Charge_Percentage_Discount_Switch?: Array<{ service_name?: string; smart_user_charge?: number; smart_earner_charge?: number; top_user_charge?: number; smart_user_percentage?: number; smart_earner_percentage?: number; top_user_percentage?: number }> } | undefined;
      const list = data?.Charge_Percentage_Discount_Switch ?? [];
      const bankTransfer = list.find((s) => (s.service_name ?? '').toLowerCase() === 'bank_transfer');
      if (bankTransfer) {
        const userType = (user?.user_type ?? 'smart_user').toLowerCase();
        const charge =
          userType === 'top_user'
            ? Number(bankTransfer.top_user_charge ?? 0)
            : userType === 'smart_earner'
              ? Number(bankTransfer.smart_earner_charge ?? 0)
              : Number(bankTransfer.smart_user_charge ?? 0);
        const percentage =
          userType === 'top_user'
            ? Number(bankTransfer.top_user_percentage ?? 0)
            : userType === 'smart_earner'
              ? Number(bankTransfer.smart_earner_percentage ?? 0)
              : Number(bankTransfer.smart_user_percentage ?? 0);
        setChargeConfig({ charge, percentage });
      }
    }).catch(() => {});
  }, [user?.user_type]);

  useEffect(() => {
    setBanksLoading(true);
    servicesApi
      .getBanks()
      .then((res) => {
        const body = res as { status?: string; data?: unknown } | undefined;
        const list = Array.isArray(body?.data) ? body.data : [];
        const valid = list.every(
          (b: unknown) =>
            b &&
            typeof b === 'object' &&
            (b as { id?: unknown }).id != null &&
            typeof (b as { bank_name?: string }).bank_name === 'string' &&
            typeof (b as { bank_code?: string }).bank_code === 'string'
        );
        if (valid && list.length > 0) {
          setBanks(
            list.map((b: { id?: number; bank_name?: string; bank_code?: string }) => ({
              id: Number(b.id),
              name: b.bank_name ?? '',
              code: b.bank_code ?? '',
            }))
          );
        }
      })
      .catch(() => {
        toast.error('Failed to load banks');
      })
      .finally(() => {
        setBanksLoading(false);
      });
  }, []);

  const filteredBanks = useMemo(() => {
    if (!bankSearch.trim()) return banks;
    const q = bankSearch.toLowerCase();
    return banks.filter((b) => b.name.toLowerCase().includes(q));
  }, [bankSearch, banks]);

  const handleSelectBank = async (bank: BankOption) => {
    setSelectedBank(bank.name);
    setSelectedBankCode(bank.code);
    setSelectedBankId(bank.id);
    setBankDrawerOpen(false);
    setBankSearch('');
    setAccountName('');

    // If account number already has 10 digits, re-validate name for new bank
    if (accountNumber.length >= 10 && bank.code) {
      setValidatingAccount(true);
      try {
        const res = await servicesApi.validateAccount({
          account_number: accountNumber,
          bank_code: bank.code,
        });
        const body = res?.data as { data?: { account_name?: string }; account_name?: string } | undefined;
        const name = body?.data?.account_name ?? body?.account_name;
        if (name) setAccountName(name);
      } catch {
        setAccountName('');
      } finally {
        setValidatingAccount(false);
      }
    }
  };

  const handleAccountNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(raw);
    setAccountName('');
    if (raw.length === 10 && selectedBankCode) {
      setValidatingAccount(true);
      try {
        const res = await servicesApi.validateAccount({ account_number: raw, bank_code: selectedBankCode });
        const body = res?.data as { data?: { account_name?: string }; account_name?: string } | undefined;
        const name = body?.data?.account_name ?? body?.account_name;
        if (name) setAccountName(name);
      } catch {
        setAccountName('');
      } finally {
        setValidatingAccount(false);
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setAmount(raw);
  };

  const amountNum = amount ? parseFloat(amount) : 0;
  const isValidAmount = amountNum >= 100;

  const { chargeAmount, amountToPay } = useMemo(() => {
    if (!chargeConfig || amountNum < 100) return { chargeAmount: 0, amountToPay: amountNum };
    const charge = chargeConfig.charge;
    let paid = Math.round((amountNum + charge) * 100) / 100;
    if (chargeConfig.percentage > 0) {
      const fee = Math.round(paid * (chargeConfig.percentage / 100));
      paid = Math.round((paid + fee) * 100) / 100;
    }
    return { chargeAmount: charge, amountToPay: paid };
  }, [amountNum, chargeConfig]);

  const canSubmit =
    !!selectedBank &&
    selectedBankId != null &&
    selectedBankId > 0 &&
    accountNumber.length === 10 &&
    !!accountName.trim() &&
    isValidAmount;

  const handlePay = () => {
    if (!canSubmit) return;
    setPinModalOpen(true);
  };

  const handleConfirmPay = async (transactionPin: string) => {
    try {
      await servicesApi.bankTransfer({
        account_number: accountNumber,
        bank_id: selectedBankId!,
        account_name: accountName.trim(),
        amount: String(amountNum),
        narration: 'Transfer',
        transaction_pin: transactionPin,
      });
      setPinModalOpen(false);
      toast.success(`Transfer of ₦${amountNum.toLocaleString()} successful.`);
      setSelectedBank(null);
      setSelectedBankCode(null);
      setSelectedBankId(null);
      setAccountNumber('');
      setAccountName('');
      setAmount('');
    } catch (err: unknown) {
      setPinModalOpen(false);
      const msg = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String((err.response.data as { message?: string }).message)
        : 'Transfer failed';
      toast.error(msg);
    }
  };

  const balance = user?.wallet ?? '0.00';
  const balanceDisplay = typeof balance === 'string' && balance.includes('₦') ? balance : `₦${Number(balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Transfer to Bank</h1>
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-2">
          You can only transfer to a bank account carrying your full name. Contact Support for any issue.
        </p>

        <div className="flex flex-col gap-5">
          {/* Select Bank */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Select Bank</label>
            <button
              type="button"
              onClick={() => setBankDrawerOpen(true)}
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] hover:border-[var(--accent-hover)] transition-colors"
            >
              {selectedBank || 'Choose bank'}
            </button>
          </div>

          {/* Account Number */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Account Number</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="0123456789"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            {accountNumber.length > 0 && accountNumber.length !== 10 && (
              <p className="text-xs text-[var(--error)]">Account number must be 10 digits</p>
            )}
          </div>

          {/* Account Name: show only when validating (shimmer) or when we have a name */}
          {(validatingAccount || accountName.trim()) && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Account Name</label>
              {validatingAccount ? (
                <div className="w-full min-h-[48px] py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center gap-3">
                  <span className="inline-block h-5 w-5 shrink-0 rounded-full border-2 border-[var(--border-color)] border-t-[var(--accent-primary)] animate-spin" aria-hidden />
                  <span className="text-sm text-[var(--text-muted)]">Validating account...</span>
                  <div className="flex-1 max-w-[140px] h-4 rounded bg-[var(--text-muted)]/20 animate-pulse" />
                </div>
              ) : (
                <input
                  type="text"
                  readOnly
                  value={accountName}
                  placeholder="Resolved from bank & account number"
                  className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] opacity-90"
                />
              )}
            </div>
          )}

          {/* Amount */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Enter Amount</label>
              <span className="text-xs text-[var(--text-muted)]">Balance: {balanceDisplay}</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            {amountNum > 0 && !isValidAmount && (
              <p className="text-xs text-[var(--error)]">Minimum transfer amount is ₦100</p>
            )}
            {amountNum >= 100 && (chargeAmount > 0 || amountToPay > amountNum) && (
              <div className="mt-2 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                {chargeAmount > 0 && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    Charge: ₦{chargeAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </p>
                )}
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Amount to pay: ₦{amountToPay.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[40px]" />

          <PayButton
            fullWidth
            loading={false}
            loadingText="Processing..."
            disabled={!canSubmit}
            onClick={handlePay}
          >
            Pay
          </PayButton>
        </div>
      </div>

      <SelectionDrawer
        isOpen={bankDrawerOpen}
        onClose={() => {
          setBankDrawerOpen(false);
          setBankSearch('');
        }}
        title="Select Bank"
      >
        <div className="flex flex-col gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <input
              type="text"
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              placeholder="Search bank"
              className="w-full py-2.5 pl-9 pr-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
          <ul className="max-h-[280px] overflow-y-auto space-y-1 -mx-1">
            {banksLoading ? (
              <li className="py-8 text-center text-sm text-[var(--text-muted)]">Loading banks...</li>
            ) : filteredBanks.length === 0 ? (
              <li className="py-8 text-center text-sm text-[var(--text-muted)]">
                {banks.length === 0 ? 'No banks available. Try again later.' : 'No banks match your search.'}
              </li>
            ) : (
              filteredBanks.map((bank) => (
              <li key={`${bank.id}-${bank.code}`}>
                <button
                  type="button"
                  onClick={() => handleSelectBank(bank)}
                  className="w-full py-3 px-4 rounded-lg text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  {bank.name}
                </button>
              </li>
            )))}
          </ul>
        </div>
      </SelectionDrawer>
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Bank Transfer"
        subtitle={
          amountToPay > amountNum
            ? `Amount to pay: ₦${amountToPay.toLocaleString('en-NG', { minimumFractionDigits: 2 })} • ${accountName || accountNumber}`
            : `Amount: ₦${amountNum.toLocaleString()} • ${accountName || accountNumber}`
        }
        onConfirm={handleConfirmPay}
      />
    </div>
  );
};

export default TransferToBank;
