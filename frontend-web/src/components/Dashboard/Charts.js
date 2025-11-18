import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts = ({ summary }) => {
    const labels = Object.keys(summary.type_distribution);
    const dataValues = Object.values(summary.type_distribution);
    // Professional colors
    const bgColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Count',
            data: dataValues,
            backgroundColor: bgColors,
            borderWidth: 0,
            borderRadius: 4,
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
            title: { display: false },
        },
        scales: {
            y: { grid: { display: true, color: '#f1f5f9' }, beginAtZero: true },
            x: { grid: { display: false } }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Distribution (Bar)</h4>
                <Bar options={options} data={chartData} />
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Distribution (Pie)</h4>
                <div className="max-w-[300px] mx-auto">
                    <Pie options={options} data={chartData} />
                </div>
            </div>
        </div>
    );
};
export default Charts;