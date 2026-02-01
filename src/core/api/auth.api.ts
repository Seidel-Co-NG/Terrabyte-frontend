/**
 * Auth API. Matches Flutter auth_repository_impl endpoints and payloads.
 */
import { client, clearAuthStorage } from '../config/client';
import { endpoints } from '../config/endpoints';
import type {
  HttpResponse,
  LoginData,
  RegisterPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyResetOtpPayload,
  ResetPasswordPayload,
  SetTransactionPinPayload,
  ConfirmTransactionPinPayload,
} from '../../Parameters/types/auth.types';

export const authApi = {
  async register(payload: RegisterPayload): Promise<HttpResponse<LoginData>> {
    const body = {
      fullname: payload.fullname,
      username: payload.username,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      ...(payload.referral != null && payload.referral !== '' && { referral: payload.referral }),
    };
    return client.post<HttpResponse<LoginData>>(endpoints.register, body, { requireToken: false });
  },

  async login(payload: LoginPayload): Promise<HttpResponse<LoginData>> {
    return client.post<HttpResponse<LoginData>>(endpoints.login, payload, { requireToken: false });
  },

  async logout(): Promise<void> {
    try {
      await client.post(endpoints.logout, {}, { requireToken: true });
    } finally {
      clearAuthStorage();
    }
  },

  async resendVerificationEmail(payload: { email: string }): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.resendVerification, payload, { requireToken: false });
  },

  async verifyRegistrationOtp(payload: { email: string; otp: number }): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.verifyOtp, payload, { requireToken: false });
  },

  async sendResetOtp(payload: ForgotPasswordPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.forgotPassword, payload, { requireToken: false });
  },

  async verifyResetOtp(payload: VerifyResetOtpPayload): Promise<HttpResponse> {
    return client.post<HttpResponse>(endpoints.verifyResetOtp, payload, { requireToken: false });
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<HttpResponse> {
    const body = {
      email: payload.email,
      otp: payload.otp,
      new_password: payload.new_password,
      new_password_confirmation: payload.new_password_confirmation,
    };
    return client.post<HttpResponse>(endpoints.resetPassword, body, { requireToken: false });
  },

  async setTransactionPin(payload: SetTransactionPinPayload): Promise<HttpResponse> {
    const body = {
      new_transaction_pin: payload.new_transaction_pin,
      new_transaction_pin_confirmation: payload.new_transaction_pin_confirmation,
    };
    return client.post<HttpResponse>(endpoints.setTransactionPin, body);
  },

  async confirmTransactionPinLogin(payload: ConfirmTransactionPinPayload): Promise<HttpResponse<LoginData>> {
    return client.post<HttpResponse<LoginData>>(endpoints.confirmTransactionPinLogin, {
      transaction_pin: payload.transaction_pin,
    });
  },
};
