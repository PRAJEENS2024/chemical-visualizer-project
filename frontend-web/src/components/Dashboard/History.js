// src/components/Dashboard/History.js
import React from 'react';
import axiosInstance from '../../api/axiosConfig';

const History = ({ historyData, onLoadItem, currentItemId }) => {

    // This function handles the PDF download
    const handleDownload = async (id, fileName) => {
        try {
            const response = await axiosInstance.get(`/download-report/${id}/`, {
                responseType: 'blob', // This is crucial for file downloads
            });

            // Create a temporary link to trigger the browser download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${fileName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove(); // Clean up the link
        } catch (err) {
            console.error("Error downloading PDF", err);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Upload History (Last 5)</h3>
            {historyData.length === 0 ? (
                <p className="text-sm text-gray-500">No history found.</p>
            ) : (
                <ul className="space-y-3">
                    {historyData.map((item) => (
                        <li key={item.id} className={`p-3 rounded-md ${currentItemId === item.id ? 'bg-indigo-100' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800">{item.file_name}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(item.uploaded_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onLoadItem(item)}
                                        className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                    >
                                        Load
                                    </button>
                                    <button
                                        onClick={() => handleDownload(item.id, item.file_name)}
                                        className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                                    >
                                        PDF
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