/**
 * Transactions Zustand store. Caches user transactions for dashboard and list.
 */
import { create } from 'zustand';
import { transactionsApi, type TransactionsResponse } from '../api/transactions.api';
import type { Transaction } from '../../Parameters/types/transaction';

export interface TransactionsState {
  list: Transaction[];
  pagination: TransactionsResponse['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  /** Fetch transactions (e.g. after login or on dashboard mount). */
  fetchTransactions: (params?: { page?: number; limit?: number; search?: string; type?: string; status?: string }) => Promise<void>;
  reset: () => void;
}

const initialState = {
  list: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const useTransactionsStore = create<TransactionsState>((set) => ({
  ...initialState,

  fetchTransactions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await transactionsApi.getTransactions(params ?? { limit: 20 });
      set({
        list: res.transactions,
        pagination: res.pagination ?? null,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load transactions';
      set({ ...initialState, isLoading: false, error: message });
    }
  },

  reset: () => set(initialState),
}));
