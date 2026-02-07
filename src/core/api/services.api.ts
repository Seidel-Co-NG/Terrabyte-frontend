import { client } from '../config/client';
import { endpoints } from '../config/endpoints';

export interface BuyAirtimeParams {
  network_name: string;
  phone_number: string;
  amount: string | number;
  transaction_pin: string;
}

export interface TransferToUserParams {
  phone_number: string;
  amount: string | number;
  transaction_pin: string;
}

export interface SocialCategory {
  id: number | string;
  name: string;
  icon?: string | null;
  active?: boolean;
}

export interface SocialPlan {
  id: number | string;
  socialCategoryId?: number | string;
  name: string;
  description?: string | null;
  averageTime?: string | null;
  minQuantity?: number;
  maxQuantity?: number;
  smartUserAmount: number;
  smartEarnerAmount: number;
  topUserAmount: number;
  active?: boolean;
}

export interface BuySocialParams {
  plan_id: string | number;
  link: string;
  quantity: number;
  transaction_pin: string;
}

export const servicesApi = {
  async buyAirtime(params: BuyAirtimeParams) {
    // Returns the parsed JSON response from the API.
    return client.post<{ status?: string; message?: string; data?: any }>(endpoints.buyAirtime, params);
  },

  async transferToUser(params: TransferToUserParams) {
    // Returns the parsed JSON response from the API.
    return client.post<{ status?: string; message?: string; data?: any }>(endpoints.transferToUser, params);
  },

  async getSocialCategories() {
    return client.get<{ status?: string; message?: string; data?: { categories?: SocialCategory[] } }>(endpoints.socialCategories);
  },

  async getSocialPlans() {
    return client.get<{ status?: string; message?: string; data?: { plans?: SocialPlan[] } }>(endpoints.socialPlans);
  },

  async buySocial(params: BuySocialParams) {
    return client.post<{ status?: string; message?: string; data?: any }>(endpoints.buySocial, params);
  },
};
