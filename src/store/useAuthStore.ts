import {create} from 'zustand'

// Defining the shape of our state
type UserRole = 'customer' | 'provider' |  null;

interface AuthState {
    role: UserRole;
    isLoggedIn: Boolean;

    // Actions
    setRole: (role: UserRole) => void;
    logout : () => void;
}

// Creating the Store

export const useAuthStore = create<AuthState>((set) => ({
    role : null,
    isLoggedIn : false,

    // When this is called, it updates the role globally

    setRole : (role) => set ({ role, isLoggedIn: role !== null}),

    // When this is called, it resets everything

    logout : () => set ({ role: null, isLoggedIn: false}),
}));