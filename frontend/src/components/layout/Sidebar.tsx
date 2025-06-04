import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTasks, 
  FaUser, 
  FaSignOutAlt, 
  FaUsers, 
  FaClipboardList, 
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaPlus
} from 'react-icons/fa';

const Sidebar = () => {
  const { isAdmin, user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userNavItems = [
    { name: 'My Tasks', href: '/tasks', icon: FaTasks },
    { name: 'Profile', href: '/profile', icon: FaUser },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Manage Tasks', href: '/admin/tasks', icon: FaClipboardList },
    { name: 'Create Task', href: '/admin/tasks/create', icon: FaPlus },
    { name: 'Manage Users', href: '/admin/users', icon: FaUsers },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
        
        {/* User info */}
        <div className="mt-6 px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.attributes?.name || user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col flex-1">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive(item.href) 
                      ? 'text-primary-600' 
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-3 py-4">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <FaSignOutAlt className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform ease-in-out duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <FaClipboardList className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">TaskBuddy</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* User info mobile */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.attributes?.name || user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>
        </div>
        
        <nav className="mt-5 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 ${
                  isActive(item.href) 
                    ? 'text-primary-600' 
                    : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          ))}
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
};

export default Sidebar;