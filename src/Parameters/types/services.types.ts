/**
 * Service API payloads and response types.
 * Matches Flutter services_repository_impl payloads.
 */

// Airtime to Cash
export interface Airtime2CashConvertPayload {
  network: string;
  phone: string;
  amount: string;
  transaction_pin: string;
}

// Electricity
export interface ValidateMeterPayload {
  meter_number: string;
  meter_type: string;
  company_code: string;
}

export interface BuyElectricityPayload {
  meter_number: string;
  meter_type: string;
  company_code: string;
  amount: string;
  customer_name: string;
  phone?: string;
  transaction_pin: string;
}

// Cable TV
export interface ValidateCablePayload {
  iuc: string;
  cablename: string;
}

export interface BuyCablePayload {
  iuc: string;
  cablename: string;
  cable_plan_id: string;
  transaction_pin: string;
}

// Betting
export interface FundBettingPayload {
  platform_code: string;
  betting_account: string;
  amount: string;
  transaction_pin: string;
}

// Bulk SMS
export interface SendBulkSmsPayload {
  from: string;
  to: string;
  msg: string;
  transaction_pin: string;
}

// Exam
export interface BuyExamPayload {
  exam_type: string;
  quantity: number;
  transaction_pin: string;
}

// Airtime
export interface BuyAirtimePayload {
  network_name: string;
  phone_number: string;
  amount: string;
  transaction_pin: string;
}

// Data
export interface BuyDataPayload {
  network: string;
  phone_number: string;
  plan_id: string;
  transaction_pin: string;
}

// Internet
export interface BuyInternetPayload {
  network: string;
  phone_number: string;
  plan_id: string;
  transaction_pin: string;
}

// Funding
export interface InitFundingAtmPayload {
  payment_type: string;
  real_amount: number;
}

// Bank Funding Request
export interface BankFundingRequestPayload {
  amount: number;
  bank_paid_to: string;
  account_number_paid_to: string;
  depositor_name: string;
  depositor_bank: string;
  payment_date: string;
  payment_time: string;
}

// Bank Transfer
export interface ValidateAccountPayload {
  account_number: string;
  bank_code: string;
}

export interface BankTransferPayload {
  account_number: string;
  bank_code: string;
  account_name: string;
  amount: string;
  narration: string;
  transaction_pin: string;
}

// User Transfer
export interface TransferToUserPayload {
  phone_number: string;
  amount: string;
  transaction_pin: string;
}

// Recharge Pins
export interface BuyPinPayload {
  pin_name: string;
  name_on_card: string;
  quantity: number;
  amount: number;
  transaction_pin: string;
}

export interface BuyDatacardPayload {
  pin_name: string;
  name_on_card: string;
  quantity: number;
  plan_id: number;
  transaction_pin: string;
}

// Social Media
export interface BuySocialPayload {
  plan_id: number;
  link: string;
  quantity: number;
  transaction_pin: string;
}
