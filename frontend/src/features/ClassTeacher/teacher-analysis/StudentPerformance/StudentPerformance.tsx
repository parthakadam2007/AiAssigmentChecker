import React from "react";
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
import Assignment from "./container/AssignmentMarks"
import ClassAverage from "./container/ClassAverage";

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

const StudentPerformanceAnalytics: React.FC = () => {

  return (
    <>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Programs Analysis</h2>
    <div className="flex flex-col md:flex-row gap-8 mb-12">
       <ClassAverage />
       <Assignment />
    </div>
    </>
  );
};

export default StudentPerformanceAnalytics;