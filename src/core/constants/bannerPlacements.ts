/** Placement slugs — must match API AppBannerPlacements. */
export const BannerPlacements = {
  dashboard: 'dashboard',
  buyData: 'buy_data',
  buyAirtime: 'buy_airtime',
  airtimeToCash: 'airtime_to_cash',
  transferToBank: 'transfer_to_bank',
  transferToUser: 'transfer_to_user',
  fundBetting: 'fund_betting',
  fundWallet: 'fund_wallet',
  electricity: 'electricity',
  cableTv: 'cable_tv',
  bulkSms: 'bulk_sms',
  internet: 'internet',
  socialMediaBoost: 'social_media_boost',
  buyPins: 'buy_pins',
} as const;

export type BannerPlacement = (typeof BannerPlacements)[keyof typeof BannerPlacements];

export const INTERNAL_BANNER_ROUTES: Record<string, string> = {
  dashboard: '/dashboard',
  buy_data: '/dashboard/services/buy-data',
  buy_airtime: '/dashboard/services/buy-airtime',
  airtime_to_cash: '/dashboard/services/airtime-to-cash',
  transfer_to_bank: '/dashboard/transfer-to-bank',
  transfer_to_user: '/dashboard/transfer-to-user',
  fund_betting: '/dashboard/services/bet-funding',
  fund_wallet: '/dashboard/fund-wallet',
  electricity: '/dashboard/services/electricity',
  cable_tv: '/dashboard/services/buy-cable-tv',
  bulk_sms: '/dashboard/services/bulk-sms',
  internet: '/dashboard/services/internet',
  social_media_boost: '/dashboard/services/social-media-boost',
  buy_pins: '/dashboard/services/buy-pins',
  profile: '/dashboard/profile',
  transactions: '/dashboard/transactions',
  support: '/dashboard/profile/support',
};
