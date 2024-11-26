import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserProfile } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  customIcon?: string;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User & { profile: UserProfile }>) => void;
  updateIcon: (base64: string) => void;
  updateAvatar: (avatarUrl: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      customIcon: undefined,
      login: (user) => set({ user: { ...user, points: 0 }, isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      updateIcon: (base64) => set({ customIcon: base64 }),
      updateAvatar: (avatarUrl) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);