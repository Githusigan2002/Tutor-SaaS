import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Auth/LoginForm";
import Signup from "./components/Auth/SignupForm";
import Profile from "./pages/Profile";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import TutorDashboard from "./pages/Dashboard/TutorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={user ? <Profile /> : <Login />} />
      <Route
        path="/dashboard/student"
        element={user?.role === "student" ? <StudentDashboard /> : <Login />}
      />
      <Route
        path="/dashboard/tutor"
        element={user?.role === "tutor" ? <TutorDashboard /> : <Login />}
      />
      <Route
        path="/dashboard/admin"
        element={user?.role === "admin" ? <AdminDashboard /> : <Login />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
