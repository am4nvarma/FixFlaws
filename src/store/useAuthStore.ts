import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    role: 'customer' | 'provider' | null;
    isLoggedIn: boolean;
    isInitializing: boolean; // <--- ADD THIS
    setUser: (user: User | null) => void;
    setRole: (role: 'customer' | 'provider' | null) => void;
    setInitializing: (val: boolean) => void; // <--- ADD THIS
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isLoggedIn: false,
    isInitializing: true, // <--- Default to true
    
    setUser: (user) => set({ user, isLoggedIn: !!user }),
    setRole: (role) => set({ role }),
    setInitializing: (val) => set({ isInitializing: val }),
    logout: () => set({ user: null, role: null, isLoggedIn: false }),
}));