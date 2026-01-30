/**
 * Nigerian mobile prefixes by network (common prefixes).
 * Returns network name from first 4 digits of phone number.
 */
const PREFIX_NETWORK: Record<string, string> = {
  // MTN
  '0803': 'MTN',
  '0806': 'MTN',
  '0703': 'MTN',
  '0704': 'MTN',
  '0706': 'MTN',
  '0903': 'MTN',
  '0906': 'MTN',
  // GLO
  '0805': 'GLO',
  '0807': 'GLO',
  '0705': 'GLO',
  '0905': 'GLO',
  // AIRTEL
  '0802': 'AIRTEL',
  '0808': 'AIRTEL',
  '0708': 'AIRTEL',
  '0901': 'AIRTEL',
  '0902': 'AIRTEL',
  '0904': 'AIRTEL',
  '0907': 'AIRTEL',
  // 9MOBILE
  '0809': '9MOBILE',
  '0817': '9MOBILE',
  '0818': '9MOBILE',
  '0908': '9MOBILE',
  '0909': '9MOBILE',
};

export function getNetworkFromPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return null;
  const prefix = digits.slice(0, 4);
  return PREFIX_NETWORK[prefix] ?? null;
}
