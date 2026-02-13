/**
 * User API. Matches Flutter user_repository_impl endpoints.
 */
import { client } from '../config/client';
import { endpoints } from '../config/endpoints';
import type { User } from '../../Parameters/types/auth.types';

export interface UserResponse {
  status?: string;
  message?: string;
  data?: User;
}

export const userApi = {
  async getCurrentUser(): Promise<UserResponse> {
    const res = await client.get<{ status?: string; message?: string; data?: unknown }>(endpoints.user);
    const data = res?.data as User | undefined;
    return { status: res?.status, message: res?.message, data };
  },

  async updateUser(payload: {
    push_notification?: boolean;
    biometric_enabled?: boolean;
    ip_whitelist?: string;
    fcm_token?: string;
  }): Promise<UserResponse> {
    const body: Record<string, unknown> = {};
    if (payload.push_notification !== undefined) body.push_notification = payload.push_notification;
    if (payload.biometric_enabled !== undefined) body.biometric_enabled = payload.biometric_enabled;
    if (payload.ip_whitelist !== undefined) body.ip_whitelist = payload.ip_whitelist;
    if (payload.fcm_token !== undefined) body.fcm_token = payload.fcm_token;
    const res = await client.post<{ status?: string; message?: string; data?: unknown }>(endpoints.updateUser, body);
    return { status: res?.status, message: res?.message, data: res?.data as User | undefined };
  },

  async changePassword(payload: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<{ status?: string; message?: string }> {
    return client.post(endpoints.changePassword, payload);
  },

  async changeTransactionPin(payload: {
    current_transaction_pin: string;
    new_transaction_pin: string;
    new_transaction_pin_confirmation: string;
  }): Promise<{ status?: string; message?: string }> {
    return client.post(endpoints.changeTransactionPin, payload);
  },

  async resetTransactionPin(payload: {
    current_password: string;
    new_transaction_pin: string;
    new_transaction_pin_confirmation: string;
  }): Promise<{ status?: string; message?: string }> {
    return client.post(endpoints.resetTransactionPin, payload);
  },

  async bonusToWallet(): Promise<{ status?: string; message?: string }> {
    return client.post(endpoints.bonusToWallet, {});
  },

  async getReferredUsers(): Promise<{ status?: string; message?: string; data?: unknown }> {
    return client.get(endpoints.referredUsers);
  },

  async getConfigurations(): Promise<{ status?: string; message?: string; data?: unknown }> {
    return client.get(endpoints.configurations);
  },

  async getApiKey(): Promise<{ status?: string; message?: string; data?: { api_key?: string } }> {
    const res = await client.get<{ status?: string; message?: string; data?: { api_key?: string } }>(endpoints.apiKey);
    return res;
  },

  async resetApiKey(): Promise<{ status?: string; message?: string; data?: { api_key?: string } }> {
    const res = await client.post<{ status?: string; message?: string; data?: { api_key?: string } }>(endpoints.apiKeyReset);
    return res;
  },
};
