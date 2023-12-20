import React, { createContext, useState, useEffect } from "react";
import apiClient from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage to persist login state
    const initialState = {
        isLoggedIn: localStorage.getItem('token') ? true : false,
        role: localStorage.getItem('role') || null,
        token: localStorage.getItem('token') || null,
        loginError: null
    };

    const [authState, setAuthState] = useState(initialState);

    // Login function
    const login = async (credentials) => {
        try {
            const response = await apiClient.post('/api/auth/login', credentials);
            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            setAuthState({ isLoggedIn: true, role, token });
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            setAuthState(prevState => ({ ...prevState, loginError: errorMessage }));
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuthState({ isLoggedIn: false, role: null, token: null, loginError: null });
    };

    // Register function (assuming it's similar to login)
    const register = async (userInfo) => {
        // Implement registration logic
    };

    // Effect to handle token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            setAuthState({ isLoggedIn: true, role, token });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authState, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
