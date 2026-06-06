import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MasterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex flex-col w-full min-h-[calc(100vh-65px)]">
          <div className="flex-1 p-6">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MasterLayout;
