// frontend-web/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiArrowLeft, FiMail, FiUser, FiLock, FiShield, FiActivity } from 'react-icons/fi';
import axios from 'axios';

// LIVE Render URLs
const LOGIN_URL = 'https://chemical-api-74nj.onrender.com/api/token/';
const REGISTER_URL = 'https://chemical-api-74nj.onrender.com/api/register/';

const LoginPage = () => {
    const { setAuth } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const [formData, setFormData] = useState({
        username: '', password: '', first_name: '', last_name: '', email: ''
    });
    
    const [isRegistering, setIsRegistering] = useState(location.state?.isRegistering || false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isRegistering) {
                await axios.post(REGISTER_URL, JSON.stringify(formData), { headers: { 'Content-Type': 'application/json' } });
                setIsRegistering(false);
                setError('Success! Account created. Please log in.');
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                const response = await axios.post(LOGIN_URL, JSON.stringify({ username: formData.username, password: formData.password }), { headers: { 'Content-Type': 'application/json' } });
                setAuth({ username: formData.username, accessToken: response.data.access });
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError('Invalid credentials or server error.');
        } finally {
            setLoading(false);
        }
    };

    // Dynamic Input Classes for Light/Dark Mode
    const inputClass = "w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium " +
                       "bg-white border-slate-200 text-slate-900 placeholder-slate-400 " + // Light Mode
                       "dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"; // Dark Mode

    // Icon Color Class
    const iconClass = "absolute top-4 left-4 transition-colors " +
                      "text-slate-400 " + // Light Mode
                      "dark:text-slate-500 group-focus-within:text-blue-500"; // Dark Mode

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
            
            {/* --- LEFT SIDE: Branding (Visible on Desktop) --- */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
                {/* Background Gradient - Changes with Theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-purple-900 dark:to-slate-950 transition-colors duration-500"></div>
                
                {/* Abstract Shapes */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-black/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>

                {/* Content Card */}
                <div className="relative z-10 p-12 max-w-lg text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30">
                             <img src="/favicon.ico" alt="Logo" className="w-16 h-16 object-contain brightness-200 drop-shadow-md" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-white mb-6 tracking-tight drop-shadow-sm">
                        ChemSight
                    </h1>
                    <p className="text-lg text-blue-50 mb-8 leading-relaxed font-medium">
                        The premier platform for intelligent chemical data visualization and safety analytics.
                    </p>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white backdrop-blur-md">
                            <FiActivity /> Real-time Analysis
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white backdrop-blur-md">
                            <FiShield /> Safety Alerts
                        </span>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: Login/Register Form --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative">
                
                {/* Theme Toggle & Home Link */}
                <div className="absolute top-8 left-8">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium text-sm group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform"/> Back
                    </button>
                </div>
                <div className="absolute top-8 right-8">
                    <button onClick={toggleTheme} className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all shadow-sm">
                        {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
                    </button>
                </div>

                <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900/50 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {isRegistering ? 'Start your professional journey today.' : 'Please enter your details to sign in.'}
                        </p>
                    </div>

                    {error && (
                        <div className={`p-4 rounded-xl text-sm font-medium text-center border ${error.includes('created') ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {isRegistering && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative group">
                                    <FiUser className={iconClass} size={20} />
                                    <input name="first_name" placeholder="First Name" onChange={handleChange} className={inputClass} required />
                                </div>
                                <div className="relative group">
                                    <FiUser className={iconClass} size={20} />
                                    <input name="last_name" placeholder="Last Name" onChange={handleChange} className={inputClass} required />
                                </div>
                            </div>
                        )}
                        
                        {isRegistering && (
                            <div className="relative group">
                                <FiMail className={iconClass} size={20} />
                                <input name="email" type="email" placeholder="Work Email" onChange={handleChange} className={inputClass} required />
                            </div>
                        )}

                        <div className="relative group">
                            <FiShield className={iconClass} size={20} />
                            <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} className={inputClass} required />
                        </div>

                        <div className="relative group">
                            <FiLock className={iconClass} size={20} />
                            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className={inputClass} required />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div className="pt-6 text-center border-t border-slate-100 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1">
                                {isRegistering ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;