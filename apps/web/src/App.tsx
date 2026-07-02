import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './landing/LandingPage';
import { AppLayout } from './app/AppLayout';
import { RequireAuth } from './app/RequireAuth';
import { LoginPage } from './routes/LoginPage';
import { DashboardPage } from './routes/DashboardPage';
import { SubscriptionsPage } from './routes/SubscriptionsPage';
import { AnalyticsPage } from './routes/AnalyticsPage';
import { RenewalsPage } from './routes/RenewalsPage';
import { ProfilePage } from './routes/ProfilePage';
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
          <Route
            path="*"
            element={<PagePlaceholder title="404" note="존재하지 않는 페이지입니다." />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
