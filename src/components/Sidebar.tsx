import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, Users, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const navLinks = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      name: 'Attendance',
      icon: ClipboardCheck,
      path: '/admin/attendance',
    },
    {
      name: 'Employees',
      icon: Users,
      path: '/admin/employees',
    },
    {
      name: 'Calendar',
      icon: Calendar,
      path: '/admin/calendar',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="w-64 bg-white shadow-xl flex flex-col justify-between py-6 px-4 rounded-r-3xl overflow-y-auto" style={{ minHeight: '100vh' }}>
      <div>
        {/* Logo and System Name */}
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            CG
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">CollegeGate</h2>
            <p className="text-xs text-gray-500">ERP System</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="mb-2">
                <Link
                  to={link.path}
                  className={`flex items-center space-x-3 py-3 px-2 rounded-lg transition-colors duration-200 ${location.pathname.includes(link.path) ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* User Profile and Logout */}
      <div className="mt-auto">
        {currentUser && (
          <div className="flex items-center space-x-3 mb-6 px-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{currentUser.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 py-3 px-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full text-left transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 