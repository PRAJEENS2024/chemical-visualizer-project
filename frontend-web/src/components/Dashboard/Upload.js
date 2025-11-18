import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { FiUploadCloud } from 'react-icons/fi';

const Upload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        setMessage('Uploading...');

        try {
            const response = await axiosInstance.post('/upload-csv/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Success!');
            onUploadSuccess(response.data);
        } catch (err) {
            setMessage('Failed.');
        } finally {
            setIsUploading(false);
            setFile(null);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FiUploadCloud /> Upload Data
            </h3>
            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-500 dark:text-slate-400
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            dark:file:bg-slate-700 dark:file:text-blue-400
                            hover:file:bg-blue-100 dark:hover:file:bg-slate-600
                            cursor-pointer"
                    />
                </div>
                <button
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Processing...' : 'Analyze CSV'}
                </button>
                {message && <p className="text-sm text-center text-slate-600 dark:text-slate-400 animate-pulse">{message}</p>}
            </div>
        </div>
    );
};
export default Upload;