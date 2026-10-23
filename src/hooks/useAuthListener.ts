import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export function useAuthListener() {
  const { setRole, logout } = useAuthStore();

  useEffect(() => {
    // 1. Check for an active session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // For now, let's just set the role to 'customer' temporarily
        // Later, we will fetch their actual role from a profiles table
        setRole('customer'); 
      }
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setRole('customer');
      } else {
        logout();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
}