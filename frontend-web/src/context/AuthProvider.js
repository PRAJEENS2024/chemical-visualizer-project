// src/context/AuthProvider.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        // Check localStorage to see if user is already logged in
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : {};
    });

    // Function to log in
    const login = (authData) => {
        setAuth(authData);
        localStorage.setItem('auth', JSON.stringify(authData));
    };

    // Function to log out
    const logout = () => {
        setAuth({});
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth: login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// This is a custom "hook" to easily access the auth info
export const useAuth = () => {
    return useContext(AuthContext);
};