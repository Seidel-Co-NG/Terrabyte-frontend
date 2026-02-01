import { useState, useMemo, useEffect } from 'react';
import BackButton from '../../Components/BackButton';
import PayButton from '../../Components/PayButton';
import SelectionDrawer from '../../Components/SelectionDrawer';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import { useAuthStore } from '../../../core/stores/auth.store';
import { servicesApi } from '../../../core/api';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

interface BankOption {
  name: string;
  code: string;
}

const FALLBACK_BANKS: BankOption[] = [
  { name: 'Access Bank', code: '044' },
  { name: 'GTBank', code: '058' },
  { name: 'First Bank', code: '011' },
  { name: 'UBA', code: '033' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Ecobank', code: '050' },
  { name: 'Stanbic IBTC', code: '221' },
  { name: 'Union Bank', code: '032' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Unity Bank', code: '215' },
  { name: 'Heritage Bank', code: '030' },
];

const TransferToBank = () => {
  const user = useAuthStore((s) => s.user);
  const [banks, setBanks] = useState<BankOption[]>(FALLBACK_BANKS);
  const [bankDrawerOpen, setBankDrawerOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [validatingAccount, setValidatingAccount] = useState(false);

  useEffect(() => {
    servicesApi.getBanks().then((res) => {
      const data = res?.data as { banks?: BankOption[] } | BankOption[] | undefined;
      const list = Array.isArray(data) ? data : data?.banks;
      if (Array.isArray(list) && list.length > 0 && list.every((b) => b && typeof b.name === 'string' && typeof b.code === 'string')) {
        setBanks(list as BankOption[]);
      }
    }).catch(() => {});
  }, []);

  const filteredBanks = useMemo(() => {
    if (!bankSearch.trim()) return banks;
    const q = bankSearch.toLowerCase();
    return banks.filter((b) => b.name.toLowerCase().includes(q));
  }, [bankSearch, banks]);

  const handleSelectBank = (bank: BankOption) => {
    setSelectedBank(bank.name);
    setSelectedBankCode(bank.code);
    setBankDrawerOpen(false);
    setBankSearch('');
    setAccountName('');
  };

  const handleAccountNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(raw);
    setAccountName('');
    if (raw.length === 10 && selectedBankCode) {
      setValidatingAccount(true);
      try {
        const res = await servicesApi.validateAccount({ account_number: raw, bank_code: selectedBankCode });
        const name = (res?.data as { account_name?: string })?.account_name;
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
  const isValidAmount = amountNum > 0;
  const canSubmit = !!selectedBank && !!selectedBankCode && accountNumber.length === 10 && isValidAmount && !isSubmitting;

  const handlePay = () => {
    if (!canSubmit) return;
    setPinModalOpen(true);
  };

  const handleConfirmPay = async (transactionPin: string) => {
    await servicesApi.bankTransfer({
      account_number: accountNumber,
      bank_code: selectedBankCode!,
      account_name: accountName || 'Account Holder',
      amount: String(amountNum),
      narration: 'Transfer',
      transaction_pin: transactionPin,
    });
    toast.success(`Transfer of ₦${amountNum.toLocaleString()} successful.`);
    setSelectedBank(null);
    setSelectedBankCode(null);
    setAccountNumber('');
    setAccountName('');
    setAmount('');
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
            {validatingAccount && (
              <p className="text-xs text-[var(--text-muted)]">Validating account...</p>
            )}
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

          {/* Account Name (read-only) */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Account Name</label>
            <input
              type="text"
              readOnly
              value={accountName}
              placeholder="Resolved from bank & account number"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] opacity-90"
            />
          </div>

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
              <p className="text-xs text-[var(--error)]">Please enter a valid amount greater than 0</p>
            )}
          </div>

          <div className="flex-1 min-h-[40px]" />

          <PayButton
            fullWidth
            loading={isSubmitting}
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
            {filteredBanks.map((bank) => (
              <li key={bank.code}>
                <button
                  type="button"
                  onClick={() => handleSelectBank(bank)}
                  className="w-full py-3 px-4 rounded-lg text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  {bank.name}
                </button>
              </li>
            ))}
            {filteredBanks.length === 0 && (
              <li className="py-4 text-center text-sm text-[var(--text-muted)]">No bank found</li>
            )}
          </ul>
        </div>
      </SelectionDrawer>
      <ConfirmPaymentModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="Confirm Bank Transfer"
        subtitle={`Amount: ₦${amountNum.toLocaleString()} • ${accountName || accountNumber}`}
        onConfirm={handleConfirmPay}
      />
    </div>
  );
};

export default TransferToBank;
