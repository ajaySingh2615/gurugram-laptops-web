import { create } from 'zustand';
import { AuthService } from '@/services/auth.service';

interface AuthState {
  user: { 
    userId: string;
    fullName: string;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'BANNED';
  } | null;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initializeAuth: () => Promise<void>;
  setUser: (user: { userId: string; fullName: string; email: string; role: 'USER' | 'ADMIN'; status: 'ACTIVE' | 'BANNED' } | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isInitialized: false,

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const user = await AuthService.getMe();
      set({ user, isInitialized: true, isLoading: false });
    } catch (error) {
      // If getMe fails (401), the user is not logged in.
      set({ user: null, isInitialized: true, isLoading: false });
    }
  },

  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      set({ user: null });
    }
  }
}));
