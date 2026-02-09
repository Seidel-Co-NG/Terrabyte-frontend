import { Link } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import { FiCreditCard, FiRefreshCw, FiTag, FiDollarSign } from 'react-icons/fi';

const OPTIONS = [
  {
    title: 'Monnify',
    description: 'Pay with card via Monnify (₦100 – ₦2,500)',
    icon: <FiCreditCard className="w-8 h-8" />,
    link: '/dashboard/fund-wallet/monnify',
  },
  {
    title: 'Paystack',
    description: 'Pay with card via Paystack (₦100 – ₦2,500)',
    icon: <FiCreditCard className="w-8 h-8" />,
    link: '/dashboard/fund-wallet/paystack',
  },
  {
    title: 'Automated Bank Transfer',
    description: 'Transfer to your reserved account',
    icon: <FiRefreshCw className="w-8 h-8" />,
    link: '/dashboard/fund-wallet/automated-transfer',
  },
  {
    title: 'Manual Bank Funding',
    description: 'Submit proof of bank transfer',
    icon: <span className="text-2xl font-bold">₦</span>,
    link: '/dashboard/fund-wallet/manual-bank',
  },
  {
    title: 'Coupon',
    description: 'Redeem a coupon code',
    icon: <FiTag className="w-8 h-8" />,
    link: '/dashboard/fund-wallet/coupon',
  },
];

const FundWallet = () => {
  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Fund Wallet</h1>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-6 text-center">
          Choose how you want to add money to your wallet
        </p>

        <div className="flex flex-col gap-4">
          {OPTIONS.map((opt) => (
            <Link
              key={opt.link}
              to={opt.link}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-colors"
            >
              <div className="shrink-0 w-14 h-14 rounded-xl bg-[var(--accent-hover)] text-[var(--accent-primary)] flex items-center justify-center">
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-[var(--text-primary)] mb-0.5">{opt.title}</h2>
                <p className="text-sm text-[var(--text-tertiary)]">{opt.description}</p>
              </div>
              <span className="text-[var(--accent-primary)] shrink-0 text-sm font-medium">Select</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundWallet;
