import React, { createContext, useState, useEffect } from "react";
import apiClient, { setAuthToken } from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const initialState = {
        isLoggedIn: !!localStorage.getItem('token'),
        role: localStorage.getItem('role') || null,
        token: localStorage.getItem('token') || null,
        loginError: null
    };

    const [authState, setAuthState] = useState(initialState);

    const login = async (credentials) => {
        try {
            const response = await apiClient.post('/api/auth/login', credentials);
            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            setAuthToken(token);
            setAuthState({ isLoggedIn: true, role, token });
        } catch (error) {
            const errorMessage = error.response?.data.message || error.message; // Adjusted for more specific error handling
            setAuthState(prevState => ({ ...prevState, loginError: errorMessage }));
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuthToken(null);
        setAuthState({ isLoggedIn: false, role: null, token: null, loginError: null });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            setAuthToken(token);
            setAuthState({ isLoggedIn: true, role, token });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
