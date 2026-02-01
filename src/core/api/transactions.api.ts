/**
 * Transactions API. Matches Flutter / API transaction endpoints.
 */
import { client } from '../config/client';
import { endpoints } from '../config/endpoints';
import type { Transaction } from '../../Parameters/types/transaction';

/** API transaction item (snake_case) */
interface ApiTransaction {
  id: number;
  transaction_reference?: string;
  service_type?: string;
  description?: string;
  amount?: number;
  formatted_amount?: string;
  status?: string;
  transaction_type?: string;
  pre_balance?: number;
  post_balance?: number;
  created_at?: string;
  formatted_date?: string;
  type_category?: string;
  title?: string;
  api_response?: string;
}

function mapTransaction(raw: ApiTransaction): Transaction {
  return {
    id: raw.id,
    transactionReference: raw.transaction_reference ?? '',
    serviceType: raw.service_type ?? '',
    description: raw.description ?? '',
    amount: raw.amount ?? 0,
    formattedAmount: raw.formatted_amount ?? `₦${(raw.amount ?? 0).toLocaleString()}`,
    status: raw.status ?? '',
    transactionType: raw.transaction_type ?? '',
    preBalance: raw.pre_balance ?? 0,
    postBalance: raw.post_balance ?? 0,
    createdAt: typeof raw.created_at === 'string' ? raw.created_at : '',
    formattedDate: raw.formatted_date ?? '',
    typeCategory: raw.type_category ?? '',
    title: raw.title ?? raw.service_type ?? 'Transaction',
    apiResponse: raw.api_response ?? '',
  };
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_more: boolean;
  };
}

export const transactionsApi = {
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  }): Promise<TransactionsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.type && params.type !== 'All') searchParams.set('type', params.type);
    if (params?.status && params.status !== 'All') searchParams.set('status', params.status);
    const query = searchParams.toString();
    const url = query ? `${endpoints.transactions}?${query}` : endpoints.transactions;
    const res = await client.get<{
      status?: string;
      data?: {
        transactions?: ApiTransaction[];
        pagination?: TransactionsResponse['pagination'];
      };
    }>(url);
    const list = res?.data?.transactions ?? [];
    return {
      transactions: list.map(mapTransaction),
      pagination: res?.data?.pagination,
    };
  },

  async reportTransaction(transactionId: number): Promise<{ status?: string; message?: string }> {
    return client.post(endpoints.transactionReport(transactionId), {});
  },
};
