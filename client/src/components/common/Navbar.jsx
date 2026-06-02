import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };
  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-1.5 rounded-lg text-sm font-600 transition-all ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-600 font-700"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm"
        : "bg-white border-b border-gray-200"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">J</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-gray-900 text-base leading-tight tracking-tight">
              JobBoard
            </span>
            <span className="text-[10px] text-gray-400 font-500 leading-tight -mt-0.5">
              Find your next role
            </span>
          </div>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/jobs" className={navLinkClass("/jobs")}>Browse Jobs</Link>
          {user?.role === "jobseeker" && (
            <>
              <Link to="/seeker/applied-jobs" className={navLinkClass("/seeker/applied-jobs")}>Applications</Link>
              <Link to="/seeker/profile" className={navLinkClass("/seeker/profile")}>Profile</Link>
            </>
          )}
          {user?.role === "employer" && (
            <>
              <Link to="/employer/dashboard" className={navLinkClass("/employer/dashboard")}>Dashboard</Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login"
                className="text-sm font-600 text-gray-600 hover:text-gray-900 transition px-3 py-1.5 rounded-lg hover:bg-gray-100">
                Sign in
              </Link>
              <Link to="/register"
                className="text-sm font-700 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition shadow-sm">
                Get started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {user?.role === "employer" && (
                <Link to="/employer/create-job"
                  className="text-sm font-700 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm">
                  + Post Job
                </Link>
              )}
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-800 text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-700 text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize leading-tight">{user.role}</p>
                </div>
                <button onClick={handleLogout}
                  className="ml-1 text-xs font-600 text-gray-500 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5">
          <span className={`block h-0.5 w-5 bg-gray-700 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`block h-0.5 w-5 bg-gray-700 transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
          <span className={`block h-0.5 w-5 bg-gray-700 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1 fade-in">
          <Link to="/jobs" className="block px-3 py-2 rounded-lg text-sm font-600 text-gray-600 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {!user && (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-lg text-sm font-600 text-gray-600 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/register" className="block px-3 py-2 rounded-lg text-sm font-700 text-indigo-600 hover:bg-indigo-50"
                onClick={() => setMenuOpen(false)}>Get started</Link>
            </>
          )}
          {user?.role === "jobseeker" && (
            <>
              <Link to="/seeker/applied-jobs" className="block px-3 py-2 rounded-lg text-sm font-600 text-gray-600 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}>Applications</Link>
              <Link to="/seeker/profile" className="block px-3 py-2 rounded-lg text-sm font-600 text-gray-600 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          )}
          {user?.role === "employer" && (
            <>
              <Link to="/employer/dashboard" className="block px-3 py-2 rounded-lg text-sm font-600 text-gray-600 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/employer/create-job" className="block px-3 py-2 rounded-lg text-sm font-700 text-indigo-600 hover:bg-indigo-50"
                onClick={() => setMenuOpen(false)}>Post Job</Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-600 text-red-500 hover:bg-red-50">
              Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;