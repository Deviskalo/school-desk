import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { account } from "@appwrite/client";
import { syncEngine } from "@sync/syncEngine";
import { ROLES } from "@shared/constants";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Login from "./pages/Auth/Login";
import InitialSetup from "./pages/Setup/InitialSetup";
import AdminDashboard from "./pages/Admin/Dashboard";
import TeacherDashboard from "./pages/Teacher/Dashboard";
import StudentDashboard from "./pages/Student/Dashboard";
import StudentList from "./pages/Students/StudentList";
import TeacherList from "./pages/Teachers/TeacherList";
import GradeList from "./pages/Grades/GradeList";
import AssignmentList from "./pages/Assignments/AssignmentList";
import MarkAttendance from "./pages/Attendance/MarkAttendance";
import UserManagement from "./pages/Admin/UserManagement";
import ActivateAccount from "./pages/Auth/ActivateAccount";
import AssignmentDetail from "./pages/Assignments/AssignmentDetail";

const App: React.FC = () => {
  const { user, setUser, setLoading, loading } = useAuthStore();
  const [setupNeeded, setSetupNeeded] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      // Check if first-time setup is needed
      if (window.electronAPI?.checkSetupNeeded) {
        try {
          const needed = await window.electronAPI.checkSetupNeeded();
          setSetupNeeded(needed);
        } catch {
          setSetupNeeded(false);
        }
      } else {
        setSetupNeeded(false);
      }

      // Check existing session
      try {
        const session = await account.get();
        setUser(session);
        syncEngine.start();
      } catch {
        setLoading(false);
      }
    };
    init();
  }, [user, setUser, setLoading]);

  if (loading || setupNeeded === null) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse">
          Initializing SchoolDesk...
        </p>
      </div>
    );
  }

  const role = (user?.prefs as any)?.role || ROLES.STUDENT;

  const getDashboard = () => {
    switch (role) {
      case ROLES.ADMIN:
        return <AdminDashboard />;
      case ROLES.TEACHER:
        return <TeacherDashboard />;
      case ROLES.STUDENT:
        return <StudentDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* First-run setup */}
        <Route
          path="/setup"
          element={
            setupNeeded ? (
              <InitialSetup onSetupComplete={() => setSetupNeeded(false)} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/activate" element={<ActivateAccount />} />

        <Route
          path="/login"
          element={
            setupNeeded ? (
              <Navigate to="/setup" />
            ) : !user ? (
              <Login />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          element={
            user ? (
              <DashboardLayout />
            ) : (
              <Navigate to={setupNeeded ? "/setup" : "/login"} />
            )
          }
        >
          <Route path="/dashboard" element={getDashboard()} />

          {/* Module routes */}
          <Route path="/students" element={<StudentList />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/attendance" element={<MarkAttendance />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/grades" element={<GradeList />} />
          <Route path="/assignments" element={<AssignmentList />} />
          <Route path="/assignments/:id" element={<AssignmentDetail />} />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to={setupNeeded ? "/setup" : user ? "/dashboard" : "/login"}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
