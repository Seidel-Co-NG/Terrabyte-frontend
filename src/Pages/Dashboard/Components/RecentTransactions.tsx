interface Transaction {
  name: string;
  card: string;
  amount: string;
  time: string;
}

const RecentTransactions = () => {
  const transactions: Transaction[] = [
    { name: 'Jane Smith', card: 'MasterCard ****5678', amount: '$89.99', time: '09:45 AM' },
    { name: 'Emily Davis', card: 'Discover ****4321', amount: '$60.20', time: '01:50 PM' },
    { name: 'Sarah Lee', card: 'Visa ****2468', amount: '$130.40', time: '05:33 PM' },
    { name: 'Michael Brown', card: 'Visa ****9012', amount: '$245.50', time: '08:15 AM' },
    { name: 'David Wilson', card: 'MasterCard ****3456', amount: '$175.30', time: '11:30 AM' },
  ];

  return (
    <div className="flex flex-col h-full rounded-xl p-6 md:p-5 sm:p-4 bg-[var(--bg-card)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-4 mb-6">
        <h3 className="text-[1.1rem] md:text-base font-semibold text-[var(--text-primary)] m-0">Recent Transactions</h3>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => console.log('Navigate to all transactions')}
            className="py-2 px-4 bg-[var(--accent-hover)] border border-[var(--accent-primary)] rounded-md text-[var(--accent-primary)] text-[0.85rem] md:text-[0.75rem] font-medium cursor-pointer whitespace-nowrap transition-all hover:border-[var(--accent-secondary)] hover:text-[var(--text-primary)] hover:-translate-y-px hover:shadow-[0_2px_6px_var(--accent-hover)]"
          >
            All Transactions
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center gap-4 md:gap-3 p-4 md:p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg transition-colors hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)]"
          >
            <div className="shrink-0">
              <div className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[var(--text-primary)] font-semibold text-sm md:text-[0.8rem] shadow-[0_2px_8px_var(--accent-hover)]">
                {transaction.name.split(' ').map((n) => n[0]).join('')}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm md:text-[0.85rem] font-medium text-[var(--text-primary)] mb-1">{transaction.name}</div>
              <div className="text-[0.8rem] md:text-[0.75rem] text-[var(--text-tertiary)]">{transaction.card}</div>
            </div>
            <div className="text-[0.95rem] md:text-[0.9rem] font-semibold text-[var(--success)] ml-auto"> {transaction.amount}</div>
            <div className="text-[0.8rem] md:text-[0.75rem] text-[var(--text-muted)] whitespace-nowrap w-full sm:w-auto sm:mt-0 mt-1">{transaction.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
