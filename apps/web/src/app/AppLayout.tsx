import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { isSupabaseConfigured } from '../lib/supabase';
import '../styles/app.css';

export function AppLayout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="app__body">
        {!isSupabaseConfigured ? (
          <div className="app__banner">
            Supabase 환경변수가 설정되지 않았습니다 · <code>apps/web/.env</code> 를 채워주세요
          </div>
        ) : null}
        <main className="app__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
