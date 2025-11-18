import React from 'react';
import axiosInstance from '../../api/axiosConfig';
import { FiFileText, FiDownload, FiDatabase } from 'react-icons/fi'; // Import FiDatabase

const History = ({ historyData, onLoadItem, currentItemId }) => {

    const handleDownload = async (e, id, fileName) => {
        e.stopPropagation();
        try {
            const response = await axiosInstance.get(`/download-report/${id}/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${fileName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) { console.error(err); }
    };

    // New Function for Excel
    const handleExcel = async (e, id, fileName) => {
        e.stopPropagation();
        try {
            const response = await axiosInstance.get(`/export-excel/${id}/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `data_${fileName}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Uploads</h3>
            {historyData.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No history yet.</p>
            ) : (
                <ul className="space-y-3">
                    {historyData.map((item) => (
                        <li 
                            key={item.id} 
                            onClick={() => onLoadItem(item)}
                            className={`group p-3 rounded-lg border cursor-pointer transition-all
                                ${currentItemId === item.id 
                                    ? 'bg-blue-50 border-blue-200 dark:bg-slate-700 dark:border-slate-600 ring-1 ring-blue-500' 
                                    : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-md text-slate-500">
                                        <FiFileText />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.file_name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(item.uploaded_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => handleExcel(e, item.id, item.file_name)}
                                        className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                        title="Export Excel"
                                    >
                                        <FiDatabase />
                                    </button>
                                    <button
                                        onClick={(e) => handleDownload(e, item.id, item.file_name)}
                                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        title="Download PDF"
                                    >
                                        <FiDownload />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default History;