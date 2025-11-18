// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';


// LIVE Render URLs
const LOGIN_URL = 'https://chemical-api-74nj.onrender.com/api/token/';
const REGISTER_URL = 'https://chemical-api-74nj.onrender.com/api/register/';

const LoginPage = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // Form States
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: ''
    });
    
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isRegistering) {
                await axios.post(REGISTER_URL, JSON.stringify(formData), { 
                    headers: { 'Content-Type': 'application/json' } 
                });
                setIsRegistering(false);
                setError('Success! Please log in with your new account.');
                // Clear sensitive fields
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                const response = await axios.post(LOGIN_URL, JSON.stringify({
                    username: formData.username, 
                    password: formData.password
                }), { headers: { 'Content-Type': 'application/json' } });
                
                setAuth({ username: formData.username, accessToken: response.data.access });
                navigate(from, { replace: true });
            }
        } catch (err) {
            const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Operation failed.';
            setError(msg.replace(/["{}]/g, '')); // Clean up error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors p-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Chemical Viz</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isRegistering ? 'Create Professional Account' : 'Welcome Back'}
                    </p>
                </div>

                {error && (
                    <div className={`p-3 mb-6 rounded-lg text-sm font-medium text-center ${error.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className="grid grid-cols-2 gap-4">
                            <input name="first_name" placeholder="First Name" onChange={handleChange} required className="input-field" />
                            <input name="last_name" placeholder="Last Name" onChange={handleChange} required className="input-field" />
                        </div>
                    )}
                    
                    {isRegistering && (
                        <input name="email" type="email" placeholder="Work Email" onChange={handleChange} required className="input-field" />
                    )}

                    <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} required className="input-field" />
                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="input-field" />

                    <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-70">
                        {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Sign In')}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {isRegistering ? 'Already have an account? Sign In' : "Need an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default LoginPage;