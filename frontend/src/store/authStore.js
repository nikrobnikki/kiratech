import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user:    JSON.parse(localStorage.getItem('user') || 'null'),
  token:   localStorage.getItem('token') || null,
  loading: false,
  error:   null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      const user = data.user;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (_) {
      get().logout();
    }
  },

  isAuthenticated: () => !!get().token,
  isAdmin: ()       => get().user?.role === 'admin',
  isTechnician: ()  => get().user?.role === 'technician',
  isCustomer: ()    => get().user?.role === 'customer',
}));

export default useAuthStore;
