import { useState } from 'react';
import { FiCheckCircle, FiInfo, FiPhone } from 'react-icons/fi';
import PayButton from '../../Components/PayButton';
import BackButton from '../../Components/BackButton';
import NetworkSelector from '../BuyAirtime/Components/NetworkSelector';

// Mock rates: network -> { rate (0-1), min, max }
const NETWORK_RATES: Record<string, { rate: number; min: number; max: number }> = {
  MTN: { rate: 0.8, min: 500, max: 5000 },
  GLO: { rate: 0.75, min: 500, max: 1000 },
  AIRTEL: { rate: 0.75, min: 500, max: 5000 },
  '9MOBILE': { rate: 0.75, min: 500, max: 5000 },
};

const getUssdCode = (network: string, phoneNumber: string, amount: string): string => {
  const n = network.toLowerCase();
  const num = phoneNumber.replace(/\D/g, '');
  if (n === 'mtn') return `*600*${num}*${amount}*pin#`;
  if (n === '9mobile') return `*223*pin*${amount}*${num}#`;
  if (n === 'glo') return `*131*${num}*${amount}*pin#`;
  if (n === 'airtel') return `*432*1*${num}*${amount}*pin#`;
  return `*600*${num}*${amount}*pin#`;
};

const InstructionItem = ({ num, text }: { num: string; text: string }) => (
  <div className="flex gap-2 mb-2">
    <span className="text-sm font-medium text-[var(--text-primary)] w-5 shrink-0">{num}</span>
    <span className="text-sm text-[var(--text-secondary)]">{text}</span>
  </div>
);

const TransferCodeRow = ({ network, code }: { network: string; code: string }) => (
  <div className="flex gap-2 mb-2">
    <span className="text-xs font-semibold text-[var(--text-primary)] w-16 shrink-0">{network}</span>
    <span className="text-xs font-mono text-[var(--text-secondary)] break-all">{code}</span>
  </div>
);

