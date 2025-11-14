// src/components/Dashboard/Summary.js
import React from 'react';

// A small re-usable component for the summary cards
const SummaryCard = ({ title, value, unit }) => (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-2xl font-semibold text-gray-900">
            {value} <span className="text-base font-normal">{unit}</span>
        </p>
    </div>
);

const Summary = ({ summary, fileName }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
                Analysis for: <span className="font-bold text-indigo-600">{fileName}</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <SummaryCard title="Total Equipment" value={summary.total_count} unit="items" />
                <SummaryCard title="Avg. Flowrate" value={summary.avg_flowrate} unit="units" />
                <SummaryCard title="Avg. Pressure" value={summary.avg_pressure} unit="units" />
                <SummaryCard title="Avg. Temperature" value={summary.avg_temperature} unit="°C" />
            </div>
        </div>
    );
};

export default Summary;