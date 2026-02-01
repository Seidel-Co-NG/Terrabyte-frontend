/**
 * Centralized SEO configuration for Terrabyte.
 * Add new routes here when scaling - header values reflect the rendered page.
 */

const SITE_NAME = "Terrabyte";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://terrabyte.ng";
/** OG image path – place your image at public/img/terrabyte-og.png (e.g. 1200×630) */
const DEFAULT_OG_IMAGE = "/img/terrabyte-og.png";

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
}

/** Default fallback when no route matches */
export const DEFAULT_SEO: SEOConfig = {
  title: `${SITE_NAME} – Airtime, Data, Bills & More`,
  description:
    "Buy airtime, data bundles, pay electricity bills, cable TV, and bet funding instantly. Fast, secure, and affordable. Nigeria's trusted digital services platform.",
  keywords:
    "Terrabyte, buy airtime Nigeria, buy data Nigeria, electricity bill payment, cable TV subscription, bet funding, MTN, Airtel, Glo, 9mobile",
};

/**
 * Route → SEO metadata mapping.
 * Keys match pathname for lookup. Add new services here as you scale.
 */
export const SEO_ROUTES: Record<string, SEOConfig> = {
  // Landing & Auth
  "/": {
    title: "Home",
    description:
      "Terrabyte – Buy airtime, data, pay electricity bills, cable TV, and more. Fast, secure, and affordable digital services for Nigeria.",
    keywords:
      "Terrabyte, buy airtime, buy data, pay bills Nigeria, electricity, cable TV, airtime top up, data plans",
  },
  "/welcome": {
    title: "Welcome",
    description: "Welcome to Terrabyte. Sign in or create an account to access airtime, data, bills, and more.",
    keywords: "Terrabyte, sign up, login, create account",
  },
  "/login": {
    title: "Login",
    description: "Sign in to your Terrabyte account. Manage airtime, data, bills, and transactions.",
    keywords: "Terrabyte login, sign in, account access",
  },
  "/signup": {
    title: "Sign Up",
    description: "Create a Terrabyte account. Start buying airtime, data, and paying bills in minutes.",
    keywords: "Terrabyte sign up, register, create account",
  },
  "/forgot-password": {
    title: "Reset Password",
    description: "Reset your Terrabyte account password. Secure recovery for your account.",
    keywords: "Terrabyte, forgot password, reset password",
  },
  "/terms-of-service": {
    title: "Terms of Service",
    description: "Terrabyte terms of service. Read our terms and conditions for using our platform.",
    keywords: "Terrabyte terms, terms of service, conditions",
  },

  // Dashboard
  "/dashboard": {
    title: "Dashboard",
    description: "Your Terrabyte dashboard. View balance, recent transactions, and quick access to airtime, data, bills, and more.",
    keywords: "Terrabyte dashboard, wallet, transactions, services",
  },

  // Services – reflects rendered page
  "/dashboard/services/buy-data": {
    title: "Buy Data",
    description:
      "Buy data bundles for MTN, Airtel, Glo, and 9mobile. Affordable data plans for browsing, streaming, and more. Instant delivery.",
    keywords:
      "buy data Nigeria, MTN data, Airtel data, Glo data, 9mobile data, data plans, cheap data Nigeria",
  },
  "/dashboard/services/buy-airtime": {
    title: "Buy Airtime",
    description:
      "Buy airtime for MTN, Airtel, Glo, and 9mobile. Top up any amount instantly. Fast and secure airtime recharge.",
    keywords:
      "buy airtime Nigeria, MTN airtime, Airtel airtime, Glo airtime, 9mobile airtime, airtime top up, recharge",
  },
  "/dashboard/services/buy-electricity": {
    title: "Buy Electricity",
    description:
      "Pay electricity bills for all DISCOs. EKEDC, IKEDC, KEDCO, and more. Buy prepaid and postpaid electricity tokens.",
    keywords:
      "pay electricity Nigeria, buy token, EKEDC, IKEDC, KEDCO, prepaid meter, electricity bill",
  },
  "/dashboard/services/buy-cable-tv": {
    title: "Cable TV Subscription",
    description:
      "Pay for DSTV, GOTV, Startimes, and other cable TV subscriptions. Easy renewal and instant activation.",
    keywords:
      "DSTV payment, GOTV payment, Startimes, cable TV Nigeria, TV subscription, pay TV",
  },
  "/dashboard/services/internet": {
    title: "Internet",
    description:
      "Pay for home and office internet subscriptions. Smile, Spectranet, and more. Fast and reliable.",
    keywords:
      "internet subscription Nigeria, Smile, Spectranet, WiFi payment, broadband",
  },
  "/dashboard/services/bet-funding": {
    title: "Bet Funding",
    description:
      "Fund your betting accounts instantly. Bet9ja, 1xBet, Nairabet, and more. Quick and secure bet funding.",
    keywords:
      "bet funding Nigeria, Bet9ja funding, 1xBet, Nairabet, betting wallet",
  },

  // Profile & Settings
  "/dashboard/profile": {
    title: "Profile",
    description: "Manage your Terrabyte profile. View and update your account details.",
    keywords: "Terrabyte profile, account settings",
  },
  "/dashboard/profile/edit": {
    title: "Edit Profile",
    description: "Edit your Terrabyte profile. Update name, email, and other details.",
    keywords: "edit profile, Terrabyte account",
  },
  "/dashboard/profile/change-password": {
    title: "Change Password",
    description: "Change your Terrabyte account password. Keep your account secure.",
    keywords: "change password, Terrabyte security",
  },
  "/dashboard/profile/change-pin": {
    title: "Change PIN",
    description: "Change your Terrabyte transaction PIN. Secure your transactions.",
    keywords: "change PIN, Terrabyte PIN",
  },
  "/dashboard/profile/reset-pin": {
    title: "Reset PIN",
    description: "Reset your Terrabyte transaction PIN. Recover access to your account.",
    keywords: "reset PIN, Terrabyte",
  },
  "/dashboard/profile/notification-settings": {
    title: "Notification Settings",
    description: "Manage Terrabyte notifications. Email, SMS, and push alerts.",
    keywords: "notification settings, Terrabyte alerts",
  },
  "/dashboard/profile/referral-bonus": {
    title: "Referral Bonus",
    description: "Earn rewards by referring friends to Terrabyte. Share your referral link.",
    keywords: "Terrabyte referral, refer and earn, bonus",
  },
  "/dashboard/profile/support": {
    title: "Support",
    description: "Get help with Terrabyte. Contact support for airtime, data, bills, and account issues.",
    keywords: "Terrabyte support, help, customer service",
  },
  "/dashboard/profile/user-limit": {
    title: "User Limit",
    description: "View and manage your Terrabyte transaction limits. Upgrade for higher limits.",
    keywords: "Terrabyte limits, transaction limits",
  },
  "/dashboard/download-app": {
    title: "Download Terrabyte App",
    description: "Download the Terrabyte app for Android or iOS. Airtime, data, bills and more on the go.",
    keywords: "Terrabyte app download, Android, iOS, mobile app",
  },
  "/download-app": {
    title: "Download Terrabyte App",
    description: "Download the Terrabyte app for Android or iOS. Airtime, data, bills and more on the go.",
    keywords: "Terrabyte app download, Android, iOS, mobile app",
  },
};

/** Get SEO config for a given pathname. Falls back to DEFAULT_SEO. */
export function getSEOForPath(pathname: string): SEOConfig {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return SEO_ROUTES[normalized] ?? DEFAULT_SEO;
}

export { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE };
