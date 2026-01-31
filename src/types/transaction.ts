/**
 * Transaction model matching Flutter TransactionModel.
 * Used for transaction history and details pages.
 */
export interface Transaction {
  id: number;
  transactionReference: string;
  serviceType: string;
  description: string;
  amount: number;
  formattedAmount: string;
  status: string;
  transactionType: string;
  preBalance: number;
  postBalance: number;
  createdAt: string;
  formattedDate: string;
  typeCategory: string;
  title: string;
  apiResponse: string;
}
