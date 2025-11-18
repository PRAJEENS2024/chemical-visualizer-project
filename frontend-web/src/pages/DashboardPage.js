// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import Header from '../components/Layout/Header'; // Import the new Header

import Upload from '../components/Dashboard/Upload';
import Summary from '../components/Dashboard/Summary';
import Charts from '../components/Dashboard/Charts';
import History from '../components/Dashboard/History';

const DashboardPage = () => {
    const [summaryData, setSummaryData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [error, setError] = useState('');

    const fetchLatestSummary = async () => {
        try {
            const response = await axiosInstance.get('/summary/');
            setSummaryData(response.data);
            setError('');
        } catch (err) {
            setSummaryData(null);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await axiosInstance.get('/history/');
            setHistoryData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLatestSummary();
        fetchHistory();
    }, []);

    const handleUploadSuccess = (newSummaryData) => {
        setSummaryData(newSummaryData);
        fetchHistory();
        setError('');
    };

    const loadHistoryItem = (item) => {
        setSummaryData(item);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
            <Header />
            
            <main className="container mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="space-y-8">
                        <Upload onUploadSuccess={handleUploadSuccess} />
                        <History 
                            historyData={historyData} 
                            onLoadItem={loadHistoryItem} 
                            currentItemId={summaryData?.id}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {summaryData ? (
                            <>
                                <Summary summary={summaryData.summary_stats} fileName={summaryData.file_name} />
                                <Charts summary={summaryData.summary_stats} />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Analysis Data</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">Upload a CSV file to begin visualization.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;