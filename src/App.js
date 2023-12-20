import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { authState } = useContext(AuthContext);

  return (
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
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
