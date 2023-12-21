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

    const login = async (credentials) => {
        try {
            const response = await apiClient.post('/api/auth/login', credentials);
            const { token, role, userId } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId.toString());
            setAuthToken(token); // This sets the token in the header for subsequent requests
            setAuthState({ isLoggedIn: true, role, token, userId });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setAuthState(prevState => ({ ...prevState, loginError: errorMessage }));
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setAuthToken(null);
        setAuthState({ isLoggedIn: false, role: null, token: null, userId: null, loginError: null });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            setAuthToken(token);
            setAuthState({ isLoggedIn: true, role, token, userId: parseInt(userId, 10) });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
