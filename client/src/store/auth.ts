import { create } from 'zustand';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
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
    set({ user: data.user, token: data.accessToken, loading: false });
  },

  register: async (email, password, name) => {
    set({ loading: true });
    const { data } = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('token', data.accessToken);
    set({ user: data.user, token: data.accessToken, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  init: () => {
    const token = localStorage.getItem('token');
    if (token) set({ token });
  },
}));
