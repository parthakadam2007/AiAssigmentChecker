import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useFetch from "../../../shared/hooks/UseFetch";
import useManualFetch from "../../../shared/hooks/useManualFetch";
import Header from "../../../shared/components/header/Header";
import PageList from "../../../shared/components/sidebar/PageList";
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
  const { class_id } = useParams<{ class_id: string }>();
  const [showWebcam, setShowWebcam] = useState(false);
  const [, setCapturedImage] = useState<string | null>(null); //capturedImage
  const [, setAttendanceMarked] = useState(false); //attendanceMarked
  const numericClassId = class_id ? parseInt(class_id, 10) : 0;

  const webcamRef = useRef<Webcam>(null);

  const {  status: markStatus, error: markError } = useManualFetch<ApiResponse>(); //execute

  const { data: attendance, status } = useFetch<AttendanceRecord[]>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/student/attendance/detail/${class_id}`,
  });

  const [sessionActive, setSessionActive] = useState<{ active: boolean; session_id?: string }>({
    active: false,
  });

  const { data: initialSessionData } = useFetch<{ active: boolean; session_id?: string }>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/student/biometric_attendance/active_session/${class_id}`,
  });

  const { data: attendanceCheck } = useFetch<{ marked: boolean }>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL_BASE}/python_api/biometric_attendance/check-attendance?class_id=${class_id}&session_id=${sessionActive.session_id}`,
  });

  // --- Sync session data from API
  useEffect(() => {
    if (initialSessionData) {
      setSessionActive(initialSessionData);
    }
  }, [initialSessionData]);

  // --- Listen to socket events for live session updates
  useEffect(() => {
    socket.on("sessionStatus", (data: { active: boolean; session_id?: string }) => {
      setSessionActive(data);
    });

    socket.on("endSession", (data: { classId: string }) => {
      if (data.classId === class_id) {
        setSessionActive({ active: false });
      }
    });

    return () => {
      socket.off("sessionStatus");
      socket.off("endSession");
    };
  }, [class_id]);

  // --- Handle webcam capture and upload
  const handleCapture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setCapturedImage(imageSrc);
    setShowWebcam(false);

    const byteString = atob(imageSrc.split(",")[1]);
    const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: mimeString });

    const classId = numericClassId || "";
    const formData = new FormData();
    formData.append("class_id", String(classId));
    formData.append("session_id", String(sessionActive.session_id));
    formData.append("status", "Present");
    formData.append("method", "self_mark");
    formData.append("file", blob, "face.jpg");

    // Send to backend
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL_BASE}/python_api/biometric_attendance/mark-attendance`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    console.log(data);

    if (data?.success) {
      console.log("✅ Attendance marked successfully!");
      setAttendanceMarked(true); // prevent multiple marking
      // Update attendance locally
      attendance?.push({ date: new Date().toISOString(), status: "Present" });
      // Optionally force refresh state (if attendance is from useFetch, you may need to refetch)
      window.location.reload();
    } else {
      console.log((data.message || "Unknown error"));
    }
  }, [sessionActive]);


  // --- Open webcam when "Mark Attendance" is clicked
  const markAttendance = async () => {
    if (!sessionActive?.active || !sessionActive.session_id) {
      console.log("No active session found.");
      return;
    }
    setShowWebcam(true);
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
              {markError && <p className="text-red-500 text-center">Failed to mark attendance.</p>}

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
                      {sessionActive?.active && !attendanceCheck?.marked && (
                        <button
                          onClick={markAttendance}
                          className="w-full max-w-xs mx-auto px-6 py-3 text-center bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                        >
                          Mark Attendance
                        </button>
                      )}

                      {attendanceCheck?.marked && (
                        <div className="w-full max-w-xs mx-auto px-6 py-3 text-center bg-green-100 text-green-800 font-semibold rounded-lg shadow-inner">
                          Attendance already marked
                        </div>
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

              {/* Webcam Modal */}
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
