import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, Users, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <aside className="w-full lg:w-64 admin-sidebar-bg shadow-lg lg:shadow-none lg:border-r border-gray-200">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between lg:justify-start mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl md:text-2xl mr-3">
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-text-primary">{currentUser?.name || 'Administrator'}</h2>
              <p className="text-sm text-text-secondary capitalize">{currentUser?.role || 'admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive('/admin/dashboard')
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Dashboard</span>
          </Link>

          <Link
            to="/admin/attendance"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive('/admin/attendance')
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
            }`}
          >
            <ClipboardCheck className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Attendance</span>
          </Link>

          <Link
            to="/admin/employees"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive('/admin/employees')
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
            }`}
          >
            <Users className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Employees</span>
          </Link>

          <Link
            to="/admin/calendar"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive('/admin/calendar')
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
            }`}
          >
            <Calendar className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Calendar</span>
          </Link>
        </nav>

        <div className="hidden lg:block mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-text-secondary hover:bg-gray-50 hover:text-text-primary rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
