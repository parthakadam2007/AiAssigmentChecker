import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClassAverage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [averageScores, setAverageScores] = useState<number[]>([]);
  const [maxScores, setMaxScores] = useState<number[]>([]);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setAverageScores([180, 320, 250, 80, 200, 210, 250, 280, 320, 290, 330, 300]);
      setMaxScores([90, 180, 120, 200, 180, 160, 170, 180, 210, 220, 230, 210]);
      setLoading(false);
    }, 1500); // 1.5s loading simulation

    return () => clearTimeout(timer);
  }, []);

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Average Score",
        data: averageScores,
        borderColor: "#4f46e5",
        backgroundColor: "#6366f1",
        tension: 0.3,
        fill: false,
        pointRadius: 5,
      },
      {
        label: "Max Score",
        data: maxScores,
        borderColor: "#16a34a",
        backgroundColor: "#22c55e",
        tension: 0.3,
        fill: false,
        pointRadius: 5,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { weight: "bold" } },
      },
      title: {
        display: true,
        text: "Average Class Performance Trend",
        font: { size: 18, weight: "bold" },
        color: "#374151",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 350,
        ticks: { stepSize: 85 },
        grid: { color: "#e5e7eb" },
      },
      x: {
        grid: { color: "#e5e7eb" },
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
  };

  // ================= Skeleton Loader =================
  if (loading) {
    return (
      <div className="flex-1 rounded-2xl bg-white p-6 shadow-md border border-gray-200 h-[520px] animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-3/5 mb-4"></div>
        <div className="h-80 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-2xl bg-white p-6 shadow-md border border-gray-200 h-[520px]">
      <Line data={lineData} options={lineOptions} height={320} />
    </div>
  );
};

export default ClassAverage;
