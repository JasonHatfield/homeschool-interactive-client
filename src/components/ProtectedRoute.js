import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isLoggedIn && !allowedRoles.includes(authState.role)) {
      const redirectPath =
        authState.role === "ROLE_TEACHER" ? "/teacher" : "/student";
      navigate(redirectPath);
    }
  }, [authState, navigate, allowedRoles]);

  if (!authState.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
