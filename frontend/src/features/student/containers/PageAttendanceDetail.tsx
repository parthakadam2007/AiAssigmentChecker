import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import useFetch from "../../../shared/hooks/UseFetch";
import useManualFetch from "../../../shared/hooks/useManualFetch";
import Header from "../../../shared/components/header/Header";
import PageList from "../../../shared/components/sidebar/PageList";
// import WebcamCapture from "../../../features/student/container/WebcamWindow";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, { transports: ["websocket"] });

type AttendanceRecord = {
  date: string;
  status: "Present" | "Absent" | "Late";
  remarks?: string;
};

interface ApiResponse {
  success: boolean;
  message?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";
  if (status === "Present") return <span className={`${base} bg-green-100 text-green-700`}>Present</span>;
  if (status === "Absent") return <span className={`${base} bg-red-100 text-red-700`}>Absent</span>;
  if (status === "Late") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Late</span>;
  return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
};

const PageAttendanceDetail: React.FC = () => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setShowWebcam(false); // close webcam
      alert("Image captured!"); // just for testing
      console.log(capturedImage);
      // later: send capturedImage to backend API
    }
  }, []);

  const { class_id } = useParams<{ class_id: string }>();

  const { data: attendance, status } = useFetch<AttendanceRecord[]>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/student/attendance/detail/${class_id}`,
  });

  // const { data: initialSessionData } = useFetch<{ active: boolean; session_id?: string }>({
  //   method: "GET",
  //   url: `${import.meta.env.VITE_BACKEND_URL}/student/biometric_attendance/active_session/${class_id}`,
  // });

  // const [sessionActive, setSessionActive] = useState<{ active: boolean; session_id?: string }>({
  //   active: false,
  // });

  // useEffect(() => {
  //   // Listen to session updates from backend
  //   socket.on("sessionStatus", (data: { active: boolean; session_id?: string }) => {
  //     setSessionActive(data);
  //   });

  //   // Clean up
  //   return () => {
  //     socket.off("sessionStatus");
  //   };
  // }, []);

  const [sessionActive, setSessionActive] = useState<{ active: boolean; session_id?: string }>({
    active: false,
  });

  const { data: initialSessionData } = useFetch<{ active: boolean; session_id?: string }>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/student/biometric_attendance/active_session/${class_id}`,
  });

  useEffect(() => {
    if (initialSessionData) {
      setSessionActive(initialSessionData);
    }
  }, [initialSessionData]);

  // useEffect(() => {
  //   socket.on("sessionStatus", (data: { active: boolean; session_id?: string }) => {
  //     console.log("Session active:", sessionActive);
  //     setSessionActive(data);
  //   });

  //   return () => {
  //     socket.off("sessionStatus");
  //   };
  // }, []);

  useEffect(() => {
    socket.on("sessionStatus", (data: { active: boolean; session_id?: string }) => {
      setSessionActive(data);
    });

    socket.on("endSession", (data: { classId: string }) => {
      console.log("Received endSession:", data);
      if (data.classId === class_id) {
        setSessionActive({ active: false });
      }
    });

    return () => {
      socket.off("sessionStatus");
      socket.off("endSession");
    };
  }, [class_id]);



  const { execute, status: markStatus, error: markError } = useManualFetch<ApiResponse>();

  const markAttendance = async () => {
    if (!sessionActive?.active || !sessionActive.session_id) {
      alert("No active session found.");
      return;
    }

    setShowWebcam(true);
    const data = await execute(
      `${import.meta.env.VITE_BACKEND_URL}/student/attendance/mark/${sessionActive.session_id}`,
      // `http://127.0.0.1:8000/attendance/mark_attendance_attendance_mark_attendance_post`,
      "POST",
      {
        session_id: sessionActive.session_id,
        status: "Present",
        method: "self_mark",
      }
    );

    if (data?.success) {
      alert("Attendance marked successfully!");
      window.location.reload();
    } else {
      alert("Failed to mark attendance.");
    }
  };

  return (
    <div>
      <Header />
      <div className="flex">
        <PageList userType="student" />
        <div className="flex-1 p-6 sm:p-8 lg:p-10 bg-gray-100 min-h-screen font-sans rounded-l-3xl">
          <div className="max-w-5xl mx-auto bg-white rounded-[30px] shadow-md overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
                Attendance Details
              </h1>

              {status === "loading" && <p className="text-gray-500 text-center">Loading attendance...</p>}
              {status === "error" && <p className="text-red-500 text-center">Failed to load attendance.</p>}
              {markStatus === "loading" && <p className="text-gray-500 text-center">Marking attendance...</p>}
              {markError && <p className="text-red-500 text-center">Failed to mark attendance</p>}

              {status === "success" && attendance && attendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessionActive?.active && (
                        <tr className="bg-yellow-50 border-b">
                          <td colSpan={2} className="px-4 py-3 text-center">
                            <button
                              onClick={markAttendance}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Mark Attendance
                            </button>
                          </td>
                        </tr>
                      )}
                      {attendance.map((record, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-800 text-sm">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={record.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                status === "success" && <p className="text-gray-500 text-center">No attendance records yet.</p>
              )}
              {showWebcam && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg flex flex-col items-center">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded-md"
                    />
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={handleCapture}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Capture
                      </button>
                      <button
                        onClick={() => setShowWebcam(false)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAttendanceDetail;
