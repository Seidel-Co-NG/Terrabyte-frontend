/**
 * Contact Picker API – uses real device contacts when supported.
 * Supported in Chrome on Android (secure context). Not supported in desktop Chrome, Safari, Firefox.
 * 
 * This is the web standard API for accessing device contacts, similar to how
 * Flutter uses flutter_native_contact_picker for native apps.
 */

export function isContactPickerSupported(): boolean {
  // Check if Contact Picker API is available
  // Requires HTTPS (secure context) and Chrome on Android
  return (
    typeof navigator !== 'undefined' &&
    'contacts' in navigator &&
    typeof window !== 'undefined' &&
    'ContactsManager' in window
  );
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
  // Handle international format: +234 801 234 5678 -> 08012345678
  if (digits.startsWith('234') && digits.length >= 13) {
    digits = '0' + digits.slice(3);
  }
  // Ensure it starts with 0 and is 11 digits
  if (digits.startsWith('0')) {
    digits = digits.slice(0, 11);
  }
  return digits.slice(0, 11);
}

export interface PickContactResult {
  name: string;
  phone: string;
}

export interface PickContactError {
  type: 'unsupported' | 'permission_denied' | 'no_contact' | 'no_phone' | 'invalid_phone' | 'cancelled' | 'unknown';
  message: string;
}

/**
 * Open device contact picker and return first selected contact's phone (and name).
 * Similar to Flutter's getPhoneNumberFromContacts function.
 * 
 * @returns Contact info with name and phone, or null if cancelled/unsupported
 * @throws PickContactError if there's an error (not user cancellation)
 */
export async function pickContact(): Promise<PickContactResult | null> {
  // Check if Contact Picker API is supported
  if (!isContactPickerSupported()) {
    const error: PickContactError = {
      type: 'unsupported',
      message: 'Contact picker is not supported in this browser. Please use Chrome on Android or enter the number manually.',
    };
    throw error;
  }

  const contactsManager = navigator.contacts;
  if (!contactsManager) {
    const error: PickContactError = {
      type: 'unsupported',
      message: 'Contact picker is not available. Please enter the number manually.',
    };
    throw error;
  }

  try {
    // Request contact selection (similar to Flutter's contactPicker.selectContact())
    const contacts = await contactsManager.select(['name', 'tel'], { multiple: false });
    
    // User cancelled or no contact selected
    if (!contacts || contacts.length === 0) {
      return null; // User cancelled - return null (not an error)
    }

    const contact = contacts[0];
    
    // Check if contact has phone number
    if (!contact.tel || !contact.tel[0]) {
      const error: PickContactError = {
        type: 'no_phone',
        message: 'Selected contact does not have a phone number.',
      };
      throw error;
    }

    // Normalize phone number (similar to Flutter's formatNigeriaNumberThree)
    const phone = normalizeNigerianPhone(contact.tel[0]);
    
    // Validate phone number length (Nigerian numbers are 11 digits)
    if (phone.length < 11) {
      const error: PickContactError = {
        type: 'invalid_phone',
        message: 'Selected contact has an invalid phone number. Please enter the number manually.',
      };
      throw error;
    }

    // Extract contact name (similar to Flutter's contact.name)
    const name = contact.name && contact.name[0] ? contact.name[0] : 'Contact';

    return { name, phone };
  } catch (error) {
    // If it's already a PickContactError, re-throw it
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }
    
    // Handle user cancellation (AbortError or similar)
    // User cancellation is not an error, return null
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('cancel'))) {
      return null;
    }

    // Unknown error
    const pickError: PickContactError = {
      type: 'unknown',
      message: 'Failed to select contact. Please enter the number manually.',
    };
    throw pickError;
  }
}
