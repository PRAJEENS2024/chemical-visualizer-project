// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios'; // We use raw axios here, not the instance

// Hardcode backend URLs
const LOGIN_URL = 'http://127.0.0.1:8000/api/token/';
const REGISTER_URL = 'http://127.0.0.1:8000/api/register/';

const LoginPage = () => {
    const { setAuth } = useAuth(); // Get the login function from our context
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'; // Where to redirect after login

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isRegistering) {
                // --- REGISTER LOGIC ---
                await axios.post(REGISTER_URL, 
                    JSON.stringify({ username, password }),
                    { headers: { 'Content-Type': 'application/json' }}
                );
                // After registering, toggle to login mode
                setIsRegistering(false);
                setError('Registration successful! Please log in.');
            } else {
                // --- LOGIN LOGIC ---
                const response = await axios.post(LOGIN_URL, 
                    JSON.stringify({ username, password }),
                    { headers: { 'Content-Type': 'application/json' }}
                );

                const accessToken = response?.data?.access;
                const refreshToken = response?.data?.refresh;

                // Save to global context and local storage
                setAuth({ username, accessToken, refreshToken });

                setUsername('');
                setPassword('');
                navigate(from, { replace: true }); // Send user to dashboard
            }
        } catch (err) {
            // Handle errors
            if (!err?.response) {
                setError('No Server Response');
            } else if (err.response?.status === 400) {
                setError('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setError('Unauthorized. Check credentials.');
            } else {
                setError('Login Failed');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    {isRegistering ? 'Register New Account' : 'Sign in'}
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        {isRegistering ? 'Register' : 'Sign In'}
                    </button>
                    <p className="text-sm text-center">
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;