import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  return (
    <footer
      className={`mt-auto transition-colors duration-200 ${
        isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'
      }`}
    >
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          &copy; {new Date().getFullYear()} EmployeeSphere. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link
            to="/"
            className={`transition-colors no-underline ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Dashboard
          </Link>
          <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>|</span>
          <span
            className={`transition-colors cursor-pointer ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Privacy Policy
          </span>
          <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>|</span>
          <span
            className={`transition-colors cursor-pointer ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
