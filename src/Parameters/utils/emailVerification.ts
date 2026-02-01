/**
 * Email verification helpers. Matches Flutter message_bottom_sheet logic.
 * Use when API returns "verify your email" on purchase/service actions.
 */

export function isEmailVerificationRequired(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes('verify') && lower.includes('email');
}

export interface ShowVerifyEmailOptions {
  message: string;
  title?: string;
  /** Called when user taps "Verify Email" – should set pending email and navigate to verify-otp. */
  onVerifyClick: () => void;
  /** Called when user dismisses (if no verify button). */
  onDismiss?: () => void;
}
