import { useState, useEffect } from 'react';
import { User, Trash2, Phone, Zap, Wifi, Tv, CreditCard } from 'lucide-react';
import BackButton from '../../Components/BackButton';
import {
  beneficiaryStorage,
  type Beneficiary,
  type BeneficiaryServiceType,
} from '../../../Parameters/types/beneficiary';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

const SERVICE_LABELS: Record<string, string> = {
  airtime: 'Airtime',
  data: 'Data',
  electricity: 'Electricity',
  cable_tv: 'Cable TV',
  betting: 'Betting',
  bank_transfer: 'Bank Transfer',
  internet: 'Internet',
  exam_pin: 'Exam Pin',
  recharge_pin: 'Recharge Pin',
};

function serviceIcon(serviceType: string) {
  const s = serviceType?.toLowerCase();
  if (s === 'electricity') return Zap;
  if (s === 'cable_tv' || s?.includes('cable')) return Tv;
  if (s === 'internet') return Wifi;
  if (s === 'bank_transfer') return CreditCard;
  return Phone;
}

function displayValue(b: Beneficiary): string {
  if (b.phoneNumber) return b.phoneNumber;
  if (b.meterNumber) return b.meterNumber;
  if (b.smartCardNumber) return b.smartCardNumber;
  if (b.accountNumber) return b.accountNumber;
  return b.name ?? '—';
}

export default function Beneficiaries() {
  const [all, setAll] = useState<Beneficiary[]>([]);
  const [filter, setFilter] = useState<BeneficiaryServiceType | 'all'>('all');

  useEffect(() => {
    setAll(beneficiaryStorage.getAll());
  }, []);

  const filtered =
    filter === 'all'
      ? all
      : all.filter((b) => (b.serviceType ?? '').toLowerCase() === filter.toLowerCase());

  const remove = (id: string) => {
    if (!window.confirm('Remove this beneficiary?')) return;
    beneficiaryStorage.remove(id);
    setAll(beneficiaryStorage.getAll());
  };

  return (
    <div className={pageClass}>
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center justify-center min-h-[2.5rem] mb-6">
          <div className="absolute left-0">
            <BackButton fallbackTo="/dashboard/profile" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Beneficiaries
          </h1>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4">
          People and accounts you’ve used for transactions. Tap to remove.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              filter === 'all'
                ? 'bg-[var(--accent-hover)] text-[var(--accent-primary)]'
                : 'bg-[var(--bg-input)] text-[var(--text-secondary)]'
            }`}
          >
            All
          </button>
          {Object.keys(SERVICE_LABELS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key as BeneficiaryServiceType)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
                filter === key
                  ? 'bg-[var(--accent-hover)] text-[var(--accent-primary)]'
                  : 'bg-[var(--bg-input)] text-[var(--text-secondary)]'
              }`}
            >
              {SERVICE_LABELS[key]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 text-center">
            <User className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">
              {filter === 'all'
                ? 'No beneficiaries saved yet.'
                : `No ${SERVICE_LABELS[filter] ?? filter} beneficiaries.`}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              They’ll appear here when you save a recipient during a transaction.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((b) => {
              const Icon = serviceIcon(b.serviceType);
              const label = SERVICE_LABELS[(b.serviceType ?? '').toLowerCase()] ?? b.serviceType ?? 'Other';
              return (
                <li
                  key={b.id}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[var(--text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {b.name || displayValue(b)}
                    </p>
                    {b.name && (
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {displayValue(b)}
                      </p>
                    )}
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                      {label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(b.id)}
                    className="p-2 rounded-lg text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
                    aria-label="Remove beneficiary"
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
