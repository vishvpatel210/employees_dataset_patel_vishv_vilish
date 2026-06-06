import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { getInitials } from '../utils/helpers';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">EmployeeSphere</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user?.name || user?.email || 'U')}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name || user?.email || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
