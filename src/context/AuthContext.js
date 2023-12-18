import React, { createContext, useState } from "react";
import apiClient from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Removed 'setAuthState' as it's not used currently
    const [authState] = useState(null);

    const login = async (/* credentials */) => {
        // Placeholder for future implementation
        // throw new Error("Login functionality not implemented yet.");
    };

    const logout = () => {
        // Implement logout logic here
    };

    const register = async (userInfo) => {
        try {
            // 'response' variable removed as it was not used
            await apiClient.post('/users/register', userInfo);
            // Handle the successful registration
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
