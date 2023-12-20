import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    // Log the authState for debugging
    console.log(authState);

    useEffect(() => {
        // Only execute the logic if authState is defined
        if (authState) {
            // Use authState.isLoggedIn to access the isLoggedIn property
            if (authState.isLoggedIn && !allowedRoles.includes(authState.role)) {
                // Redirect to appropriate role-based path
                const redirectPath = authState.role === 'ROLE_TEACHER' ? '/teacher' : '/student';
                navigate(redirectPath);
            }
        }
    }, [authState, navigate, allowedRoles]);

    // Use authState.isLoggedIn to check the login status
    if (!authState || !authState.isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
