import { client } from '../config/client';
import { endpoints } from '../config/endpoints';

export interface AppBanner {
  id: number;
  title?: string | null;
  image_url: string;
  link_type: 'none' | 'internal' | 'external';
  link_target?: string | null;
  pages: string[];
  sort_order: number;
}

export const bannersApi = {
  async getAll(placement?: string): Promise<AppBanner[]> {
    const query = placement ? `?placement=${encodeURIComponent(placement)}` : '';
    const res = await client.get<{ status?: string; data?: AppBanner[] }>(
      `${endpoints.banners}${query}`,
    );
    return Array.isArray(res?.data) ? res.data : [];
  },
};
