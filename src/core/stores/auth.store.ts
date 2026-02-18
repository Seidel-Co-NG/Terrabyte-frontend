/**
 * Auth Zustand store. Clear state / reset state maintained for logout and errors.
 */
import { create } from 'zustand';
import { apiConfig } from '../config/api.config';
import { authApi } from '../api/auth.api';
import { userApi } from '../api/user.api';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import type { User, LoginPayload, RegisterPayload } from '../../Parameters/types/auth.types';

/** Normalize API user (snake_case / raw) to our User type. */
function normalizeUser(raw: Record<string, unknown> | User): User {
  const r = raw as Record<string, unknown>;
  const hasPin =
    r.has_transaction_pin === true ||
    (r.transaction_pin != null && String(r.transaction_pin).length > 0);
  return {
    name: (r.name as string) ?? (raw as User).name,
    username: (r.username as string) ?? (raw as User).username,
    email: (r.email as string) ?? (raw as User).email,
    phone: (r.phone as string) ?? (raw as User).phone,
    wallet: r.wallet != null ? String(r.wallet) : (raw as User).wallet,
    address: (r.address as string) ?? (raw as User).address,
    push_notification: (r.push_notification as boolean) ?? (raw as User).push_notification,
    biometric_enabled: (r.biometric_enabled as boolean) ?? (raw as User).biometric_enabled,
    user_type: (r.user_type as string) ?? (raw as User).user_type,
    user_level: (r.user_level as string) ?? (raw as User).user_level,
    bonus: r.bonus != null ? String(r.bonus) : (raw as User).bonus,
    has_transaction_pin: hasPin,
    user_limit: r.user_limit != null ? Number(r.user_limit) : (raw as User).user_limit ?? 0,
    daily_limit: r.daily_limit != null ? Number(r.daily_limit) : (raw as User).daily_limit ?? 0,
    created_at: (r.created_at as string) ?? (raw as User).created_at,
    updated_at: (r.updated_at as string) ?? (raw as User).updated_at,
    isAdmin: r.isAdmin === true || r.isAdmin === 1 || Boolean((raw as User).isAdmin),
    is_staff: r.is_staff === true || r.is_staff === 1 || Boolean((raw as User).is_staff),
    reserved_account: (r.reserved_account as User['reserved_account']) ?? (raw as User).reserved_account,
    profile_picture_url: (r.profile_picture_url as string) ?? (raw as User).profile_picture_url,
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Email stored after register or "verify email" flow; used on verify-otp page. */
  pendingVerifyEmail: string | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  resetState: () => void;
  clearError: () => void;
  hydrate: () => void;
  login: (payload: LoginPayload) => Promise<boolean>;
  googleLogin: (accessToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  /** Fetch current user from API and merge into state (call after login). */
  fetchUser: () => Promise<boolean>;
  /** Update profile picture (file upload). */
  updateProfilePicture: (file: File) => Promise<boolean>;
  /** Set email for verification flow (e.g. when "verify email" required on purchase). */
  setEmailForVerification: (email: string) => void;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  verifyRegistrationOtp: (email: string, otp: number) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
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
  isHydrated: false,

  resetState: () => {
    setStorage(null, null);
    setPendingVerifyEmailStorage(null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      pendingVerifyEmail: null,
      error: null,
      isHydrated: true,
    });
  },

  clearError: () => set({ error: null }),

  hydrate: () => {
    const token = getStoredToken();
    const user = getStoredUser();
    const pendingVerifyEmail = getStoredPendingVerifyEmail();
    if (token && user) {
      set({ token, user, isAuthenticated: true, pendingVerifyEmail: pendingVerifyEmail ?? null, isHydrated: true });
    } else {
      set({ token: null, user: null, isAuthenticated: false, pendingVerifyEmail: pendingVerifyEmail ?? null, isHydrated: true });
    }
  },

  setTokenAndUser: (token: string, user: User) => {
    setStorage(token, user);
    set({ token, user, isAuthenticated: true, error: null });
  },

  fetchUser: async () => {
    const current = get();
    if (!current.token) return false;
    set({ isLoading: true, error: null });
    try {
      const res = await userApi.getCurrentUser();
      const raw = res?.data as Record<string, unknown> | undefined;
      if (raw) {
        const user = normalizeUser(raw);
        setStorage(current.token, user);
        set({ user, error: null, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to fetch user';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  updateProfilePicture: async (file: File) => {
    const current = get();
    if (!current.token) return false;
    set({ isLoading: true, error: null });
    try {
      const url = await uploadImageToCloudinary(file);
      const res = await userApi.updateProfilePicture(url);
      const raw = res?.data as Record<string, unknown> | undefined;
      if (raw && (res?.status === 'successful' || res?.status === 'success')) {
        const user = normalizeUser(raw);
        setStorage(current.token, user);
        set({ user, error: null, isLoading: false });
        return true;
      }
      set({ isLoading: false, error: res?.message ?? 'Failed to update profile picture' });
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update profile picture';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  setEmailForVerification: (email: string) => {
    setPendingVerifyEmailStorage(email);
    set({ pendingVerifyEmail: email });
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
      const rawUser = (dataObj?.user ?? result?.user ?? payloadRes?.user ?? res?.user) as Record<string, unknown> | User | undefined;
      const userFromToken = rawUser && typeof (rawUser as Record<string, unknown>)?.token === 'string' ? (rawUser as User & { token: string }).token : undefined;
      const finalToken = token ?? userFromToken;
      const userToStore = rawUser ? normalizeUser(rawUser as Record<string, unknown>) : (finalToken ? ({ has_transaction_pin: true } as User) : undefined);
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

  googleLogin: async (accessToken: string) => {
    get().clearError();
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.googleAuth(accessToken) as unknown as Record<string, unknown>;
      const data = res?.data as Record<string, unknown> | string | undefined;
      const dataObj = typeof data === 'object' && data !== null ? data : undefined;
      const token = (dataObj?.token ?? dataObj?.access_token ?? dataObj?.accessToken ?? (typeof data === 'string' ? data : undefined)) as string | undefined;
      const rawUser = dataObj?.user as Record<string, unknown> | User | undefined;
      const userToStore = rawUser ? normalizeUser(rawUser as Record<string, unknown>) : (token ? ({ has_transaction_pin: true } as User) : undefined);
      if (token && userToStore) {
        const tokenToStore = typeof token === 'string' ? token : String(token);
        setStorage(tokenToStore, userToStore);
        set({ token: tokenToStore, user: userToStore, isAuthenticated: true, error: null, isLoading: false });
        // Fetch full user data after Google login
        await get().fetchUser();
        return true;
      }
      const msg = typeof res?.message === 'string' ? res.message : 'Google authentication failed';
      set({ isLoading: false, error: msg });
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Google authentication failed';
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
