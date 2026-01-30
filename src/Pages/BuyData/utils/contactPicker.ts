/**
 * Contact Picker API – uses real device contacts when supported.
 * Supported in Chrome on Android (secure context). Not supported in desktop Chrome, Safari, Firefox.
 */

export function isContactPickerSupported(): boolean {
  return 'contacts' in navigator && 'ContactsManager' in window;
}

interface ContactInfo {
  name?: string[];
  email?: string[];
  tel?: string[];
  address?: unknown[];
  icon?: Blob[];
}

interface ContactsManager {
  select(properties: ('name' | 'email' | 'tel' | 'address' | 'icon')[], options?: { multiple?: boolean }): Promise<ContactInfo[]>;
}

declare global {
  interface Navigator {
    contacts?: ContactsManager;
  }
}

/** Normalize to Nigerian 11-digit number (strip +234, 0, spaces) */
export function normalizeNigerianPhone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length >= 13) digits = '0' + digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(0, 11);
  return digits.slice(0, 11);
}

/**
 * Open device contact picker and return first selected contact's phone (and name).
 * Returns null if unsupported, user cancelled, or no tel.
 */
export async function pickContact(): Promise<{ name: string; phone: string } | null> {
  if (!isContactPickerSupported()) return null;
  const contactsManager = navigator.contacts;
  if (!contactsManager) return null;
  try {
    const contacts = await contactsManager.select(['name', 'tel'], { multiple: false });
    if (!contacts || contacts.length === 0) return null;
    const contact = contacts[0];
    const tel = contact.tel && contact.tel[0];
    if (!tel) return null;
    const phone = normalizeNigerianPhone(tel);
    if (phone.length < 11) return null;
    const name = contact.name && contact.name[0] ? contact.name[0] : 'Contact';
    return { name, phone };
  } catch {
    return null;
  }
}
