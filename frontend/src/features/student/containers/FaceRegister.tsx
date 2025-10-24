import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

interface FaceRegisterProps {
    studentId: number;
    onClose: () => void;
}

interface FaceRegisterProps {
    studentId: number;  // always passed from parent
    onClose: () => void;
}

const FaceRegister: React.FC<FaceRegisterProps> = ({ studentId, onClose }) => {
    const webcamRef = useRef<Webcam>(null);
    const [loading, setLoading] = useState(false);

    const uploadFaceImage = async (base64Image: string) => {
        if (!studentId) {
            console.log("Student ID not found!");
            return;
        }

        try {
            setLoading(true);

            // Convert base64 to blob
            const res = await fetch(base64Image);
            const blob = await res.blob();

            // Create FormData
            const formData = new FormData();
            formData.append("student_id", studentId.toString()); // string value
            formData.append("file", blob, "face.jpg"); // file field

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL_BASE}/python_api/biometric_attendance/enroll-face`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                console.log("Face registered successfully!");
                onClose();
            } else {
                console.log("Failed: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            console.log("Error uploading face.");
        } finally {
            setLoading(false);
        }
    };


    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) return;
        uploadFaceImage(imageSrc);
    }, [uploadFaceImage]);

    return (
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
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Capture & Upload"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


export default FaceRegister;
