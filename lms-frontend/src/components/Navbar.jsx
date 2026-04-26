import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/40 border-b border-white/10 text-white transition">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          LMS<span className="text-cyan-400">Pro</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-5 text-sm">
          
          {user?.role!="instructor"&& (
            <Link to="/courses" className="hover:text-cyan-400 transition">
              Courses
            </Link>
          )}

          {user?.role === "student" && (
            <Link to="/dashboard" className="hover:text-cyan-400 transition">
              Dashboard
            </Link>
          )}

          {(user?.role === "instructor" || user?.role === "admin") && (
            <>
              <Link to="/instructor/dashboard" className="hover:text-cyan-400 transition">
                Dashboard
              </Link>

              <Link
                to="/instructor/panel"
                className="hover:text-cyan-400 transition"
              >
                Instructor
              </Link>
            </>
          )}

          {!user ? (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-md bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition shadow-[0_0_10px_#22d3ee]"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
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