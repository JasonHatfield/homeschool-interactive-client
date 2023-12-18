import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Update the import path as necessary

const ProtectedRoute = ({ children, requiredRole }) => {
    const { authState } = useContext(AuthContext);

    if (!authState.isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (requiredRole && authState.role !== requiredRole) {
        return <Navigate to="/unauthorized" />; // Redirect or handle unauthorized access
    }

    return children;
};

export default ProtectedRoute;
