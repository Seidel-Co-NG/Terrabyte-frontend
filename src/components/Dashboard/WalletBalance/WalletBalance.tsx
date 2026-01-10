import { FiCopy, FiCheck, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { useState } from 'react';
import './WalletBalance.css';

const WalletBalance = () => {
  const [copied, setCopied] = useState(false);

  const walletData = {
    walletBalance: '₦125,450.00',
    bonusBalance: '₦5,250.00',
    accountNumber: '0123456789',
    accountName: 'John Doe',
    bankName: 'Access Bank',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFundWallet = () => {
    console.log('Fund Wallet clicked');
    // Navigate to fund wallet page
  };

  const handleGenerateVirtualAccount = () => {
    console.log('Generate Virtual Account clicked');
    // Generate virtual account logic
  };

  return (
    <div className="wallet-balance">
      <div className="widget-header">
        <h3 className="widget-title">Wallet Balance</h3>
      </div>
      
      <div className="wallet-grid">
        {/* Balance Card */}
        <div className="balance-card">
          <div className="balance-section">
            <div className="balance-item">
              <div className="balance-label">Wallet Balance</div>
              <div className="balance-value wallet-balance-amount">{walletData.walletBalance}</div>
            </div>
            <div className="balance-item">
              <div className="balance-label">Bonus Balance</div>
              <div className="balance-value bonus-balance-amount">{walletData.bonusBalance}</div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn fund-wallet-btn" onClick={handleFundWallet}>
              <FiDollarSign className="btn-icon" />
              <span>Fund Wallet</span>
            </button>
            <button className="action-btn generate-account-btn" onClick={handleGenerateVirtualAccount}>
              <FiCreditCard className="btn-icon" />
              <span>Generate Virtual Account</span>
            </button>
          </div>
        </div>

        {/* Bank Details Card */}
        <div className="account-card">
          <div className="account-info-card">
            <div className="account-header">
              <h4 className="account-title">Bank Account Details</h4>
            </div>
            
            <div className="account-details">
              <div className="account-row">
                <span className="account-label">Account Number:</span>
                <div className="account-value-group">
                  <span className="account-value">{walletData.accountNumber}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(walletData.accountNumber)}
                    title="Copy account number"
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>

             

              <div className="account-row">
                <span className="account-label">Bank Name:</span>
                <span className="account-value">{walletData.bankName}</span>
              </div>
            </div>

            <div className="transfer-notice">
              <p className="notice-text">
                Make transfer to this account to fund your wallet, 1.5% charges apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;

