import { supabase } from '@/supabase-client';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const useSessions = () => {
  const [session, setSession] = useState<Session | null>(null);

  const fetchSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  return { session, setSession };
};

export default useSessions;
