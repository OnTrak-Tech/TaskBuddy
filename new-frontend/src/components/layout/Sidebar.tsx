import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { signOut, user } = useAuth()
  
  // Check if user is in the admin group or has admin email
  const groups = user?.signInUserSession?.accessToken?.payload['cognito:groups'] || [];
  const isAdminByGroup = Array.isArray(groups) && groups.includes('admin');
  const isAdminByEmail = user?.attributes?.email === 'kwesijay8@gmail.com';
  const isAdmin = isAdminByGroup || isAdminByEmail;

  return (
    <div className="w-64 bg-white shadow-md h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">TaskBuddy</h1>
      </div>
      
      <nav className="mt-6">
        <ul>
          {isAdmin && (
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center px-6 py-3 hover:bg-blue-50 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`
                }
              >
                Dashboard
              </NavLink>
            </li>
          )}
          
          {isAdmin && (
            <>
              <li>
                <NavLink 
                  to="/admin/tasks" 
                  className={({ isActive }) => 
                    `flex items-center px-6 py-3 hover:bg-blue-50 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`
                  }
                >
                  Manage Tasks
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/users" 
                  className={({ isActive }) => 
                    `flex items-center px-6 py-3 hover:bg-blue-50 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`
                  }
                >
                  Manage Users
                </NavLink>
              </li>
            </>
          )}
          
          {!isAdmin && (
            <li>
              <NavLink 
                to="/tasks" 
                className={({ isActive }) => 
                  `flex items-center px-6 py-3 hover:bg-blue-50 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`
                }
              >
                My Tasks
              </NavLink>
            </li>
          )}
          
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center px-6 py-3 hover:bg-blue-50 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`
              }
            >
              Profile
            </NavLink>
          </li>
          
          <li>
            <button 
              onClick={signOut}
              className="w-full text-left px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar