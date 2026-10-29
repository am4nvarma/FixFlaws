import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export function useAuthListener() {
  const { setUser, setRole, logout, setInitializing } = useAuthStore();

  useEffect(() => {
    const fetchUserRole = async (userId: string) => {
        const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
        if (data) setRole(data.role as 'customer' | 'provider');
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchUserRole(session.user.id);
      }
      // We are done checking! Turn off the loading screen.
      setInitializing(false); // <--- ADD THIS
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchUserRole(session.user.id);
      } else {
        logout();
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [setUser, setRole, logout, setInitializing]);
}