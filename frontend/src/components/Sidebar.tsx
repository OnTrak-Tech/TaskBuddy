import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FaTasks, FaUser, FaUsers, FaChartBar, FaBell, FaSignOutAlt } from 'react-icons/fa';

export default function Sidebar() {
  const { isAdmin, signOut, user } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname.startsWith(path) ? 'bg-blue-700' : '';
  };

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col h-full">
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-2xl font-bold">TaskBuddy</h1>
      </div>
      
      <div className="p-4 border-b border-blue-700">
        <div className="text-sm opacity-75">Logged in as:</div>
        <div className="font-medium">{user?.attributes?.name || user?.username}</div>
        <div className="text-xs opacity-75">{isAdmin ? 'Administrator' : 'Team Member'}</div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {isAdmin ? (
            <>
              <li>
                <Link href="/admin/dashboard" className={`flex items-center p-2 rounded hover:bg-blue-700 ${isActive('/admin/dashboard')}`}>
                  <FaChartBar className="mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className={`flex items-center p-2 rounded hover:bg-blue-700 ${isActive('/admin/users')}`}>
                  <FaUsers className="mr-3" />
                  Users
                </Link>
              </li>
              <li>
                <Link href="/admin/tasks" className={`flex items-center p-2 rounded hover:bg-blue-700 ${isActive('/admin/tasks')}`}>
                  <FaTasks className="mr-3" />
                  Tasks
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/tasks" className={`flex items-center p-2 rounded hover:bg-blue-700 ${isActive('/tasks')}`}>
                  <FaTasks className="mr-3" />
                  My Tasks
                </Link>
              </li>
              <li>
                <Link href="/notifications" className={`flex items-center p-2 rounded hover:bg-blue-700 ${isActive('/notifications')}`}>
                  <FaBell className="mr-3" />
                  Notifications
                </Link>
              </li>
            </>
          )}
          <li>
            <Link href="/profile" className={`flex items-center p-2 rounded hover:bg-blue-700 ${isActive('/profile')}`}>
              <FaUser className="mr-3" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={() => {
            signOut();
            router.push('/');
          }}
          className="flex items-center p-2 w-full text-left rounded hover:bg-blue-700"
        >
          <FaSignOutAlt className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}