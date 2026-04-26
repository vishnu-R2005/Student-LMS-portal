import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseListPage from "./pages/CourseListPage";
import DashboardPage from "./pages/DashboardPage";
import InstructorPanelPage from "./pages/InstructorPanelPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import InstructorDashboardPage from "./pages/InstructorDashboardPage";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learn/:courseId"
          element={
            <ProtectedRoute>
              <VideoPlayerPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/instructor/dashboard"
  element={
    <ProtectedRoute roles={["instructor", "admin"]}>
      <InstructorDashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/instructor/panel"
  element={
    <ProtectedRoute roles={["instructor", "admin"]}>
      <InstructorPanelPage />
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;