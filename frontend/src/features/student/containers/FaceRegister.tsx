import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

interface FaceRegisterProps {
    userId: number;
    onClose: () => void;
}

export default function FaceRegister({ userId, onClose }: FaceRegisterProps) {
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);


    // /////////Function to Upload profile photo and register face for face recognition /////////////
    // const uploadFaceImage = async (userId: number, base64Image: string) => {
    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_BASE}/python_api/attendance/student/register_face`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 user_id: userId,
    //                 image: base64Image,
    //             }),
    //         });

    //         const data = await response.json();

    //         if (data.status === "success") {
    //             alert("Face registered successfully!");
    //         } else {
    //             alert("Failed to register face: " + data.message);
    //         }
    //     } catch (err) {
    //         console.error("Error uploading face:", err);
    //         alert("Error uploading face. Check console for details.");
    //     }
    // };

    const uploadFaceImage = async (userId: number, base64Image: string) => {
        try {
            // Use the Docker Compose service name for backend
            // Example: if your backend service is named "backend" and exposes port 8000
            const response = await fetch(`http://backend:80/python_api/attendance/student/register_face`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    image: base64Image,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "success") {
                alert("Face registered successfully!");
            } else {
                alert("Failed to register face: " + data.message);
            }
        } catch (err) {
            console.error("Error uploading face:", err);
            alert("Error uploading face. Check console for details.");
        }
    };

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);

            // Call your upload function here
            uploadFaceImage(userId, imageSrc).then(() => {
                alert("Face registered successfully!");
                onClose(); // close the modal after success
            }).catch(err => {
                console.error(err);
                alert("Failed to register face.");
            });
        }
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
                    >
                        Capture & Upload
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
