/**
 * Beneficiary model aligned with Flutter BeneficiaryModel.
 * Used for saved beneficiaries (airtime, data, electricity, internet, etc.).
 */
export type BeneficiaryServiceType =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable_tv'
  | 'betting'
  | 'bank_transfer'
  | 'exam_pin'
  | 'recharge_pin'
  | 'internet';

export interface Beneficiary {
  id: string;
  name?: string;
  phoneNumber?: string;
  accountNumber?: string;
  smartCardNumber?: string;
  meterNumber?: string;
  serviceType: BeneficiaryServiceType | string;
  network?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'beneficiaries';

function loadAll(): Beneficiary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(list: Beneficiary[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save beneficiaries', e);
  }
}

export const beneficiaryStorage = {
  getAll(): Beneficiary[] {
    return loadAll();
  },

  getByServiceType(serviceType: string): Beneficiary[] {
    const list = loadAll();
    const key = serviceType.toLowerCase();
    return list.filter((b) => {
      const t = (b as Beneficiary & { service_type?: string }).serviceType ?? (b as Beneficiary & { service_type?: string }).service_type;
      if (t) return String(t).toLowerCase() === key;
      // Legacy: no serviceType → treat as airtime for backward compat
      return key === 'airtime' && (b.phoneNumber != null);
    });
  },

  save(beneficiary: Omit<Beneficiary, 'id'> & { id?: string }): Beneficiary {
    const list = loadAll();
    const id =
      beneficiary.id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const withId = { ...beneficiary, id } as Beneficiary;
    const idx = list.findIndex((b) => b.id === id);
    if (idx >= 0) list[idx] = withId;
    else list.unshift(withId);
    saveAll(list);
    return withId;
  },

  remove(id: string): void {
    saveAll(loadAll().filter((b) => b.id !== id));
  },

  clear(): void {
    saveAll([]);
  },
};
