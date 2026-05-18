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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.accessToken);
    syncToExtension(data.accessToken);
    set({ user: data.user, token: data.accessToken, loading: false });
  },

  register: async (email, password, name) => {
    set({ loading: true });
    const { data } = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('token', data.accessToken);
    syncToExtension(data.accessToken);
    set({ user: data.user, token: data.accessToken, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    syncToExtension(null);
    set({ user: null, token: null });
  },

  init: () => {
    const token = localStorage.getItem('token');
    if (token) {
      syncToExtension(token);
      set({ token });
    }
  },
}));
