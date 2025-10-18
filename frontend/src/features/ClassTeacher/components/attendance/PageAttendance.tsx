import React, { useState, useEffect } from "react";
import useFetch from "../../../../shared/hooks/UseFetch";
// import AnimatedLoader from "../../../../shared/components/loaders/DefaultLoader";
import { useParams,useNavigate } from "react-router-dom";
import useManualFetch from "../../../../shared/hooks/useManualFetch";
import AnimatedLoader from "../../../../shared/components/loaders/DefaultLoader";
import Header from "../../../../shared/components/header/Header";
import PageList from "../../../../shared/components/sidebar/PageList";
interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  url_dp?: string;
}

interface AttendancePayload {
  class_id: number;
  students_id: number[];
  status: string[];
}

const PageAttendance: React.FC = () => {
  const navigate = useNavigate();
  const { class_id } = useParams<{ class_id: string }>();
  const numericClassId = class_id ? parseInt(class_id, 10) : 0;

  const { data, status } = useFetch({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/teacher/class/students/${numericClassId}`,
  });

  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [selectAll, setSelectAll] = useState<boolean>(true);

  const students: Student[] = Array.isArray(data) ? data : [];

  // Initialize default status when data arrives
  useEffect(() => {
    if (students.length > 0) {
      const initialStatus: Record<number, string> = {};
      students.forEach((s) => (initialStatus[s.student_id] = "Present"));
      setStatusMap(initialStatus);
    }
  }, [students]);

  const handleStatusChange = (studentId: number) => {
    setStatusMap((prev) => ({ 
      ...prev, 
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present" 
    }));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const newStatusMap: Record<number, string> = {};
    students.forEach((s) => {
      newStatusMap[s.student_id] = newSelectAll ? "Present" : "Absent";
    });
    setStatusMap(newStatusMap);
  };

  const { execute, status: saveStatus, error: saveError } = useManualFetch();

  const handleSave = async () => {
    const students_id = Object.keys(statusMap).map(Number);
    const statusArray = Object.values(statusMap);

    const payload: AttendancePayload = {
      class_id: numericClassId,
      students_id,
      status: statusArray,
    };

    const result = await execute(
      `${import.meta.env.VITE_BACKEND_URL}/teacher/attendance`,
      "POST",
      payload
    );
    console.log("Save result:", result);

    navigate(`/teacher/class/${numericClassId}`);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <AnimatedLoader />
      </div>
    );
  }

  if (status === "error") {
    return <div className="text-center text-red-500 py-10">❌ Error loading students.</div>;
  }

  const presentCount = Object.values(statusMap).filter(status => status === "Present").length;
  const absentCount = students.length - presentCount;

  return (
    <div>
      <Header />
      <div className="flex h-[89vh]">
      <PageList />
     <div className="bg-gray-50 rounded-l-3xl w-full overflow-y-auto p-6">
    <div className="bg-white rounded-l-4xl ">
      <div className="bg-blue-500 text-white p-5 rounded-t-lg">
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="opacity-90">Class ID: {numericClassId}</p>
      </div>
      
      <div className="p-5 bg-blue-50 flex justify-between items-center">
        <div>
          <span className="text-green-600 font-medium">{presentCount} Present</span>
          <span className="mx-2">•</span>
          <span className="text-red-600 font-medium">{absentCount} Absent</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-700">Select All:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {students.map((s) => (
          <div
            key={s.student_id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
          
          
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-blue-600 font-semibold">
                    {s.first_name[0]}
                    {s.last_name[0]}
                  </span>
                </div>
          
              <div>
                <p className="font-medium text-gray-900">
                  {s.first_name} {s.last_name}
                </p>
                <p className="text-gray-500 text-sm">{s.email}</p>
              </div>
            </div>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={statusMap[s.student_id] === "Present"}
                onChange={() => handleStatusChange(s.student_id)}
                className="hidden"
              />
              <div className={`w-7 h-7 flex items-center justify-center rounded-md border-2 ${statusMap[s.student_id] === "Present" ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                {statusMap[s.student_id] === "Present" && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span className="ml-2 text-gray-700">
                {statusMap[s.student_id] === "Present" ? "Present" : "Absent"}
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div>
          {saveStatus === "loading" && (
            <div className="flex items-center text-blue-600">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          )}
          {saveStatus === "error" && (
            <div className="text-red-600 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Error: {saveError?.message}
            </div>
          )}
          {saveStatus === "success" && (
            <div className="text-green-600 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Attendance saved successfully!
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === "loading"}

          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Save Attendance
        </button>
      </div>
     </div>
    </div>
  </div>
</div>
  );
};

export default PageAttendance;