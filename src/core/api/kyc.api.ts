/**
 * KYC API for verification (selfie + BVN/NIN).
 */
import { client } from '../config/client';
import { endpoints } from '../config/endpoints';

export type KycLevelStatus = 'pending' | 'approved' | 'rejected';

export interface KycLevelInfo {
  kyc_id: number;
  status: KycLevelStatus;
  rejection_reason?: string | null;
  reviewed_at?: string | null;
}

export interface KycLevelCatalogItem {
  level: number;
  name: string;
  daily_limit: number;
  requirements?: string | null;
  description?: string | null;
}

export interface KycStatusResponse {
  status?: string;
  message?: string;
  data?: {
    kyc_id: number;
    status: KycLevelStatus;
    id_type?: string;
    rejection_reason?: string | null;
    reviewed_at?: string | null;
  } | null;
  user_level?: number;
  levels?: {
    level2?: KycLevelInfo | null;
    level3?: KycLevelInfo | null;
  };
  level_catalog?: KycLevelCatalogItem[];
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
    const res = await client.get<KycStatusResponse>(endpoints.kycStatus);
    return {
      status: res?.status,
      message: res?.message,
      data: res?.data as KycStatusResponse['data'],
      user_level: res?.user_level,
      levels: res?.levels,
      level_catalog: res?.level_catalog,
    };
  },

  async submit(payload: {
    id_type: 'bvn' | 'nin';
    id_number: string;
    selfie: string; // base64 encoded image
  }): Promise<KycSubmitResponse> {
    const res = await client.post<{ status?: string; message?: string; data?: unknown }>(
      endpoints.kycSubmit,
      { level: 2, ...payload }
    );
    return {
      status: res?.status,
      message: res?.message,
      data: res?.data as KycSubmitResponse['data'],
    };
  },

  async submitLevel3(payload: {
    id_number: string; // NIN
    nin_image: string; // base64 image
    video_url: string; // Cloudinary URL
    video_phrase: string;
    address: string;
    address_image: string; // base64 image
  }): Promise<KycSubmitResponse> {
    const res = await client.post<{ status?: string; message?: string; data?: unknown }>(
      endpoints.kycSubmit,
      { level: 3, ...payload }
    );
    return {
      status: res?.status,
      message: res?.message,
      data: res?.data as KycSubmitResponse['data'],
    };
  },
};
