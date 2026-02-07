// ============================================
// Sidebar Navigation (Desktop)
// ============================================

import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  Trophy,
  BarChart3,
  Settings,
  User,
  Heart,
  Brain,
  Dumbbell,
  Users,
  Wallet,
  Apple,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { CATEGORY_META, type TaskCategory } from '../../types';

const categoryIcons: Record<TaskCategory, React.ReactNode> = {
  medical: <Heart className="w-4 h-4" />,
  mental_health: <Brain className="w-4 h-4" />,
  fitness: <Dumbbell className="w-4 h-4" />,
  social: <Users className="w-4 h-4" />,
  financial: <Wallet className="w-4 h-4" />,
  nutrition: <Apple className="w-4 h-4" />,
};

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  { to: '/aufgaben', label: 'Alle Aufgaben', icon: <CheckSquare className="w-5 h-5" /> },
  { to: '/erfolge', label: 'Erfolge', icon: <Trophy className="w-5 h-5" /> },
  { to: '/statistik', label: 'Statistik', icon: <BarChart3 className="w-5 h-5" /> },
];

const secondaryNavItems: NavItem[] = [
  { to: '/profil', label: 'Profil', icon: <User className="w-5 h-5" /> },
  { to: '/einstellungen', label: 'Einstellungen', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar = memo(function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const location = useLocation();

  const categories = Object.entries(CATEGORY_META) as [TaskCategory, typeof CATEGORY_META[TaskCategory]][];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold">
                <span className="text-primary">Hack Winterthur 2026</span>
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Sidebar schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.to || 
                  (item.to !== '/' && location.pathname.startsWith(item.to));

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Categories Section */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Kategorien
              </h3>
              <div className="space-y-1">
                {categories.map(([key, meta]) => (
                  <NavLink
                    key={key}
                    to={`/aufgaben?kategorie=${key}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                    >
                      {categoryIcons[key]}
                    </div>
                    <span className="text-sm">{meta.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Secondary Navigation */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Einstellungen
              </h3>
              <div className="space-y-1">
                {secondaryNavItems.map((item) => {
                  const isActive = location.pathname === item.to;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 text-center">
              Hack Winterthur 2026 VorsorgeGuide v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;
