import React, { createContext, useState } from "react";
import apiClient from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        role: null,
        token: null,
        loginError: null
    });

    const login = async (credentials) => {
        try {
            const response = await apiClient.post('/api/auth/login', credentials);
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            setAuthState({ isLoggedIn: true, role, token, loginError: null });
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            setAuthState({ ...authState, loginError: errorMessage });
            console.error("Login failed:", errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({ isLoggedIn: false, role: null, token: null, loginError: null });
    };

    const register = async (userInfo) => {
        try {
            await apiClient.post('/users/register', userInfo);
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            throw new Error("Registration failed.");
        }
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
