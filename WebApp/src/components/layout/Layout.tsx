// ============================================
// Main Layout Wrapper - Modern Mobile-First Design
// ============================================

import { ReactNode, memo } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Toast } from '../ui';
import { useUIStore } from '../../store/uiStore';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = memo(function Layout({ children }: LayoutProps) {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="pb-20 lg:pb-8 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Toast Container */}
      <div className="fixed bottom-20 lg:bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message || toast.title}
            title={toast.title}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
});

export default Layout;