const AirtimeToCash = () => {
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ sendToNumber: string; ussdCode: string; ref: string } | null>(null);

  const rateConfig = selectedNetwork ? NETWORK_RATES[selectedNetwork] : null;
  const amountNum = amount ? parseFloat(amount) : 0;
  const convertedAmount = rateConfig && amountNum > 0 ? Math.floor(amountNum * rateConfig.rate) : 0;
  const isValidAmount =
    rateConfig &&
    amountNum >= rateConfig.min &&
    amountNum <= rateConfig.max;
  const canSubmit =
    hasReadInstructions &&
    phone.replace(/\D/g, '').length === 11 &&
    selectedNetwork &&
    isValidAmount &&
    !isSubmitting;

  const handleContinue = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const sendTo = '08091234567';
      setSuccessData({
        sendToNumber: sendTo,
        ussdCode: getUssdCode(selectedNetwork!, sendTo, amount),
        ref: 'ATF-' + Date.now(),
      });
    }, 1000);
  };

  const handleDone = () => {
    setSuccessData(null);
    setPhone('');
    setSelectedNetwork(null);
    setAmount('');
  };

  // Success view
  if (successData) {
    return (
      <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
        <div className="max-w-xl mx-auto">
          <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
            <div className="absolute left-0">
              <BackButton />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Airtime to Cash</h1>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center">
                <FiCheckCircle className="w-10 h-10 text-[var(--success)]" />
              </div>
            </div>
            <p className="text-center text-lg font-bold text-[var(--text-primary)]">Request Received</p>

            <div className="rounded-xl p-4 bg-[var(--accent-hover)] border border-[var(--accent-primary)]">
              <div className="flex items-center gap-2 mb-3">
                <FiInfo className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-sm font-bold text-[var(--text-primary)]">SEND AIRTIME TO:</span>
              </div>
              <div className="text-center py-3 px-4 rounded-lg bg-[var(--bg-card)]">
                <span className="text-2xl font-bold text-[var(--accent-primary)] tracking-wider">
                  {successData.sendToNumber}
                </span>
              </div>
            </div>

            <div className="rounded-xl p-4 bg-[var(--bg-card)] border border-[var(--border-color)]">
              <div className="flex items-center gap-2 mb-2">
                <FiPhone className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-xs font-bold text-[var(--text-primary)]">USSD CODE:</span>
              </div>
              <p className="text-sm font-mono font-semibold text-[var(--text-primary)] break-all">
                {successData.ussdCode}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Dial this code from your phone to send airtime
              </p>
            </div>

            <div className="rounded-xl p-4 bg-[var(--warning)]/10 border border-[var(--warning)]/30">
              <div className="flex items-center gap-2 mb-2">
                <FiInfo className="w-4 h-4 text-[var(--warning)]" />
                <span className="text-xs font-bold text-[var(--text-primary)]">IMPORTANT:</span>
              </div>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                <li>You must send the airtime within 20 minutes</li>
                <li>Your wallet will be credited once airtime is received</li>
                <li>You can find this number in your transaction history</li>
              </ul>
            </div>

            <div className="rounded-xl p-3 bg-[var(--bg-tertiary)]">
              <p className="text-xs text-[var(--text-muted)]">Reference:</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{successData.ref}</p>
            </div>

            <PayButton fullWidth text="Done" onClick={handleDone} />
          </div>
        </div>
      </div>
    );
  }

  // Instructions view
  if (!hasReadInstructions) {
    return (
      <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
        <div className="max-w-xl mx-auto">
          <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
            <div className="absolute left-0">
              <BackButton />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Airtime to Cash</h1>
          </div>

          <div className="flex flex-col gap-5">
            <PayButton
              fullWidth
              text="I understand, proceed to form"
              onClick={() => setHasReadInstructions(true)}
            />

            <p className="text-sm font-semibold text-[var(--text-primary)]">
              To convert airtime to cash:
            </p>
            <InstructionItem num="1." text="Fill the form below correctly for airtime to cash" />
            <InstructionItem
              num="2."
              text="The minimum amount is ₦500 and maximum is ₦5,000. Glo is ₦1,000 maximum per transfer."
            />
            <InstructionItem
              num="3."
              text="If you want to send pin, please load it on any MTN sim and transfer to us"
            />
            <InstructionItem
              num="4."
              text="You must send the airtime within 20 minutes or the transaction will be automatically cancelled"
            />

            <div className="rounded-xl p-4 bg-[var(--accent-hover)] border border-[var(--accent-primary)]">
              <p className="text-sm font-bold text-[var(--accent-primary)] mb-3">Transfer Codes:</p>
              <TransferCodeRow network="MTN" code="*600*recipient number*amount*pin#" />
              <TransferCodeRow network="9mobile" code="*223*pin*amount*number#" />
              <TransferCodeRow network="Glo" code="*131*recipient number*amount*pin#" />
              <TransferCodeRow network="Airtel" code="*432*1*number*amount*pin#" />
            </div>

            <div className="rounded-xl p-4 bg-[var(--bg-card)] border border-[var(--border-color)]">
              <p className="text-sm font-bold text-[var(--text-primary)] mb-3">Change Transfer Pin Codes:</p>
              <TransferCodeRow network="MTN" code="*600*default pin*new pin*new pin#" />
              <TransferCodeRow network="9mobile" code="*247*default pin*new pin#" />
              <TransferCodeRow network="Glo" code="*132*default pin*new pin*new pin#" />
              <TransferCodeRow network="Airtel" code="*432*3*1*oldpin*newpin*newpin#" />
            </div>

            <div className="rounded-xl p-4 bg-[var(--warning)]/10 border border-[var(--warning)]/30">
              <div className="flex items-center gap-2 mb-2">
                <FiInfo className="w-4 h-4 text-[var(--warning)]" />
                <span className="text-xs font-bold text-[var(--text-primary)]">IMPORTANT:</span>
              </div>
              <InstructionItem num="•" text="You must not send any amount different from the amount filled." />
              <InstructionItem num="•" text="We accept airtime transfer only. Any VTU sent to us will not be credited to your wallet." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="relative p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Airtime to Cash</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Enter Phone Number Sending From
            </label>
            <input
              type="tel"
              inputMode="numeric"
              value={
                phone.length === 11
                  ? phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
                  : phone
              }
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="0801 234 5678"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <p className="text-xs text-[var(--text-muted)]">Phone number with the airtime</p>
          </div>

          <NetworkSelector selectedNetwork={selectedNetwork} onSelect={setSelectedNetwork} />

          {rateConfig && (
            <p className="text-xs text-[var(--text-muted)] -mt-1">
              Min: ₦{rateConfig.min.toLocaleString()} - Max: ₦{rateConfig.max.toLocaleString()}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Amount</label>
            <input
              type="tel"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter amount"
              className="w-full py-3 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {convertedAmount > 0 && (
            <div className="rounded-xl p-4 bg-[var(--success)]/10 border border-[var(--success)]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">You will receive:</span>
                <span className="text-base font-bold text-[var(--success)]">
                  ₦{convertedAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {amountNum > 0 && rateConfig && !isValidAmount && (
            <p className="text-xs text-[var(--error)]">
              Amount must be between ₦{rateConfig.min.toLocaleString()} and ₦{rateConfig.max.toLocaleString()}
            </p>
          )}

          <div className="flex-1 min-h-[40px]" />

          <PayButton
            fullWidth
            text={isSubmitting ? 'Processing...' : 'Continue'}
            loading={isSubmitting}
            loadingText="Processing..."
            disabled={!canSubmit}
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default AirtimeToCash;
