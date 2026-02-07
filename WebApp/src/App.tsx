// ============================================
// Main App Component with Routing
// ============================================

import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout';
import { Skeleton } from './components/ui';
import { useUIStore } from './store/uiStore';
import { useUserStore } from './store/userStore';
import { useTaskStore } from './store/taskStore';
import { useAchievementStore } from './store/achievementStore';
import './index.css';

// Lazy load screens for code splitting
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const TasksScreen = lazy(() => import('./screens/TasksScreen'));
const TaskDetailScreen = lazy(() => import('./screens/TaskDetailScreen'));
const RiskDetailScreen = lazy(() => import('./screens/RiskDetailScreen'));
const AchievementsScreen = lazy(() => import('./screens/AchievementsScreen'));
const StatisticsScreen = lazy(() => import('./screens/StatisticsScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));

// Loading fallback component
const PageLoader = () => (
  <div className="container mx-auto px-4 py-6 space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-40 w-full rounded-2xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-6 w-32" />
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  </div>
);

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]); // location.key changes on every navigation including browser back/forward
  
  return null;
}

function App() {
  const { theme, initTheme } = useUIStore();
  const { initializeUser, currentUser } = useUserStore();
  const { initializeTasks } = useTaskStore();
  const { initializeAchievements } = useAchievementStore();

  // Initialize theme and stores on mount
  useEffect(() => {
    initTheme();
    initializeUser();
  }, [initTheme, initializeUser]);

  // Initialize tasks and achievements when user is loaded
  useEffect(() => {
    if (currentUser?.id) {
      initializeTasks(currentUser.id);
      initializeAchievements(currentUser.id);
    }
  }, [currentUser?.id, initializeTasks, initializeAchievements]);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Dashboard / Challenges */}
              <Route path="/" element={<DashboardScreen />} />

              {/* Für dich (For You) */}
              <Route path="/fuer-dich" element={<TasksScreen />} />

              {/* Benefits */}
              <Route path="/benefits" element={<AchievementsScreen />} />

              {/* Spenden (Donations) */}
              <Route path="/spenden" element={<StatisticsScreen />} />

              {/* Konto (Account) */}
              <Route path="/konto" element={<SettingsScreen />} />

              {/* Legacy routes - redirect to new paths */}
              <Route path="/aufgaben" element={<TasksScreen />} />
              <Route path="/aufgaben/:id" element={<TaskDetailScreen />} />
              <Route path="/risiko/:riskId" element={<RiskDetailScreen />} />
              <Route path="/erfolge" element={<AchievementsScreen />} />
              <Route path="/statistik" element={<StatisticsScreen />} />
              <Route path="/einstellungen" element={<SettingsScreen />} />

              {/* Profile - redirects to konto */}
              <Route path="/profil" element={<Navigate to="/konto" replace />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
