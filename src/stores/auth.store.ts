/**
 * Auth Zustand store. Clear state / reset state maintained for logout and errors.
 */
import { create } from 'zustand';
import { apiConfig } from '../config/api.config';
import { authApi } from '../api/auth.api';
import type { User, LoginPayload, RegisterPayload } from '../types/auth.types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Email stored after register success, used on verify-otp page. Cleared on verify success or resetState. */
  pendingVerifyEmail: string | null;
  isLoading: boolean;
  error: string | null;
  /** Reset entire auth state (e.g. on logout). Clears user, token, pendingVerifyEmail, error. */
  resetState: () => void;
  /** Clear only the error message. Use after showing error or on new attempt. */
  clearError: () => void;
  /** Restore auth from localStorage (call once on app init). */
  hydrate: () => void;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  /** Verify OTP after signup. Returns true on success. Clears pendingVerifyEmail on success. */
  verifyRegistrationOtp: (email: string, otp: number) => Promise<boolean>;
  /** Resend verification OTP to email. Returns true on success. */
  resendVerificationEmail: (email: string) => Promise<boolean>;
  /** Set transaction PIN (after signup/OTP). Returns true on success. */
  setTransactionPin: (newPin: string, confirmPin: string) => Promise<boolean>;
  setTokenAndUser: (token: string, user: User) => void;
}

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(apiConfig.storageKeys.token);
  } catch {
    return null;
  }
};

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(apiConfig.storageKeys.user);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const PENDING_VERIFY_EMAIL_KEY = 'auth_pending_verify_email';

const setStorage = (token: string | null, user: User | null): void => {
  try {
    if (token) localStorage.setItem(apiConfig.storageKeys.token, token);
    else localStorage.removeItem(apiConfig.storageKeys.token);
    if (user) localStorage.setItem(apiConfig.storageKeys.user, JSON.stringify(user));
    else localStorage.removeItem(apiConfig.storageKeys.user);
  } catch {
    // ignore
  }
};

const getStoredPendingVerifyEmail = (): string | null => {
  try {
    return localStorage.getItem(PENDING_VERIFY_EMAIL_KEY);
  } catch {
    return null;
  }
};

