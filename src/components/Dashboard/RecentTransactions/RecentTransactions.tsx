import './RecentTransactions.css';

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
    <div className="recent-transactions">
      <div className="widget-header">
        <h3 className="widget-title">Recent Transactions</h3>
        <div className="widget-header-right">
          <button 
            className="all-transactions-btn"
            onClick={() => {
              // Navigate to all transactions page
              console.log('Navigate to all transactions');
            }}
          >
            All Transactions
          </button>
        </div>
      </div>
      <div className="transactions-list">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-item">
            <div className="transaction-avatar">
              <div className="avatar-placeholder">
                {transaction.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="transaction-details">
              <div className="transaction-name">{transaction.name}</div>
              <div className="transaction-card">{transaction.card}</div>
            </div>
            <div className="transaction-amount">{transaction.amount}</div>
            <div className="transaction-time">{transaction.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;

