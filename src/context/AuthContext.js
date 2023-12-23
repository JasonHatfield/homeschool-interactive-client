import React, { createContext, useState, useEffect } from "react";
import apiClient, { setAuthToken } from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const initialState = {
        isLoggedIn: false,
        role: null,
        token: null,
        userId: null,
        loginError: null
    };

    const [authState, setAuthState] = useState(initialState);

    // Function to handle user login
    const login = async (credentials) => {
        try {
            const response = await apiClient.post('/api/auth/login', credentials);
            const { token, role, userId } = response.data;

            // Store token, role, and userId in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId.toString());

            // Set the token in the header for subsequent requests
            setAuthToken(token);

            // Update authState with login information
            setAuthState({ isLoggedIn: true, role, token, userId });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;

            // Update authState with login error message
            setAuthState(prevState => ({ ...prevState, loginError: errorMessage }));
        }
    };

    // Function to handle user logout
    const logout = () => {
        // Remove token, role, and userId from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');

        // Clear the token in the header
        setAuthToken(null);

        // Update authState to reflect logged out state
        setAuthState({ isLoggedIn: false, role: null, token: null, userId: null, loginError: null });
    };

    useEffect(() => {
        // Check if token and userId exist in local storage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            // Set the token in the header
            setAuthToken(token);

            // Update authState with logged in user information
            setAuthState({ isLoggedIn: true, role, token, userId: parseInt(userId, 10) });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
