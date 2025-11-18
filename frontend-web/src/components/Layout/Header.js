// src/components/Layout/Header.js
import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';

const Header = () => {
    const { auth, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {/* UPDATED LOGO SECTION */}
                    <img 
                        src="/favicon.ico" 
                        alt="Logo" 
                        className="w-8 h-8 object-contain" 
                    />
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                        ChemSight
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </button>

                    {/* User Profile & Logout */}
                    <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-600">
                        <div 
                            onClick={() => navigate('/profile')} 
                            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 transition-colors"
                        >
                            <FiUser />
                            <span>{auth.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-sm"
                        >
                            <FiLogOut />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;