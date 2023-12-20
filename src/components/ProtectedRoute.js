import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authState } = useContext(AuthContext);

    if (!authState.isLoggedIn || !allowedRoles.includes(authState.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
