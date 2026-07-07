import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './landing/LandingPage';
import { AppLayout } from './app/AppLayout';
import { RequireAuth } from './app/RequireAuth';
import { RequireAdmin } from './app/RequireAdmin';
import { LoginPage } from './routes/LoginPage';
import { DashboardPage } from './routes/DashboardPage';
import { SubscriptionsPage } from './routes/SubscriptionsPage';
import { AnalyticsPage } from './routes/AnalyticsPage';
import { RenewalsPage } from './routes/RenewalsPage';
import { ProfilePage } from './routes/ProfilePage';
import { InquiriesPage } from './routes/InquiriesPage';
import { AdminPage } from './routes/AdminPage';
import { AdminInquiriesPage } from './routes/AdminInquiriesPage';
import { PagePlaceholder } from './routes/PagePlaceholder';

export default function App() {
  return (
    <Routes>
      {/* 공개 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage initialMode="signin" />} />
      <Route path="/signup" element={<LoginPage initialMode="signup" />} />

      {/* 인증 필요 — /app 이하 */}
      <Route path="/app" element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="renewals" element={<RenewalsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route
            path="*"
            element={<PagePlaceholder title="404" note="존재하지 않는 페이지입니다." />}
          />
        </Route>
      </Route>

      {/* 관리자 전용 — /admin 이하 (비로그인 → /login, 비관리자 → /app) */}
      <Route path="/admin" element={<RequireAuth />}>
        <Route element={<RequireAdmin />}>
          <Route element={<AppLayout />}>
            <Route index element={<AdminPage />} />
            <Route path="inquiries" element={<AdminInquiriesPage />} />
            <Route
              path="*"
              element={<PagePlaceholder title="404" note="존재하지 않는 페이지입니다." />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
