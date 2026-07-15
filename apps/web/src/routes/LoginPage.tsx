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

/** 구글 "G" 마크 — 무채색 규칙에 따라 currentColor 단색 렌더링. */
function GoogleMark() {
  return (
    <svg className="auth__gmark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

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
      <div className="auth__panel">
        <header>
          <h1 className="auth__brand">구독모아</h1>
          <p className="auth__subtitle">
            흩어진 구독을 한곳에 모아
            <br />
            다음 결제일까지 한눈에 관리해요.
          </p>
        </header>

        {!isSupabaseConfigured ? (
          <p className="auth__hint">
            Supabase 미설정: <code>apps/web/.env</code> 를 채우면 로그인이 활성화됩니다.
          </p>
        ) : null}

        {error ? (
          <div className="auth__error">
            <span className="auth__error-mark">!</span>
            <span>{error}</span>
          </div>
        ) : null}

        <form className="auth__form" onSubmit={onSubmit}>
          <label className="auth__field">
            <span className="auth__label">이메일</span>
            <input
              className="auth__input"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="auth__field">
            <span className="auth__label">비밀번호</span>
            <input
              className="auth__input"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="auth__actions">
            <button className="auth__btn auth__btn--primary" type="submit" disabled={disabled}>
              {busy ? (
                <>
                  <span className="auth__spinner" aria-hidden="true" />
                  {mode === 'signin' ? '로그인 중…' : '가입 중…'}
                </>
              ) : mode === 'signin' ? (
                '로그인'
              ) : (
                '회원가입'
              )}
            </button>
            {googleEnabled ? (
              <button className="auth__btn auth__btn--secondary" type="button" onClick={onGoogle}>
                <GoogleMark />
                Google 로 계속하기
              </button>
            ) : null}
          </div>
        </form>

        {notice ? <p className="auth__notice">{notice}</p> : null}

        <div className="auth__links">
          <button
            className="auth__link"
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
    </div>
  );
}
