export const networksList = [
  { name: 'MTN', logo: '/img/mtn.png' },
  { name: 'AIRTEL', logo: '/img/airtel.png' },
  { name: 'GLO', logo: '/img/glo.png' },
  { name: '9MOBILE', logo: '/img/9mobile.png' },
];

export function getNetworkName(phoneNumber: string) {
  const pn = phoneNumber.replace(/\s+/g, '');
  const prefixes = {
    MTN: ['0702','0703','0707','0913','0901','0706','0704','0803','0806','0810','0813','0814','0816','0903','0906','0916'],
    AIRTEL: ['0911','0701','0708','0802','0808','0812','0902','0907','09015'],
    GLO: ['0705','0805','0807','0811','0815','0905','0915'],
    '9MOBILE': ['0809','0817','0818','0908','0909'],
  } as Record<string, string[]>;

  for (const key of Object.keys(prefixes)) {
    if (prefixes[key].some(p => pn.startsWith(p))) return key;
  }
  return 'MTN';
}

export function formatNigeriaNumberThree(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0,4)} ${digits.slice(4)}`;
  return `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}`;
}

export type Beneficiary = { id: string; phoneNumber: string; network?: string };

export async function getBeneficiariesByServiceType(_serviceType: string) {
  // Simple localStorage-backed stub to mirror Flutter secure storage behavior.
  try {
    const raw = localStorage.getItem('beneficiaries');
    if (!raw) return [] as Beneficiary[];
    const parsed = JSON.parse(raw) as Beneficiary[];
    return parsed;
  } catch (e) {
    console.error('Failed to load beneficiaries', e);
    return [] as Beneficiary[];
  }
}
