// ============================================
// Bottom Navigation - Clean Modern Style
// ============================================

import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, Award, BarChart3, User } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Start', icon: Home },
  { to: '/aufgaben', label: 'Vorsorge', icon: Calendar },
  { to: '/erfolge', label: 'Erfolge', icon: Award },
  { to: '/statistik', label: 'Statistik', icon: BarChart3 },
  { to: '/einstellungen', label: 'Profil', icon: User },
];

export const BottomNav = memo(function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to);

          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive
                ? 'text-[#00A39D]'
                : 'text-gray-400 dark:text-gray-500'
                }`} />
              <span className={`text-[10px] font-medium ${isActive
                ? 'text-[#00A39D]'
                : 'text-gray-500 dark:text-gray-400'
                }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
});

export default BottomNav;
