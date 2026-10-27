import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    role: 'customer' | 'provider' | null;
    isLoggedIn: boolean;
    setUser: (user: User | null) => void;
    setRole: (role: 'customer' | 'provider') => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isLoggedIn: false,
    
    setUser: (user) => set({ user, isLoggedIn: !!user }),
    setRole: (role) => set({ role }),
    logout: () => set({ user: null, role: null, isLoggedIn: false }),
}));