import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import "./App.css";

/**
 * The main component of the application.
 * Renders the header, routes, and footer components with role-based route protection.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={
              <ProtectedRoute requiredRole="TEACHER">
                <Register />
              </ProtectedRoute>
            } />
            <Route path="/student" element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teacher" element={
              <ProtectedRoute requiredRole="TEACHER">
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="TEACHER">
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
