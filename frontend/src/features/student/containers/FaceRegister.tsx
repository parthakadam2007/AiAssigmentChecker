import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

interface FaceRegisterProps {
    userId: number;
    onClose: () => void;
}

export default function FaceRegister({ userId, onClose }: FaceRegisterProps) {
    const webcamRef = useRef<Webcam>(null);
    const [loading, setLoading] = useState(false);

    const uploadFaceImage = async (userId: number, base64Image: string) => {
        try {
            setLoading(true);

            // Convert base64 to Blob
            const blob = await (await fetch(base64Image)).blob();

            const formData = new FormData();
            formData.append("student_id", userId.toString());
            formData.append("file", blob, "face.jpg");

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL_BASE}/python_api/biometric_attendance/enroll-face`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (data.status === "success") {
                alert("Face registered successfully!");
            } else {
                alert("Failed to register face: " + data.message);
            }
        } catch (err) {
            console.error("Error uploading face:", err);
            alert("Error uploading face. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) return;

        uploadFaceImage(userId, imageSrc)
            .then(() => onClose())
            .catch(() => {});
    }, [userId, onClose]);

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
}
