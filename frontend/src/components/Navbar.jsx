import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LogOut,
  Sun,
  Moon,
  Menu,
  User,
  Settings,
  ChevronRight,
  Home,
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { toggleTheme, toggleSidebar } from '../store/slices/uiSlice';
import { getInitials } from '../utils/helpers';
import {
  Box,
  Typography,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';

const routeLabels = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/departments': 'Departments',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { theme, sidebarOpen } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentLabel = routeLabels[location.pathname] || pathSegments[pathSegments.length - 1] || 'Dashboard';

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate('/auth/login', { replace: true });
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <header
      className={`sticky top-0 z-30 transition-colors duration-200 ${
        isDark ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className={`p-2 rounded-lg transition-colors lg:hidden ${
              isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className={`text-lg font-bold hidden sm:block ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              Employee<span className="text-blue-600">Sphere</span>
            </span>
          </Link>
        </div>

        {/* Center - Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link
            to="/"
            className={`transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Home size={16} />
          </Link>
          {pathSegments.length > 0 && (
            <ChevronRight size={14} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
          )}
          {pathSegments.map((seg, i) => {
            const path = '/' + pathSegments.slice(0, i + 1).join('/');
            const label = routeLabels[path] || seg.charAt(0).toUpperCase() + seg.slice(1);
            return (
              <span key={path} className="flex items-center gap-1">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
                {i < pathSegments.length - 1 && (
                  <ChevronRight size={14} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
                )}
              </span>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </Tooltip>

          {/* User Menu */}
          <button
            onClick={handleMenuOpen}
            className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.75rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              }}
            >
              {getInitials(user?.name || user?.email || 'U')}
            </Avatar>
            <span className={`text-sm font-medium hidden sm:block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {user?.name || user?.email || 'User'}
            </span>
          </button>

          <MuiMenu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                bgcolor: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#e2e8f0' : '#1e293b',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>{user?.name || 'User'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email || ''}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
              <ListItemIcon><Settings size={18} /></ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
              <ListItemIcon sx={{ color: '#ef4444' }}><LogOut size={18} /></ListItemIcon>
              Logout
            </MenuItem>
          </MuiMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
