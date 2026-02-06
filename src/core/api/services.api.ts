import { client } from '../config/client';
import { endpoints } from '../config/endpoints';

export interface BuyAirtimeParams {
  network_name: string;
  phone_number: string;
  amount: string | number;
  transaction_pin: string;
}

export const servicesApi = {
  async buyAirtime(params: BuyAirtimeParams) {
    // Returns the parsed JSON response from the API.
    return client.post<{ status?: string; message?: string; data?: any }>(endpoints.buyAirtime, params);
  },
};
