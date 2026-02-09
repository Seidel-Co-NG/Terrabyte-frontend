/**
 * Services API. Matches Flutter services_repository_impl endpoints and payloads.
 */
import { client } from '../config/client';
import { endpoints } from '../config/endpoints';
import type { HttpResponse } from '../../Parameters/types/auth.types';
import type {
  Airtime2CashConvertPayload,
  ValidateMeterPayload,
  BuyElectricityPayload,
  ValidateCablePayload,
  BuyCablePayload,
  FundBettingPayload,
  SendBulkSmsPayload,
  BuyExamPayload,
  BuyAirtimePayload,
  BuyDataPayload,
  BuyInternetPayload,
  InitFundingAtmPayload,
  BankFundingRequestPayload,
  ValidateAccountPayload,
  BankTransferPayload,
  TransferToUserPayload,
  BuyPinPayload,
  BuyDatacardPayload,
  BuySocialPayload,
} from '../../Parameters/types/services.types';

function getWithQuery(path: string, params?: Record<string, string | number | undefined | null>): string {
  if (!params) return path;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `${path}?${q}` : path;
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
  // ==================== AIRTIME TO CASH ====================
  getAirtime2CashRates(): Promise<HttpResponse> {
    return client.get<HttpResponse>(endpoints.airtime2CashRates);
  },
  convertAirtime2Cash(payload: Airtime2CashConvertPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.airtime2CashConvert, {
      network: payload.network.toLowerCase(),
      phone: payload.phone,
      amount: payload.amount,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== ELECTRICITY ====================
  getElectricityCompanies(): Promise<HttpResponse> {
    return client.get<HttpResponse>(endpoints.electricityCompanies);
  },
  validateMeter(payload: ValidateMeterPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.validateMeter, {
      meter_number: payload.meter_number,
      meter_type: payload.meter_type.toLowerCase(),
      company_code: payload.company_code,
    });
  },
  buyElectricity(payload: BuyElectricityPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buyElectricity, {
      meter_number: payload.meter_number,
      meter_type: payload.meter_type.toLowerCase(),
      company_code: payload.company_code,
      amount: payload.amount,
      customer_name: payload.customer_name,
      ...(payload.phone != null && payload.phone !== '' && { phone: payload.phone }),
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== CABLE TV ====================
  getCableCompanies(): Promise<HttpResponse> {
    return client.get<HttpResponse>(endpoints.cableCompanies);
  },
  getCablePlans(cable?: string): Promise<HttpResponse> {
    return client.get<HttpResponse>(getWithQuery(endpoints.cablePlans, { cable }));
  },
  validateCable(payload: ValidateCablePayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.validateCable, {
      iuc: payload.iuc,
      cablename: payload.cablename.toUpperCase(),
    });
  },
  buyCable(payload: BuyCablePayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buyCable, {
      iuc: payload.iuc,
      cablename: payload.cablename,
      cable_plan_id: payload.cable_plan_id,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== BETTING ====================
  getBettingPlatforms(): Promise<HttpResponse> {
    return client.get<HttpResponse>(endpoints.bettingPlatforms);
  },
  fundBetting(payload: FundBettingPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.fundBetting, {
      platform_code: payload.platform_code,
      betting_account: payload.betting_account,
      amount: payload.amount,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== BULK SMS ====================
  sendBulkSms(payload: SendBulkSmsPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.bulkSmsSend, {
      from: payload.from,
      to: payload.to,
      msg: payload.msg,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== EXAM ====================
  buyExam(payload: BuyExamPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buyExam, {
      exam_type: payload.exam_type,
      quantity: payload.quantity,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== AIRTIME ====================
  buyAirtime(payload: BuyAirtimePayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buyAirtime, {
      network_name: payload.network_name,
      phone_number: payload.phone_number,
      amount: payload.amount,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== DATA ====================
  getDataPlans(): Promise<HttpResponse> {
    return client.get<HttpResponse>(endpoints.dataPlans);
  },
  buyData(payload: BuyDataPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buyData, {
      network: payload.network,
      phone_number: payload.phone_number,
      plan_id: payload.plan_id,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== INTERNET ====================
  getInternetPlans(network?: string): Promise<HttpResponse> {
    return client.get<HttpResponse>(getWithQuery(endpoints.internetPlans, { network }));
  },
  buyInternet(payload: BuyInternetPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buyInternet, {
      network: payload.network,
      phone_number: payload.phone_number,
      plan_id: payload.plan_id,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== FUNDING ====================
  initFundingAtmPayment(payload: InitFundingAtmPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.fundingAtmPayment, {
      payment_type: payload.payment_type,
      real_amount: payload.real_amount,
    });
  },
  getPaymentMethods(): Promise<HttpResponse> {
    return client.get<HttpResponse>(endpoints.fundingPaymentMethods);
  },
  submitBankFundingRequest(payload: BankFundingRequestPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.bankFundingRequest, {
      amount: payload.amount,
      bank_paid_to: payload.bank_paid_to,
      account_number_paid_to: payload.account_number_paid_to,
      depositor_name: payload.depositor_name,
      depositor_bank: payload.depositor_bank,
      payment_date: payload.payment_date,
      payment_time: payload.payment_time,
    });
  },

  // ==================== BANK TRANSFER ====================
  getBanks(): Promise<HttpResponse> {
    return client.get<HttpResponse>(endpoints.bankTransferBanks);
  },
  validateAccount(payload: ValidateAccountPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.validateAccount, {
      account_number: payload.account_number,
      bank_code: payload.bank_code,
    });
  },
  bankTransfer(payload: BankTransferPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.bankTransfer, {
      account_number: payload.account_number,
      bank_code: payload.bank_code,
      account_name: payload.account_name,
      amount: payload.amount,
      narration: payload.narration,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== USER TRANSFER ====================
  transferToUser(payload: TransferToUserPayload): Promise<HttpResponse> {
    const phoneNumber = payload.phone_number.startsWith('0')
      ? payload.phone_number.slice(1)
      : payload.phone_number;
    return client.post<HttpResponse>(endpoints.userTransfer, {
      phone_number: phoneNumber,
      amount: payload.amount,
      transaction_pin: payload.transaction_pin,
    });
  },

  // ==================== RECHARGE PINS ====================
  /** Recharge card printing & Buy Pins: POST /recharge/pins */
  buyRechargePins(payload: BuyPinPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.rechargePins, {
      pin_name: payload.pin_name,
      name_on_card: payload.name_on_card,
      quantity: payload.quantity,
      amount: payload.amount,
      transaction_pin: payload.transaction_pin,
    });
  },
  buyPin(payload: BuyPinPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buyPin, {
      pin_name: payload.pin_name,
      name_on_card: payload.name_on_card,
      quantity: payload.quantity,
      amount: payload.amount,
      transaction_pin: payload.transaction_pin,
    });
  },
  buyDatacard(payload: BuyDatacardPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buyDatacard, {
      pin_name: payload.pin_name,
      name_on_card: payload.name_on_card,
      quantity: payload.quantity,
      plan_id: payload.plan_id,
      transaction_pin: payload.transaction_pin,
    });
  },
  fetchDatacardPlans(network?: string): Promise<HttpResponse> {
    return client.get<HttpResponse>(getWithQuery(endpoints.fetchDatacardPlans, { network }));
  },
  getPinsByBuyId(buyId: string): Promise<HttpResponse> {
    return client.get<HttpResponse>(getWithQuery(endpoints.getPinsByBuyId, { buy_id: buyId }));
  },

  // ==================== SOCIAL MEDIA ====================
  getSocialCategories(): Promise<HttpResponse> {
    return client.get<HttpResponse>(endpoints.socialCategories);
  },
  getSocialPlans(categoryId?: number): Promise<HttpResponse> {
    return client.get<HttpResponse>(getWithQuery(endpoints.socialPlans, { category_id: categoryId }));
  },
  buySocial(payload: BuySocialPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.buySocial, {
      plan_id: payload.plan_id,
      link: payload.link,
      quantity: payload.quantity,
      transaction_pin: payload.transaction_pin,
    });
  },
};
