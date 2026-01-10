import { FiSearch, FiCopy, FiCheckCircle } from 'react-icons/fi';
import './ReferralList.css';

const ReferralList = () => {
  const referrals = [
    { 
      name: 'John Doe', 
      email: 'john.doe@example.com',
      referralCode: 'REF12345', 
      joinedDate: '2024-01-15', 
      totalEarned: '$450.00', 
      status: 'Active',
      avatar: 'JD'
    },
    { 
      name: 'Alice Smith', 
      email: 'alice.smith@example.com',
      referralCode: 'REF67890', 
      joinedDate: '2024-01-14', 
      totalEarned: '$320.50', 
      status: 'Active',
      avatar: 'AS'
    },
    { 
      name: 'Mayor Kelly', 
      email: 'mayor.kelly@example.com',
      referralCode: 'REF11223', 
      joinedDate: '2024-01-13', 
      totalEarned: '$189.99', 
      status: 'Inactive',
      avatar: 'MK'
    },
    { 
      name: 'Sarah Johnson', 
      email: 'sarah.j@example.com',
      referralCode: 'REF44556', 
      joinedDate: '2024-01-12', 
      totalEarned: '$250.00', 
      status: 'Active',
      avatar: 'SJ'
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
  };

  return (
    <div className="referral-list">
      <div className="widget-header">
        <div className="referral-search-container">
          <div className="referral-search">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search referrals..." className="referral-search-input" />
          </div>
          <button className="filters-btn">Filters</button>
        </div>
      </div>
      <div className="referral-table-container">
        <table className="referral-table">
          <thead>
            <tr>
              <th>Referral Name</th>
              <th>Referral Code</th>
              <th>Joined Date</th>
              <th>Total Earned</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral, index) => (
              <tr key={index}>
                <td>
                  <div className="referral-cell">
                    <div className="referral-avatar">{referral.avatar}</div>
                    <div className="referral-info">
                      <span className="referral-name">{referral.name}</span>
                      <span className="referral-email">{referral.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="referral-code-cell">
                    <span className="referral-code">{referral.referralCode}</span>
                    <button 
                      className="copy-code-btn" 
                      onClick={() => handleCopyCode(referral.referralCode)}
                      title="Copy referral code"
                    >
                      <FiCopy size={14} />
                    </button>
                  </div>
                </td>
                <td>{referral.joinedDate}</td>
                <td className="earned-amount">{referral.totalEarned}</td>
                <td>
                  <span className={`status-badge ${referral.status.toLowerCase()}`}>
                    {referral.status === 'Active' && <FiCheckCircle size={12} style={{ marginRight: '4px' }} />}
                    {referral.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn">View</button>
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

