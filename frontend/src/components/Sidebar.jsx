import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  CheckSquare,
  PieChart,
  Settings,
  Shield,
  UserCog,
  User,
} from 'lucide-react';
import { ROLES } from '../utils/constants';

const Sidebar = () => {
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const isDark = theme === 'dark';
  const isAdminOrHr = user?.role === ROLES.ADMIN || user?.role === ROLES.HR;

  const menuGroups = useMemo(
    () => [
      {
        label: 'Main',
        items: [
          { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
          { name: 'My Projects', path: '/my-projects', icon: <FolderKanban size={20} /> },
          { name: 'My Tasks', path: '/my-tasks', icon: <CheckSquare size={20} /> },
        ],
      },
      ...(isAdminOrHr
        ? [
            {
              label: 'Management',
              items: [
                { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
                { name: 'Departments', path: '/departments', icon: <Building2 size={20} /> },
                { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
                { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
              ],
            },
            {
              label: 'Insights',
              items: [{ name: 'Analytics', path: '/analytics', icon: <PieChart size={20} /> }],
            },
          ]
        : []),
      ...(isAdminOrHr
        ? [
            {
              label: 'Administration',
              items: [
                { name: 'Admin Dashboard', path: '/admin', icon: <Shield size={20} /> },
                { name: 'User Management', path: '/admin/users', icon: <UserCog size={20} /> },
              ],
            },
          ]
        : []),
      {
        label: 'System',
        items: [
          { name: 'Profile', path: '/profile', icon: <User size={20} /> },
          { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
        ],
      },
    ],
    [isAdminOrHr]
  );

  return (
    <aside
      className={`w-64 flex flex-col h-[calc(100vh-65px)] sticky top-[65px] transition-colors duration-200 ${
        isDark ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <nav className="space-y-6">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p
                className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? isDark
                              ? 'bg-blue-600/20 text-blue-400 shadow-sm'
                              : 'bg-blue-50 text-blue-700 shadow-sm'
                            : isDark
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(user?.name || user?.email || 'U')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {user?.name || user?.email || 'User'}
            </p>
            <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