const setPendingVerifyEmailStorage = (email: string | null): void => {
  try {
    if (email) localStorage.setItem(PENDING_VERIFY_EMAIL_KEY, email);
    else localStorage.removeItem(PENDING_VERIFY_EMAIL_KEY);
  } catch {
    // ignore
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  pendingVerifyEmail: null,
  isLoading: false,
  error: null,

  resetState: () => {
    setStorage(null, null);
    setPendingVerifyEmailStorage(null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      pendingVerifyEmail: null,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  hydrate: () => {
    const token = getStoredToken();
    const user = getStoredUser();
    const pendingVerifyEmail = getStoredPendingVerifyEmail();
    if (token && user) {
      set({ token, user, isAuthenticated: true, pendingVerifyEmail: pendingVerifyEmail ?? null });
    } else {
      set({ token: null, user: null, isAuthenticated: false, pendingVerifyEmail: pendingVerifyEmail ?? null });
    }
  },

  setTokenAndUser: (token: string, user: User) => {
    setStorage(token, user);
    set({ token, user, isAuthenticated: true, error: null });
  },

  login: async (payload: LoginPayload) => {
    get().clearError();
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login(payload) as unknown as Record<string, unknown>;
      const data = res?.data as Record<string, unknown> | string | undefined;
      const result = res?.result as Record<string, unknown> | undefined;
      const payloadRes = res?.payload as Record<string, unknown> | undefined;
      const dataObj = typeof data === 'object' && data !== null ? data : undefined;
      const token =
        (dataObj?.token ?? dataObj?.access_token ?? dataObj?.accessToken ?? result?.token ?? result?.access_token ?? result?.accessToken ?? payloadRes?.token ?? payloadRes?.access_token ?? payloadRes?.accessToken ?? res?.token ?? res?.access_token ?? res?.accessToken ?? (typeof data === 'string' ? data : undefined)) as string | undefined;
      const user = (dataObj?.user ?? result?.user ?? payloadRes?.user ?? res?.user) as User | undefined;
      const userFromToken = user && typeof (user as Record<string, unknown>)?.token === 'string' ? (user as User & { token: string }).token : undefined;
      const finalToken = token ?? userFromToken;
      const userToStore = user ?? (finalToken ? ({ has_transaction_pin: true } as User) : undefined);
      if (finalToken && userToStore) {
        const tokenToStore = typeof finalToken === 'string' ? finalToken : String(finalToken);
        setStorage(tokenToStore, userToStore);
        set({ token: tokenToStore, user: userToStore, isAuthenticated: true, error: null, isLoading: false });
        return true;
      }
      if (import.meta.env.DEV) {
        console.warn('[Auth] Login response – could not find token/user. Response keys:', res ? Object.keys(res) : [], 'Full response:', res);
      }
      const msg = typeof res?.message === 'string' ? res.message : 'Login failed';
      set({ isLoading: false, error: msg });
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Login failed';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
    } catch {
      // Clear local state even if API fails
    } finally {
      get().resetState();
      set({ isLoading: false });
    }
  },

  register: async (payload: RegisterPayload) => {
    get().clearError();
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.register(payload);
      const data = res?.data;
      const token = data?.token ?? data?.access_token;
      const user = data?.user;
      const isSuccess = res?.status === 'successful' || res?.status === 'success' || (res?.message && !res?.message.toLowerCase().includes('fail'));
      if (token && user) {
        setStorage(token, user);
        setPendingVerifyEmailStorage(null);
        set({ token, user, isAuthenticated: true, pendingVerifyEmail: null, error: null, isLoading: false });
        return { success: true, message: res?.message ?? undefined };
      }
      if (isSuccess) {
        setPendingVerifyEmailStorage(payload.email);
        set({ pendingVerifyEmail: payload.email, error: null, isLoading: false });
        return { success: true, message: res?.message ?? undefined };
      }
      set({ isLoading: false, error: res?.message ?? 'Registration failed' });
      return { success: false };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Registration failed';
      set({ isLoading: false, error: message });
      return { success: false };
    }
  },

  verifyRegistrationOtp: async (email: string, otp: number) => {
    get().clearError();
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.verifyRegistrationOtp({ email, otp });
      const data = res?.data as { token?: string; access_token?: string; user?: User } | undefined;
      const token = data?.token ?? data?.access_token;
      const user = data?.user;
      const isSuccess = res?.status === 'successful' || res?.status === 'success';
      if (isSuccess) {
        setPendingVerifyEmailStorage(null);
        if (token && user) {
          setStorage(token, user);
          set({ token, user, isAuthenticated: true, pendingVerifyEmail: null, error: null, isLoading: false });
        } else {
          set({ pendingVerifyEmail: null, error: null, isLoading: false });
        }
        return true;
      }
      set({ isLoading: false, error: res?.message ?? 'Verification failed' });
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Verification failed';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  setTransactionPin: async (newPin: string, confirmPin: string) => {
    get().clearError();
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.setTransactionPin({
        new_transaction_pin: newPin,
        new_transaction_pin_confirmation: confirmPin,
      });
      const msg = (res?.message ?? '').toLowerCase();
      const alreadySet = msg.includes('already set') || msg.includes('already exists');
      const isSuccess = res?.status === 'successful' || res?.status === 'success' || alreadySet;
      set({ isLoading: false });
      if (isSuccess || alreadySet) {
        const current = get();
        const updatedUser = (res?.data as { user?: User } | undefined)?.user ?? { ...current.user!, has_transaction_pin: true };
        if (current.token) setStorage(current.token, updatedUser);
        set({ user: updatedUser, error: null });
        return true;
      }
      set({ error: res?.message ?? 'Failed to set PIN' });
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to set PIN';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  resendVerificationEmail: async (email: string) => {
    get().clearError();
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.resendVerificationEmail({ email });
      const isSuccess = res?.status === 'successful' || res?.status === 'success';
      set({ isLoading: false });
      if (isSuccess) {
        set({ error: null });
        return true;
      }
      set({ error: res?.message ?? 'Failed to resend code' });
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to resend code';
      set({ isLoading: false, error: message });
      return false;
    }
  },
}));
