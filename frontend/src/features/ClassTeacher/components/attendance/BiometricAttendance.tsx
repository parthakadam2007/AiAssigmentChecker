import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom";
// import { useParams } from "react-router-dom";
import useManualFetch from "../../../../shared/hooks/useManualFetch";
import useFetch from "../../../../shared/hooks/UseFetch";
// import AnimatedLoader from "../../../../shared/components/loaders/DefaultLoader";

type SessionStatus = "idle" | "active" | "paused" | "ended"
interface ApiResponse {
  success: boolean;
  message?: string;
}

interface Class {
  class_name: string;
}

interface AttendancePayload {
  class_id: number
}

const TeacherAttendancePage: React.FC = () => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle")
  const [sessionData, setSessionData] = useState({
    session: "Morning Session - 09:00 AM",
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    startTime: "",
    studentsPresent: 0,
    totalStudents: 25,
  })
  const { class_id} = useParams<{ class_id: string}>();
  const numericClassId = class_id ? parseInt(class_id, 10) : 0;
  const { data } = useFetch({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/teacher/class/${numericClassId}`,
  });

  const classData: Class = data as Class || { class_name: "Loading..." };

  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  useEffect(() => {
    socketRef.current = io(`${import.meta.env.VITE_BACKEND_URL}`, { transports: ["websocket"] });
    const socket = socketRef.current;

    socket.on("sessionStarted", () => {
      setSessionStatus("active");
    });
    socket.on("attendanceMarked", () => {
      setSessionData((prev) => ({ ...prev, studentsPresent: prev.studentsPresent + 1 }));
    });

    return () => {
      socket.off("sessionStarted");
      socket.off("attendanceMarked");
      socket.disconnect();
    };
  }, []);

  const { execute, status: saveStatus, error: saveError } = useManualFetch<ApiResponse>();

  const startSession = async () => {
    const payload: AttendancePayload = {
      class_id: numericClassId
    }; // replace with dynamic values
    const data = await execute(
      `${import.meta.env.VITE_BACKEND_URL}/teacher/biometric_attendance/start_session`,
      "POST",
      payload
    );

    if (data?.success) {
      setSessionStatus("active");
      setSessionData((prev) => ({
        ...prev,
        startTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }));
      socketRef.current?.emit("startSession", payload);
    } else {
      console.error("Failed to start session:", data?.message || "Unknown error");
    }
  };

  const endSession = async () => {
    const payload: AttendancePayload = {
      class_id: numericClassId
    }; // replace with dynamic values
    const data = await execute(
      `${import.meta.env.VITE_BACKEND_URL}/teacher/biometric_attendance/end_session`,
      "POST",
      payload
    );
    if (data?.success) {
      setSessionStatus("ended");
      socketRef.current?.emit("endSession", payload);
    } else {
      console.error("Failed to end session:", data?.message || "Unknown error");
    }
  };

  const resetSession = () => {
    setSessionStatus("idle")
    setSessionData((prev) => ({
      ...prev,
      startTime: "",
      studentsPresent: 0,
    }))
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6">
      <div className="bg-blue-500 text-white p-5">
        <h2 className="text-2xl font-bold">Biometric Attendance Dashboard</h2>
        {/* <p className="opacity-90">Class ID: {numericClassId}</p> */}
      </div>
      {/* Session Information */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-700">Session Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Class Name</p>
            <p className="font-medium text-gray-800">{classData.class_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Session</p>
            <p className="font-medium text-gray-800">{sessionData.session}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-800">{sessionData.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Start Time</p>
            <p className="font-medium text-gray-800">{sessionData.startTime || "Not started"}</p>
          </div>
        </div>
      </div>

      {/* Session Status */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 text-center mb-6">
        <h3 className="text-lg font-medium mb-6 text-gray-700">Session Control</h3>

        {/* Status Indicator */}
        <div className="flex justify-center mb-6">
          <div
            className={`
            w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300
            ${sessionStatus === "idle" ? "border-gray-300 bg-gray-50" : ""}
            ${sessionStatus === "active" ? "border-green-500 bg-green-50" : ""}
            ${sessionStatus === "paused" ? "border-yellow-500 bg-yellow-50" : ""}
            ${sessionStatus === "ended" ? "border-blue-500 bg-blue-50" : ""}
          `}
          >
            {sessionStatus === "idle" && (
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
            {sessionStatus === "active" && (
              <svg className="w-12 h-12 text-green-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
            {sessionStatus === "ended" && (
              <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {sessionStatus === "idle" && <p className="text-gray-600 mb-6">Ready to start attendance session</p>}
        {sessionStatus === "active" && (
          <div className="mb-6">
            <p className="text-green-700 font-medium mb-2">Session Active</p>
            <p className="text-sm text-green-600">Students can now record their attendance</p>
          </div>
        )}
        {sessionStatus === "ended" && (
          <div className="mb-6">
            <p className="text-blue-700 font-medium mb-2">Session Completed</p>
            <p className="text-sm text-blue-600">Attendance session has ended</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {sessionStatus === "idle" && (
            <button
              onClick={startSession}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Session
            </button>
          )}
          {saveStatus === "loading" && (
            <p className="text-gray-500 text-center">Saving session...</p>
          )}

          {saveError && (
            <p className="text-red-500 text-center">Error</p>
          )}

          {sessionStatus === "active" && (
            <>
              <button
                onClick={endSession}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                End Session
              </button>
            </>
          )}
          {sessionStatus === "paused" && (
            <>
              <button
                onClick={endSession}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                End Session
              </button>
            </>
          )}
          {sessionStatus === "ended" && (
            <button
              onClick={resetSession}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              New Session
            </button>
          )}
        </div>
      </div>

      {/* Attendance Summary
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-700">Attendance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{sessionData.studentsPresent}</p>
            <p className="text-sm text-green-700">Present</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{sessionData.totalStudents - sessionData.studentsPresent}</p>
            <p className="text-sm text-red-700">Absent</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{sessionData.totalStudents}</p>
            <p className="text-sm text-blue-700">Total</p>
          </div>
        </div>
      </div> */}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium mb-3 text-gray-700">Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click "Start Session" to begin attendance recording</li>
          <li>• Students can scan their biometrics once session is active</li>
          <li>• Use "Pause" to temporarily stop attendance recording</li>
          <li>• Click "End Session" when attendance period is complete</li>
        </ul>
      </div>
    </div>
  )
}

export default TeacherAttendancePage
