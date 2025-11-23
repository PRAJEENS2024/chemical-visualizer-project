// src/components/Layout/Header.js
import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser, FiArrowRight } from 'react-icons/fi';

const Header = () => {
    const { auth, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* LOGO */}
                <div 
                    onClick={() => navigate(auth?.accessToken ? '/dashboard' : '/')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="relative w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
                        <img 
                            src="/favicon.ico" 
                            alt="Logo" 
                            className="w-6 h-6 object-contain brightness-200 grayscale-0" 
                        />
                    </div>
                    {/* CHANGED: Text is now Deep Blue in light mode, White in dark mode */}
                    <h1 className="text-2xl font-extrabold text-blue-800 dark:text-white tracking-tight">
                        ChemSight
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <button 
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all"
                    >
                        {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </button>

                    {auth?.accessToken ? (
                        <div className="flex items-center gap-4 pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                            <div 
                                onClick={() => navigate('/profile')} 
                                className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-blue-600 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                    <FiUser />
                                </div>
                                <span className="hidden sm:inline">{auth.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <FiLogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                        >
                            Login <FiArrowRight />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;