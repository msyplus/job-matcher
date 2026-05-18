import { create } from 'zustand';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
}

function syncToExtension(token: string | null) {
  if (typeof window !== 'undefined' && (window as any).chrome?.storage) {
    const chrome = (window as any).chrome;
    if (token) {
      chrome.storage.local.set({ token });
    } else {
      chrome.storage.local.remove('token');
    }
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  guestReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  init: () => Promise<void>;
  guestLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  guestReady: !!localStorage.getItem('token'),

  login: async (email, password) => {
    set({ loading: true });
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.accessToken);
    syncToExtension(data.accessToken);
    set({ user: data.user, token: data.accessToken, loading: false, guestReady: true });
  },

  register: async (email, password, name) => {
    set({ loading: true });
    const { data } = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('token', data.accessToken);
    syncToExtension(data.accessToken);
    set({ user: data.user, token: data.accessToken, loading: false, guestReady: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    syncToExtension(null);
    set({ user: null, token: null, guestReady: false });
  },

  init: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      syncToExtension(token);
      set({ token, guestReady: true });
    } else {
      // Auto guest login
      await get().guestLogin();
    }
  },

  guestLogin: async () => {
    try {
      const { data } = await api.post('/auth/guest');
      localStorage.setItem('token', data.accessToken);
      syncToExtension(data.accessToken);
      set({ user: data.user, token: data.accessToken, guestReady: true });
    } catch (e) {
      console.error('Guest login failed:', e);
      set({ guestReady: true }); // Don't block UI
    }
  },
}));
