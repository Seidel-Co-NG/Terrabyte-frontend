/**
 * Coupon API (validate + redeem). Redeem requires verified email.
 */
import { client } from '../config/client';
import { endpoints } from '../config/endpoints';

export const couponApi = {
  async validate(code: string): Promise<{ status?: string; message?: string; data?: { amount?: number; description?: string } }> {
    return client.post(endpoints.couponValidate, { code: code.trim() });
  },

  async redeem(code: string, transactionPin: string): Promise<{ status?: string; message?: string; data?: unknown }> {
    return client.post(endpoints.couponRedeem, { code: code.trim(), transaction_pin: transactionPin });
  },
};
