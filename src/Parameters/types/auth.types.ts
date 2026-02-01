/**
 * Auth-related types matching Flutter auth_repository_impl and user_model.
 */

export interface HttpResponse<T = unknown> {
  status?: string;
  message: string;
  data?: T;
}

export interface User {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  wallet?: string;
  address?: string;
  push_notification?: boolean;
  biometric_enabled?: boolean;
  user_type?: string;
  user_level?: string;
  bonus?: string;
  has_transaction_pin?: boolean;
  user_limit?: number;
  daily_limit?: number;
  created_at?: string;
  updated_at?: string;
  /** Admin panel access: full admin */
  isAdmin?: boolean;
  /** Admin panel access: staff with route permissions */
  is_staff?: boolean;
  /** Reserved bank accounts (API may return reserved_account) */
  reserved_account?: Array<{ account_name?: string; bank_name?: string; account_number?: string }>;
}

export interface LoginData {
  user?: User;
  token?: string;
  access_token?: string;
}

export interface RegisterPayload {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  referral?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: number;
}

export interface ResetPasswordPayload {
  email: string;
  otp: number;
  new_password: string;
  new_password_confirmation: string;
}

export interface SetTransactionPinPayload {
  new_transaction_pin: string;
  new_transaction_pin_confirmation: string;
}

export interface ConfirmTransactionPinPayload {
  transaction_pin: string;
}
