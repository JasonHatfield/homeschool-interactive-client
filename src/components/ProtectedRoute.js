import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authState } = useContext(AuthContext);

  // Redirect to login page if not logged in
  if (!authState.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Allow access if the user has a role that is included in the allowedRoles
  if (allowedRoles.includes(authState.role)) {
    return children;
  }

  // If the user's role is not in the allowedRoles,
  // but the user is a teacher, allow access to the admin route as well
  if (authState.role === 'ROLE_TEACHER') {
    return children;
  }

  // Redirect to a default or home page if the user does not have the right role
  return <Navigate to="/teacher" replace />;
};

export default ProtectedRoute;
