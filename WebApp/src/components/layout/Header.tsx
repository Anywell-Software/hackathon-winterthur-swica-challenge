// ============================================
// Application Header - Clean Modern Style
// ============================================

import { memo } from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

export const Header = memo(function Header() {
  const { currentUser } = useUserStore();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left side - App name/logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A39D] to-[#008C87] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00A39D] rounded-full"></span>
          </button>
          <Link
            to="/konto"
            className="w-10 h-10 rounded-full bg-[#00A39D] text-white flex items-center justify-center font-bold text-sm hover:bg-[#008C87] transition-colors"
          >
            {currentUser ? currentUser.name.substring(0, 2).toUpperCase() : <User className="w-5 h-5" />}
          </Link>
        </div>
      </div>
    </header>
  );
});

export default Header;
