// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

// Import all the components we just made
import Upload from '../components/Dashboard/Upload';
import Summary from '../components/Dashboard/Summary';
import Charts from '../components/Dashboard/Charts';
import History from '../components/Dashboard/History';

const DashboardPage = () => {
    const { auth, logout } = useAuth(); // Get auth info and logout function
    const navigate = useNavigate();

    // State to hold our data
    const [summaryData, setSummaryData] = useState(null); // For the currently-viewed item
    const [historyData, setHistoryData] = useState([]); // For the list
    const [error, setError] = useState('');

    // Function to get the most recent summary
    const fetchLatestSummary = async () => {
        try {
            const response = await axiosInstance.get('/summary/');
            setSummaryData(response.data);
            setError('');
        } catch (err) {
            setError('Could not fetch summary. Please upload a file.');
            setSummaryData(null);
        }
    };

    // Function to get the last 5 uploads
    const fetchHistory = async () => {
        try {
            const response = await axiosInstance.get('/history/');
            setHistoryData(response.data);
        } catch (err) {
            setError('Could not fetch history.');
        }
    };

    // Run both functions when the page first loads
    useEffect(() => {
        fetchLatestSummary();
        fetchHistory();
    }, []);

    // This function is passed to the <Upload> component
    const handleUploadSuccess = (newSummaryData) => {
        setSummaryData(newSummaryData); // Update summary to show the new data
        fetchHistory(); // Refresh history list
        setError('');
    };

    // This function is passed to the <History> component
    const loadHistoryItem = (item) => {
        setSummaryData(item); // Set the main summary to the clicked item
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container p-4 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 mb-6 bg-white rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-800">
                    Chemical Equipment Visualizer
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Welcome, {auth.username}!</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Error message area */}
            {error && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
                    {error}
                </div>
            )}

            {/* Main Content Area (Tailwind grid) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left Column: Upload + History */}
                <div className="space-y-6 lg:col-span-1">
                    <Upload onUploadSuccess={handleUploadSuccess} />
                    <History 
                        historyData={historyData} 
                        onLoadItem={loadHistoryItem} 
                        currentItemId={summaryData?.id}
                    />
                </div>

                {/* Right Column: Summary + Charts */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Only show Summary and Charts if we have data */}
                    {summaryData ? (
                        <>
                            <Summary summary={summaryData.summary_stats} fileName={summaryData.file_name} />
                            <Charts summary={summaryData.summary_stats} />
                        </>
                    ) : (
                        <div className="p-6 text-center bg-white rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-700">No data to display</h3>
                            <p className="text-gray-500">Please upload a CSV file to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;