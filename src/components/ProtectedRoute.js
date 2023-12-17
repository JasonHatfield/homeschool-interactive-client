// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { authState } = useContext(AuthContext);
    const location = useLocation();

    if (!authState.isLoggedIn) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
