// src/components/Dashboard/Upload.js
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig'; // Our auth-ready axios

const Upload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        setMessage('Uploading...');

        try {
            // Send the file to our backend
            const response = await axiosInstance.post('/upload-csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Upload successful!');
            onUploadSuccess(response.data); // Tell the parent (DashboardPage)
        } catch (err) {
            setMessage('Upload failed. Check file or try again.');
            console.error(err);
        } finally {
            setIsUploading(false);
            setFile(null); // Clear the file input
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Upload New CSV</h3>
            <div className="space-y-4">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <button
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                    className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md disabled:opacity-50 hover:bg-indigo-700"
                >
                    {isUploading ? 'Uploading...' : 'Upload and Analyze'}
                </button>
                {message && <p className="text-sm text-center text-gray-600">{message}</p>}
            </div>
        </div>
    );
};

export default Upload;