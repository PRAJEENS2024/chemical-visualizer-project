// frontend-web/src/components/Dashboard/Charts.js
import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement,
    PointElement,
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';

// Register LineElement and PointElement for the Line graph
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Charts = ({ summary, rawData }) => {
    const labels = Object.keys(summary.type_distribution);
    const dataValues = Object.values(summary.type_distribution);
    const bgColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    // 1. Bar & Pie Data (Counts)
    const distributionData = {
        labels: labels,
        datasets: [{
            label: 'Count',
            data: dataValues,
            backgroundColor: bgColors,
            borderWidth: 0,
            borderRadius: 4,
        }],
    };

    // 2. Line Graph Data (Trends)
    // X-Axis = Equipment Names
    // Y-Axis = Values
    const lineChartLabels = (rawData || []).map(item => item['Equipment Name']);
    const lineChartData = {
        labels: lineChartLabels,
        datasets: [
            {
                label: 'Pressure (psi)',
                data: (rawData || []).map(item => item.Pressure),
                borderColor: '#ef4444', // Red line
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.3, // Curvy lines
            },
            {
                label: 'Flowrate (units)',
                data: (rawData || []).map(item => item.Flowrate),
                borderColor: '#3b82f6', // Blue line
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
        },
        scales: {
            y: { grid: { display: true, color: '#f1f5f9' }, beginAtZero: true },
            x: { grid: { display: false } }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Equipment Distribution</h4>
                <Bar options={options} data={distributionData} />
            </div>

            {/* Line Graph (New!) */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Operational Trends</h4>
                <Line options={options} data={lineChartData} />
            </div>

            {/* Pie Chart */}
            <div className="md:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors flex flex-col items-center">
                 <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 w-full text-left">Type Breakdown</h4>
                 <div className="max-w-[300px] w-full">
                    <Pie options={options} data={distributionData} />
                 </div>
            </div>
        </div>
    );
};
export default Charts;