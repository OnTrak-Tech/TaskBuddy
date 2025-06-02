'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { 
  FaTasks, 
  FaUser, 
  FaBell, 
  FaSignOutAlt, 
  FaUsers, 
  FaClipboardList, 
  FaTachometerAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export default function Sidebar() {
  const { isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userNavItems = [
    { name: 'Tasks', href: '/tasks', icon: FaTasks },
    { name: 'Profile', href: '/profile', icon: FaUser },
    { name: 'Notifications', href: '/notifications', icon: FaBell },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Tasks', href: '/admin/tasks', icon: FaClipboardList },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-primary-600 focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
        <div className="flex items-center justify-center flex-shrink-0 px-6">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
            <FaClipboardList className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">TaskBuddy</span>
        </div>
        <div className="mt-6 flex flex-col flex-1">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-5 w-5'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto px-3 py-4">
            <button
              onClick={signOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <FaSignOutAlt className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75 transition-opacity',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleMobileMenu}
      />

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform ease-in-out duration-300 lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
            <FaClipboardList className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">TaskBuddy</span>
        </div>
        <nav className="mt-5 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-5 w-5'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-3 py-4 border-t border-gray-200">
          <button
            onClick={() => {
              signOut();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <FaSignOutAlt className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}