import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseListPage from "./pages/CourseListPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import InstructorDashboardPage from "./pages/InstructorDashboardPage";
import InstructorPanelPage from "./pages/InstructorPanelPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StudentLayoutShell from "./layouts/StudentLayoutShell";
import InstructorLayoutShell from "./layouts/InstructorLayoutShell";
import AdminLayoutShell from "./layouts/AdminLayoutShell";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import StudentMyCoursesPage from "./pages/StudentMyCoursesPage";
import StudentAssignmentsPage from "./pages/StudentAssignmentsPage";
import StudentQuizzesPage from "./pages/StudentQuizzesPage";
import QuizTakePage from "./pages/QuizTakePage";
import ForumPage from "./pages/ForumPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import CertificatesPage from "./pages/CertificatesPage";
import StudentCalendarPage from "./pages/StudentCalendarPage";
import ProfilePage from "./pages/ProfilePage";
import InstructorAssignmentsPage from "./pages/InstructorAssignmentsPage";
import InstructorAttendancePage from "./pages/InstructorAttendancePage";
import InstructorGradingPage from "./pages/InstructorGradingPage";
import InstructorCertificatesPage from "./pages/InstructorCertificatesPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminPlatformSettingsPage from "./pages/AdminPlatformSettingsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";

import LeaderboardPage from "./pages/LeaderboardPage";

/** Any signed-in user — for shared learning routes (e.g. video player). */
const AnyAuthLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

const App = () => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentLayoutShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="my-courses" element={<StudentMyCoursesPage />} />
          <Route path="assignments" element={<StudentAssignmentsPage />} />
          <Route path="quizzes" element={<StudentQuizzesPage />} />
          <Route path="quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="calendar" element={<StudentCalendarPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="profile" element={<ProfilePage title="Student profile" />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
        </Route>

        <Route
          path="/instructor"
          element={
            <ProtectedRoute roles={["instructor", "admin"]}>
              <InstructorLayoutShell />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<InstructorDashboardPage />} />
          <Route path="panel" element={<InstructorPanelPage />} />
          <Route path="assignments" element={<InstructorAssignmentsPage />} />
          <Route path="grading" element={<InstructorGradingPage />} />
          <Route path="attendance" element={<InstructorAttendancePage />} />
          <Route path="certificates" element={<InstructorCertificatesPage />} />
          <Route path="profile" element={<ProfilePage title="Instructor profile" />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayoutShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminPlatformSettingsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="profile" element={<ProfilePage title="Admin profile" />} />
        </Route>

        <Route element={<AnyAuthLayout />}>
          <Route path="/learn/:courseId" element={<VideoPlayerPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
