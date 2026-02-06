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

  // User
  user: `${API}/user`,
  updateUser: `${API}/user/update`,
  changePassword: `${API}/user/change-password`,
  changeTransactionPin: `${API}/user/change-transaction-pin`,
  resetTransactionPin: `${API}/user/reset-transaction-pin`,
  bonusToWallet: `${API}/user/bonus-to-wallet`,
  referredUsers: `${API}/user/referred-users`,
  configurations: `${API}/user/configurations`,

  // Transactions
  transactions: `${API}/transactions`,
  transactionReport: (id: number) => `${API}/transactions/${id}/report`,

  // Notifications
  notifications: `${API}/notifications`,
  notificationDetail: (id: number) => `${API}/notifications/${id}`,
  markNotificationRead: (id: number) => `${API}/notifications/${id}/read`,
  markAllNotificationsRead: `${API}/notifications/mark-all-read`,
  unreadNotificationCount: `${API}/notifications/unread-count`,

  // Coupon (verified-only)
  couponValidate: `${API}/coupon/validate`,
  couponRedeem: `${API}/coupon/redeem`,
  // Airtime
  buyAirtime: `${API}/airtime/buy`,
} as const;
