import { create } from 'zustand';
import { bannersApi, type AppBanner } from '../api/banners.api';

interface BannersState {
  banners: AppBanner[];
  isLoading: boolean;
  error: string | null;
  fetchBanners: (force?: boolean) => Promise<void>;
  getForPlacement: (placement: string) => AppBanner[];
  reset: () => void;
}

const initialState = {
  banners: [] as AppBanner[],
  isLoading: false,
  error: null as string | null,
};

let inflight: Promise<void> | null = null;

export const useBannersStore = create<BannersState>((set, get) => ({
  ...initialState,

  fetchBanners: async (force = false) => {
    if (!force && get().banners.length > 0) return;
    if (inflight) return inflight;

    inflight = (async () => {
      set({ isLoading: true, error: null });
      try {
        const banners = await bannersApi.getAll();
        set({ banners, isLoading: false, error: null });
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load banners';
        set({ isLoading: false, error: message });
      } finally {
        inflight = null;
      }
    })();

    return inflight;
  },

  getForPlacement: (placement: string) => {
    return get()
      .banners.filter((b) => Array.isArray(b.pages) && b.pages.includes(placement))
      .sort((a, b) => {
        const order = (a.sort_order ?? 0) - (b.sort_order ?? 0);
        if (order !== 0) return order;
        return b.id - a.id;
      });
  },

  reset: () => set(initialState),
}));
