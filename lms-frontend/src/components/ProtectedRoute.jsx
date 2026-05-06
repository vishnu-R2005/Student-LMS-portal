import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const homePathForRole = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "instructor") return "/instructor/dashboard";
  if (role === "student") return "/dashboard";
  return "/login";
};

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const validRoles = ["student", "instructor", "admin"];
  if (loading) return <div className="p-6 text-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!validRoles.includes(user.role)) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }
  if (user.is_active === false) {
    return (
      <div className="p-8 text-center text-white">
        Your account has been deactivated. Please contact support.
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;

export { homePathForRole };
