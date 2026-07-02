import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@sub-keeper/core';
import { supabase } from '../lib/supabase';

interface SessionState {
  session: Session | null;
  loading: boolean;
}

const SessionContext = createContext<SessionState>({
  session: null,
  loading: true,
});

/** 실제 Supabase auth 세션을 구독해 앱 전역에 제공한다. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // env 미설정(클라이언트 null)이면 세션 없이 셸만 렌더
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): SessionState {
  return useContext(SessionContext);
}
