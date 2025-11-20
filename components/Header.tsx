'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Moon, Sun, Info } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  title: string;
  showHomeButton?: boolean;
  showAdminButton?: boolean;
}

export default function Header({ title, showHomeButton = false, showAdminButton = false }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showHomeButton && (
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Home"
            >
              <Home className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>
          )}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* About Button */}
          <Link
            href="/about"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center"
            aria-label="About"
          >
            <Info className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {mounted && (
              theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )
            )}
          </button>

          {/* Admin Button */}
          {showAdminButton && (
            <Link
              href={isAdminPage ? '/' : '/admin'}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center"
              aria-label={isAdminPage ? 'Exit Admin' : 'Admin Panel'}
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
