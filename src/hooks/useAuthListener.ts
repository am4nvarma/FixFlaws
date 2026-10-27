import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export function useAuthListener() {
  // 1. Grab the new setUser function from Zustand
  const { setUser, setRole, logout } = useAuthStore();

  useEffect(() => {
    // 2. Check for an active session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user); // <--- Save the actual user object (contains ID, email)
        setRole('customer');   // Temporary: we will make this dynamic later
      }
    });

    // 3. Listen for auth changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user); // <--- Save the user on login
        setRole('customer'); 
      } else {
        logout(); // <--- Clears user and role on logout
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setRole, logout]); // Added dependency to update The Tabs
}