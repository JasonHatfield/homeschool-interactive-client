import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isLoggedIn) {
      // Teachers can access the admin route, and their own dashboard
      if (authState.role === 'ROLE_TEACHER') {
        return; // Allow teachers access to the route
      }

      // Redirect other roles if they don't have permission for the current route
      if (!allowedRoles.includes(authState.role)) {
        const redirectPath = authState.role === 'ROLE_STUDENT' ? '/student' : '/';
        navigate(redirectPath);
      }
    } else {
      // If not logged in, redirect to the login page
      navigate("/");
    }
  }, [authState, navigate, allowedRoles]);

  if (!authState.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
