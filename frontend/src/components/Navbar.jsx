import React from 'react';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu button could go here */}
          <h2 className="text-xl font-semibold text-gray-800">EmployeeSphere</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors">
            <User size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
          <button className="flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-medium hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
