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
<<<<<<< HEAD

  // Airtime to Cash
  airtime2CashRates: `${API}/airtime2cash/rates`,
  airtime2CashConvert: `${API}/airtime2cash/convert`,

  // Electricity
  electricityCompanies: `${API}/electricity/companies`,
  validateMeter: `${API}/electricity/validate-meter`,
  buyElectricity: `${API}/electricity/buy`,

  // Cable TV
  cablePlans: `${API}/cable/plans`,
  validateCable: `${API}/cable/validate`,
  buyCable: `${API}/cable/buy`,

  // Betting
  bettingPlatforms: `${API}/betting/platforms`,
  fundBetting: `${API}/betting/fund`,

  // Bulk SMS
  bulkSmsSend: `${API}/bulk-sms/send`,

  // Exam
  buyExam: `${API}/exam/buy`,

  // Airtime
  buyAirtime: `${API}/airtime/buy`,

  // Data
  dataPlans: `${API}/data/plans`,
  buyData: `${API}/data/buy`,

  // Internet
  internetPlans: `${API}/internet/plans`,
  buyInternet: `${API}/internet/buy`,

  // Funding
  fundingAtmPayment: `${API}/funding/atm-payment`,
  fundingPaymentMethods: `${API}/funding/payment-methods`,
  bankFundingRequest: `${API}/funding/bank-request`,

  // Bank Transfer
  bankTransferBanks: `${API}/bank-transfer/banks`,
  validateAccount: `${API}/bank-transfer/validate-account`,
  bankTransfer: `${API}/bank-transfer/transfer`,

  // User Transfer
  userTransfer: `${API}/user-transfer/transfer`,

  // Recharge Pins
  buyPin: `${API}/buy-pin`,
  buyDatacard: `${API}/buy-datacard`,
  fetchDatacardPlans: `${API}/recharge/fetch-datacard-plans`,
  getPinsByBuyId: `${API}/recharge/pins/by-buy-id`,

  // Social Media
  socialCategories: `${API}/social/categories`,
  socialPlans: `${API}/social/plans`,
  buySocial: `${API}/social/buy`,
=======
  // Airtime
  buyAirtime: `${API}/airtime/buy`,
>>>>>>> 43018d95ebb1a36502c0410d61a0f82378375fd8
} as const;
