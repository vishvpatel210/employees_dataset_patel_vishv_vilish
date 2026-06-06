import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { toggleSidebar } from '../store/slices/uiSlice';

const MasterLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme, sidebarOpen } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';
  const isMobile = useMediaQuery('(max-width: 1023px)');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    if (isMobile) dispatch(toggleSidebar());
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <Navbar />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:flex transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}>
          <Sidebar />
        </div>

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            open={sidebarOpen}
            onClose={() => dispatch(toggleSidebar())}
            PaperProps={{
              sx: {
                width: 256,
                bgcolor: isDark ? '#111827' : '#fff',
                border: 'none',
              },
            }}
          >
            <Sidebar />
          </Drawer>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-[calc(100vh-65px)] w-full overflow-x-hidden">
          <div className={`flex-1 p-4 lg:p-6 transition-colors duration-200 ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MasterLayout;
