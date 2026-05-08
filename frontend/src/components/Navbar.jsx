import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-gray-900 font-semibold'
      : 'text-gray-500 hover:text-gray-900';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-200">
            <span className="text-white text-xs font-bold">HN</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">Scraper</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className={`text-sm transition-colors duration-200 ${isActive('/')}`}>
            Stories
          </Link>
          {user && (
            <Link
              to="/bookmarks"
              className={`text-sm transition-colors duration-200 ${isActive('/bookmarks')}`}
            >
              Bookmarks
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:block">{user.name}</span>
              <button
                onClick={logout}
                id="logout-btn"
                className="btn-secondary text-xs px-3 py-1.5"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" id="login-link" className="btn-secondary text-xs px-3 py-1.5">
                Sign in
              </Link>
              <Link to="/register" id="register-link" className="btn-primary text-xs px-3 py-1.5">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
