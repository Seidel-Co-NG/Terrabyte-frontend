import { FiSearch, FiCopy, FiCheckCircle } from 'react-icons/fi';

const ReferralList = () => {
  const referrals = [
    { name: 'John Doe', email: 'john.doe@example.com', referralCode: 'REF12345', joinedDate: '2024-01-15', totalEarned: '$450.00', status: 'Active', avatar: 'JD' },
    { name: 'Alice Smith', email: 'alice.smith@example.com', referralCode: 'REF67890', joinedDate: '2024-01-14', totalEarned: '$320.50', status: 'Active', avatar: 'AS' },
    { name: 'Mayor Kelly', email: 'mayor.kelly@example.com', referralCode: 'REF11223', joinedDate: '2024-01-13', totalEarned: '$189.99', status: 'Inactive', avatar: 'MK' },
    { name: 'Sarah Johnson', email: 'sarah.j@example.com', referralCode: 'REF44556', joinedDate: '2024-01-12', totalEarned: '$250.00', status: 'Active', avatar: 'SJ' },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 mb-6">
        <div className="flex-1 relative flex items-center">
          <FiSearch className="absolute left-4 text-[var(--text-muted)] text-base pointer-events-none" />
          <input
            type="text"
            placeholder="Search referrals..."
            className="w-full py-3 px-4 pl-10 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:bg-[var(--bg-hover)]"
          />
        </div>
        <button type="button" className="py-3 px-6 bg-[var(--bg-hover)] border border-[var(--brand-primary)] rounded-lg text-[var(--brand-primary)] text-sm font-medium cursor-pointer whitespace-nowrap transition-colors hover:bg-[var(--brand-primary-lightest)] hover:border-[var(--brand-primary-dark)]">
          Filters
        </button>
      </div>
      <div className="mt-6 overflow-x-auto flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--bg-tertiary)]">
              <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Referral Name</th>
              <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Referral Code</th>
              <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide hidden sm:table-cell">Joined Date</th>
              <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Total Earned</th>
              <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Status</th>
              <th className="p-4 text-left text-[0.85rem] md:text-[0.75rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral, index) => (
              <tr key={index} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
                <td className="p-4 text-[var(--text-primary)] text-sm md:text-[0.85rem]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 md:w-8 md:h-8 shrink-0 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white font-semibold text-[0.8rem] md:text-[0.7rem]">
                      {referral.avatar}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-[var(--text-primary)] text-sm">{referral.name}</span>
                      <span className="text-[0.75rem] text-[var(--text-muted)] hidden md:inline">{referral.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[var(--text-primary)] text-sm md:text-[0.85rem]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[0.85rem] md:text-[0.75rem]">{referral.referralCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(referral.referralCode)}
                      title="Copy referral code"
                      className="p-1 rounded bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--brand-primary)] hidden md:flex"
                    >
                      <FiCopy size={14} />
                    </button>
                  </div>
                </td>
                <td className="p-4 text-[var(--text-primary)] text-sm md:text-[0.85rem] hidden sm:table-cell">{referral.joinedDate}</td>
                <td className="p-4 font-semibold text-[var(--success)] text-sm">{referral.totalEarned}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center py-1 px-3 rounded-xl text-xs font-medium ${
                      referral.status === 'Active' ? 'bg-emerald-500/20 text-[var(--success)]' : 'bg-gray-500/20 text-[var(--text-muted)]'
                    }`}
                  >
                    {referral.status === 'Active' && <FiCheckCircle size={12} className="mr-1 shrink-0" />}
                    {referral.status}
                  </span>
                </td>
                <td className="p-4">
                  <button type="button" className="py-2 px-4 md:py-1.5 md:px-3 bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] text-[0.85rem] md:text-[0.75rem] cursor-pointer transition-colors hover:bg-[var(--brand-primary-lightest)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralList;
