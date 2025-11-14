// src/components/Dashboard/Charts.js
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register all the parts of Chart.js we need
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Helper function to generate random colors
const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        colors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`);
    }
    return colors;
};

const Charts = ({ summary }) => {
    // Get data from our summary
    const labels = Object.keys(summary.type_distribution);
    const dataValues = Object.values(summary.type_distribution);
    const colors = generateColors(labels.length);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Equipment Count',
                data: dataValues,
                backgroundColor: colors,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Equipment Type Distribution' },
        },
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow">
                <Bar options={chartOptions} data={chartData} />
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
                <Pie options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};

export default Charts;