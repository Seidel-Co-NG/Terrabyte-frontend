/**
 * API endpoint paths (relative to base URL).
 * Matches Flutter ApiEndpoints structure.
 */
const API = '/api';

export const endpoints = {
  // Auth
  register: `${API}/register`,
  resendVerification: `${API}/resend-verification`,
  verifyOtp: `${API}/verify-otp`,
  login: `${API}/login`,
  forgotPassword: `${API}/forgot-password`,
  verifyResetOtp: `${API}/verify-reset-otp`,
  resetPassword: `${API}/reset-password`,
  logout: `${API}/logout`,
  setTransactionPin: `${API}/set-transaction-pin`,
  confirmTransactionPinLogin: `${API}/confirm-transaction-pin-login`,

  // User (for future use)
  user: `${API}/user`,
  updateUser: `${API}/user/update`,
  changePassword: `${API}/user/change-password`,
} as const;
