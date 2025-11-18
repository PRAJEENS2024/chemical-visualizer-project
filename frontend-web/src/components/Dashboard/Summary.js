// frontend-web/src/components/Dashboard/Summary.js
import React from 'react';

const SummaryCard = ({ title, value, unit }) => (
    <div className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{title}</h4>
        <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
            {value} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{unit}</span>
        </p>
    </div>
);

const Summary = ({ summary, fileName }) => {
    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Analysis Report</h3>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full truncate max-w-[200px]">
                    {fileName}
                </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard title="Total Count" value={summary.total_count} unit="items" />
                <SummaryCard title="Avg Flow" value={summary.avg_flowrate} unit="units" />
                <SummaryCard title="Avg Pressure" value={summary.avg_pressure} unit="units" />
                <SummaryCard title="Avg Temp" value={summary.avg_temperature} unit="°C" />
            </div>

            {/* SAFETY ALERTS SECTION */}
            {summary.alerts && summary.alerts.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex flex-col mb-3">
                        <h4 className="text-red-700 dark:text-red-400 font-bold flex items-center gap-2">
                            ⚠️ Safety Alerts
                        </h4>
                        {/* Explanatory Text */}
                        <p className="text-xs text-red-600 dark:text-red-300 mt-1 opacity-80">
                            Triggers: Pressure &gt; 120.0 psi OR Temperature &gt; 200.0 °C
                        </p>
                    </div>
                    <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-1">
                        {summary.alerts.map((alert, index) => (
                            <li key={index}>{alert}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default Summary;