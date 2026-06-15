/** Plan amounts from API are price per 1,000 units. */
export function calculateSocialTotal(pricePer1000: number, quantity: number): number {
  if (quantity <= 0 || pricePer1000 <= 0) return 0;
  return Math.round((pricePer1000 / 1000) * quantity * 100) / 100;
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
