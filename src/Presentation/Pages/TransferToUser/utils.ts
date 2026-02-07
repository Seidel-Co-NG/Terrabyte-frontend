/**
 * Utility functions for TransferToUser
 */

// Preset amounts for quick selection
export const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

// Format phone number for display (Nigerian format)
export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

// Check if phone number is valid (Nigerian format - 11 digits starting with 0)
export const isValidPhoneNumber = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('0');
};
