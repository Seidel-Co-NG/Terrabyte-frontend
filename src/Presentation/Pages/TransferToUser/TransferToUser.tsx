import { useState } from 'react';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import ConfirmPaymentModal from '../../Components/ConfirmPaymentModal';
import AmountSelector from './Components/AmountSelector';
import PhoneInput from './Components/PhoneInput';
import { servicesApi } from '../../../core/api/services.api';
import { isValidPhoneNumber } from './utils';

const TransferToUser = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [amountToPay, setAmountToPay] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Calculate charges (basic calculation - adjust based on your backend)
  const calculateAmountToPay = (amt: string) => {
    const amountValue = parseFloat(amt) || 0;
    if (amountValue > 0) {
      // Assuming a fixed charge or percentage - adjust based on your backend config
      const charge = 50; // Example: ₦50 fixed charge
      setAmountToPay(amountValue + charge);
    } else {
      setAmountToPay(0);
    } 
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    calculateAmountToPay(newAmount);
    setError(null);
  };

  const handlePhoneChange = (newPhone: string) => {
    setPhone(newPhone);
    setError(null);
  };

  const isValidPhone = phone.length === 11 && isValidPhoneNumber(phone);
  const amountNum = amount ? parseFloat(amount) : 0;
  const isValidAmount = amountNum >= 100; // Minimum amount ₦100
  const canSubmit = isValidPhone && isValidAmount && !isSubmitting;

  const handleOpenModal = () => {
    if (!canSubmit) {
      if (!isValidPhone) setError('Please enter a valid 11-digit phone number');
      if (!isValidAmount) setError('Minimum amount is ₦100');
      return;
    }
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async (pin: string) => {
    if (pin.length < 4) {
      setModalError('PIN must be 4 digits');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const response = await servicesApi.transferToUser({
        phone_number: phone,
        amount: amount,
        transaction_pin: pin,
      });

      // Check for success
      const isSuccess =
        response.status === 'success' ||
        response.data?.status === 'success' ||
        response.message?.toLowerCase().includes('success');

      if (isSuccess) {
        setIsModalOpen(false);
        // Show success alert/toast
        alert(
          `✅ Transfer Successful!\n\n₦${amountNum.toLocaleString()} transferred to ${phone}\n\nTransaction ID: ${
            response.data?.id || 'N/A'
          }`
        );
        // Reset form
        setPhone('');
        setAmount('');
        setAmountToPay(0);
        setModalError(null);
      } else {
        // Set error in modal
        setModalError(
          response.message ||
          response.data?.message ||
          'Transfer failed. Please try again.'
        );
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'An error occurred. Please try again.';

      // Display specific error messages
      if (
        errorMessage.toLowerCase().includes('pin') ||
        errorMessage.toLowerCase().includes('invalid')
      ) {
        setModalError('Invalid PIN. Please try again.');
      } else if (
        errorMessage.toLowerCase().includes('balance') ||
        errorMessage.toLowerCase().includes('insufficient')
      ) {
        setModalError('Insufficient balance. Please fund your wallet.');
      } else {
        setModalError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayPhone =
    phone.length > 0 ? `${phone.slice(0, 4)} ${phone.slice(4)}` : '';

  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Transfer to User
          </h1>
        </div>

        <div className="flex flex-col gap-5">
          {/* Phone Input */}
          <PhoneInput
            phone={phone}
            onPhoneChange={handlePhoneChange}
            error={error && error.includes('phone') ? error : undefined}
          />

          {/* Amount Selector */}
          <AmountSelector
            selectedAmount={amount}
            onAmountChange={handleAmountChange}
            amountToPay={amountToPay}
          />

          {error && !error.includes('phone') && !error.includes('amount') && (
            <p className="text-xs text-[var(--error)] bg-[var(--error)]/10 p-3 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex-1 min-h-[40px]" />

          {/* Transfer Button */}
          <PayButton
            fullWidth
            loading={isSubmitting}
            loadingText="Processing..."
            disabled={!canSubmit}
            onClick={handleOpenModal}
          >
            Transfer
          </PayButton>
        </div>
      </div>

      {/* Confirm Payment Modal */}
      <ConfirmPaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalError(null);
        }}
        networkName="User Transfer"
        product="Transfer to User"
        amount={amount}
        mobileNumber={displayPhone}
        amountToPay={amountToPay > 0 ? amountToPay.toFixed(2) : amount}
        onConfirmPayment={(pin) => handleConfirmPayment(pin)}
        isLoading={isSubmitting}
        error={modalError}
        onErrorClear={() => setModalError(null)}
      />
    </div>
  );
};

export default TransferToUser;
