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
import { Bar } from "react-chartjs-2";

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

const Assignment: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [studentsCount, setStudentsCount] = useState<number[]>([]);

  const grades = ["A", "B", "C", "D", "F"];

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setStudentsCount([40, 65, 30, 10, 5]);
      setLoading(false);
    }, 1500); // 1.5s delay

    return () => clearTimeout(timer);
  }, []);

  const barData = {
    labels: grades,
    datasets: [
      {
        label: "Students",
        data: studentsCount,
        backgroundColor: [
          "#2563eb", // Blue
          "#16a34a", // Green
          "#dc2626", // Red
          "#fbbf24", // Yellow
          "#6b7280", // Gray
        ],
        borderRadius: 6,
        barThickness: 50,
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Assignment Marks Distribution (Grades A–F)",
        font: { weight: "bold", size: 22 },
        color: "#1f2937",
        padding: { bottom: 20 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 80,
        ticks: { stepSize: 10, font: { size: 14 } },
        grid: { color: "#e5e7eb" },
        title: {
          display: true,
          text: "Number of Students",
          font: { size: 14, weight: "bold" },
          color: "#374151",
        },
      },
      x: {
        ticks: { font: { size: 10 } },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  // ================= Skeleton Loader =================
  if (loading) {
    return (
      <div className="w-full md:w-2/3 lg:w-1/2 flex justify-center items-center rounded-2xl bg-white p-8 shadow-md border border-gray-200 mx-auto animate-pulse">
        <div className="w-full h-6 bg-gray-300 rounded mb-6"></div>
        <div className="w-full h-[400px] bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 lg:w-1/2 flex justify-center items-center rounded-2xl bg-white p-8 shadow-md border border-gray-200 mx-auto">
      <div className="w-full h-[450px]">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default Assignment;
