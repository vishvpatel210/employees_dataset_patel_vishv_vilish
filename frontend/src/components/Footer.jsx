const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EmployeeSphere. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span className="hover:text-gray-800 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gray-800 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
