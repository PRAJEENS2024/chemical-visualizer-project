// frontend-web/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import Header from '../components/Layout/Header';
import { FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/update-profile/');
                setUserData(response.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError("Could not load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500">Loading profile...</div>;

    // Helper to safely get data or show placeholder
    const getVal = (val) => val || 'Not Provided';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Header />
            
            {/* FIX IS HERE: Added pt-28 to push content down */}
            <div className="container mx-auto px-6 pt-28 pb-12 flex justify-center">
                <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    
                    {/* Header Section */}
                    <div className="bg-blue-600 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full text-white">
                                <FiShield size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">My Profile</h2>
                                <p className="text-blue-100 text-sm">Read-Only Account View</p>
                            </div>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="p-8 space-y-6">
                        {error ? <p className="text-red-500 text-center">{error}</p> : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <FiUser /> Full Name
                                    </div>
                                    <div className="md:col-span-2 text-slate-800 dark:text-white font-medium text-lg">
                                        {getVal(userData?.first_name)} {getVal(userData?.last_name)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <FiShield /> Username
                                    </div>
                                    <div className="md:col-span-2 text-slate-800 dark:text-white font-mono">
                                        @{getVal(userData?.username)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <FiMail /> Email Address
                                    </div>
                                    <div className="md:col-span-2 text-slate-800 dark:text-white">
                                        {getVal(userData?.email)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <FiLock /> Password
                                    </div>
                                    <div className="md:col-span-2 text-slate-400 italic flex items-center justify-between">
                                        <span>••••••••••••••••</span>
                                        <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">Encrypted</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;