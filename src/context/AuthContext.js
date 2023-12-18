import React, { createContext, useState } from "react";
import apiClient from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ isAuthenticated: false, role: null });

    const login = async (credentials) => {
        try {
            // Here we'll make an API call to the login endpoint
            // This is a basic example and should be adjusted based on your backend
            const response = await apiClient.post('/login', credentials);

            // Assuming the response includes the user's role
            const { role } = response.data;
            setAuthState({ isAuthenticated: true, role }); // Update authState
        } catch (error) {
            console.error("Login error:", error);
            // Handle errors, such as displaying a login failure message
        }
    };

    const logout = () => {
        setAuthState({ isAuthenticated: false, role: null });
    };

    const register = async (userInfo) => {
        try {
            await apiClient.post('/users/register', userInfo);
            // Handle successful registration, such as logging in the user
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data);
            } else {
                throw new Error("An unexpected error occurred during registration.");
            }
        }
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
