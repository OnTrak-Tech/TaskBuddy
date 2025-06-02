import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FaTasks, FaUser, FaUsers, FaChartBar, FaBell, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';

export default function Sidebar() {
  const { isAdmin, signOut, user } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname.startsWith(path) ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-indigo-600 hover:text-white';
  };

  return (
    <div className="w-64 bg-indigo-800 flex flex-col h-full">
      <div className="flex items-center h-16 px-4 bg-indigo-900">
        <FaClipboardList className="h-6 w-6 text-indigo-300" />
        <h1 className="ml-3 text-xl font-bold text-white">TaskBuddy</h1>
      </div>
      
      <div className="mt-5 px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              {user?.attributes?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">{user?.attributes?.name || user?.username}</div>
            <div className="text-xs text-indigo-300">{isAdmin ? 'Administrator' : 'Team Member'}</div>
          </div>
        </div>
      </div>
      
      <nav className="mt-8 flex-1 px-2 space-y-1">
        {isAdmin ? (
          <>
            <Link href="/admin/dashboard" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/dashboard')}`}>
              <FaChartBar className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/users" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/users')}`}>
              <FaUsers className="mr-3 h-5 w-5" />
              Users
            </Link>
            <Link href="/admin/tasks" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/tasks')}`}>
              <FaTasks className="mr-3 h-5 w-5" />
              Tasks
            </Link>
          </>
        ) : (
          <>
            <Link href="/tasks" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/tasks')}`}>
              <FaTasks className="mr-3 h-5 w-5" />
              My Tasks
            </Link>
            <Link href="/notifications" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/notifications')}`}>
              <FaBell className="mr-3 h-5 w-5" />
              Notifications
            </Link>
          </>
        )}
        <Link href="/profile" className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/profile')}`}>
          <FaUser className="mr-3 h-5 w-5" />
          Profile
        </Link>
      </nav>
      
      <div className="px-2 py-4 mt-auto border-t border-indigo-700">
        <button
          onClick={() => {
            signOut();
            router.push('/');
          }}
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-indigo-600 hover:text-white w-full"
        >
          <FaSignOutAlt className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}