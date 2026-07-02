import { useState, useEffect, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../app/session';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithGoogle,
  fetchEnabledProviders,
} from '../lib/auth';
import './auth.css';

type Mode = 'signin' | 'signup';

export function LoginPage({ initialMode = 'signin' }: { initialMode?: Mode }) {
  const { session, loading } = useSession();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchEnabledProviders().then((p) => {
      if (alive) setGoogleEnabled(p.google);
    });
    return () => {
      alive = false;
    };
  }, []);

  // 이미 로그인 상태면 앱으로
  if (isSupabaseConfigured && !loading && session) {
    return <Navigate to="/app" replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signInWithPassword(email, password);
        if (error) setError(error.message);
        // 성공 시 onAuthStateChange → 세션 갱신 → 위 Navigate 로 이동
      } else {
        const { data, error } = await signUpWithPassword(email, password);
        if (error) setError(error.message);
        else if (!data.session) {
          setNotice('확인 이메일을 보냈습니다. 메일함을 확인해 주세요.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) setError(error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  const disabled = busy || !isSupabaseConfigured;

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__brand">sub-keeper</h1>
        <p className="auth__subtitle">{mode === 'signin' ? '로그인' : '회원가입'}</p>

        {!isSupabaseConfigured ? (
          <p className="auth__hint">
            Supabase 미설정: <code>apps/web/.env</code> 를 채우면 로그인이 활성화됩니다.
          </p>
        ) : null}

        <form className="auth__form" onSubmit={onSubmit}>
          <input
            className="auth__input"
            type="email"
            required
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth__input"
            type="password"
            required
            minLength={6}
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth__btn auth__btn--primary" type="submit" disabled={disabled}>
            {busy ? '처리 중…' : mode === 'signin' ? '로그인' : '회원가입'}
          </button>
        </form>

        {googleEnabled ? (
          <button className="auth__btn auth__btn--secondary" type="button" onClick={onGoogle}>
            Google 로 계속하기
          </button>
        ) : null}

        {error ? <p className="auth__error">{error}</p> : null}
        {notice ? <p className="auth__notice">{notice}</p> : null}

        <button
          className="auth__switch"
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError(null);
            setNotice(null);
          }}
        >
          {mode === 'signin' ? '계정이 없나요? 회원가입' : '이미 계정이 있나요? 로그인'}
        </button>
      </div>
    </div>
  );
}
