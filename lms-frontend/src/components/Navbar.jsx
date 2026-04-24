import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/40 border-b border-white/10 text-white transition">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          LMS<span className="text-cyan-400">Pro</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-5 text-sm">
          
          <Link
            to="/courses"
            className="hover:text-cyan-400 transition"
          >
            Courses
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="hover:text-cyan-400 transition"
            >
              Dashboard
            </Link>
          )}

          {user?.role === "instructor" && (
            <Link
              to="/instructor"
              className="hover:text-cyan-400 transition"
            >
              Instructor
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-md border border-white/20 hover:bg-white/10 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Auth */}
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-md bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition shadow-[0_0_10px_#22d3ee]"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-md bg-rose-500 hover:bg-rose-600 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;