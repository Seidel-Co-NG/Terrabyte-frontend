/**
 * KYC API for verification (selfie + BVN/NIN).
 */
import { client } from '../config/client';
import { endpoints } from '../config/endpoints';

export interface KycStatusResponse {
  status?: string;
  message?: string;
  data?: {
    kyc_id: number;
    status: 'pending' | 'approved' | 'rejected';
    id_type?: string;
    rejection_reason?: string | null;
    reviewed_at?: string | null;
  } | null;
}

export interface KycSubmitResponse {
  status?: string;
  message?: string;
  data?: {
    kyc_id: number;
    status: string;
  };
}

export const kycApi = {
  async getStatus(): Promise<KycStatusResponse> {
    const res = await client.get<{ status?: string; message?: string; data?: unknown }>(endpoints.kycStatus);
    return {
      status: res?.status,
      message: res?.message,
      data: res?.data as KycStatusResponse['data'],
    };
  },

  async submit(payload: {
    id_type: 'bvn' | 'nin';
    id_number: string;
    selfie: string; // base64 encoded image
  }): Promise<KycSubmitResponse> {
    const res = await client.post<{ status?: string; message?: string; data?: unknown }>(
      endpoints.kycSubmit,
      payload
    );
    return {
      status: res?.status,
      message: res?.message,
      data: res?.data as KycSubmitResponse['data'],
    };
  },
};
