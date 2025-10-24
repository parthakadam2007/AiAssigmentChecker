import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom";
import { FaEdit, FaCamera } from "react-icons/fa"
import FaceRegister from "../../containers/FaceRegister";
// import useFetch from "../../../../shared/hooks/UseFetch";


// interface FaceRegisterProps {
//     studentId: number;
// }

export default function StudentProfilePage() {
  const [showFaceRegister, setShowFaceRegister] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    id: "73",
    fullName: "John Doe",
    rollNumber: "CS2024001",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    dob: "2000-01-15",
    department: "Computer Science",
    address: "123 University Street, Campus City, State 12345",
    profilePhoto: "https://randomuser.me/api/portraits/men/46.jpg",
    face_embedding: [
    ]
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved profile from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("studentProfile");
    if (storedData) {
      setProfileData(JSON.parse(storedData));
    }
  }, []);

  // Save to localStorage whenever changes are saved
  const handleSave = () => {
    localStorage.setItem("studentProfile", JSON.stringify(profileData));
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profilePhoto: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // const [, setStudentId] = useState<number | null>(null);

  // const { data: studentData } = useFetch<{ student_id: number }>({
  //   method: "GET",
  //   url: `${import.meta.env.VITE_BACKEND_URL}/student/student_data/${profileData.id}`,
  // });

  // useEffect(() => {
  //   if (studentData?.student_id) {
  //     setStudentId(studentData.student_id);
  //   }
  // }, [studentData]);


  return (
    <div className="min-h-screen bg-gray-100 p-8 relative w-full rounded-4xl items-end justify-center ">
      <div className="relative w-full rounded-4xl bg-gray-100 flex items-end justify-center"></div>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/student"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 rounded-4xl px-3 py-2 hover:bg-blue-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-4xl hover:bg-blue-700 flex items-center gap-2"
          >
            <FaEdit size={16} />
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Profile Photo Section */}
          <section className="bg-white rounded-3xl p-6 flex flex-col items-center text-center shadow-xl ">
            <h3 className="text-2xl font-semibold mb-2">Profile Photo</h3>
            <p className="text-sm text-gray-500 mb-6">
              Upload your photo for the face attendance system
            </p>
            <div className="relative">
              <img
                src={profileData.profilePhoto}
                alt="Profile"
                className="rounded-full w-40 h-40 object-cover mb-6"
              />
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-8 right-6 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  >
                    <FaCamera size={16} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div>
              <h4 className="font-semibold">{profileData.fullName}</h4>
              <p className="text-sm text-gray-600">{profileData.rollNumber}</p>
              <p className="text-sm text-gray-600">{profileData.department}</p>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 col-span-2 shadow-xl ">
            <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  disabled={!isEditing}
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full rounded-3xl border outline-none border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="rollNumber" className="block text-sm font-semibold mb-1">
                  Student/College ID
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  disabled={!isEditing}
                  value={profileData.rollNumber}
                  onChange={(e) => setProfileData({ ...profileData, rollNumber: e.target.value })}
                  className="w-full rounded-3xl border outline-none border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  disabled={!isEditing}
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full rounded-3xl border outline-none border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  disabled={!isEditing}
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full rounded-3xl border outline-none border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  disabled={!isEditing}
                  value={profileData.dob}
                  onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  className="w-full rounded-3xl border outline-none border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-semibold mb-1">
                  Department
                </label>
                <select
                  id="department"
                  disabled={!isEditing}
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  className="w-full rounded-3xl border outline-none border-gray-200 px-3 py-2 text-sm disabled:bg-gray-100"
                >
                  <option>Computer Science</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                  <option>Business Administration</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-semibold mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  disabled={!isEditing}
                  rows={3}
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full rounded-3xl border outline-none border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100 resize-none"
                />
              </div>
            </form>
          </section>
        </div>

        {/* System Information Section */}
        <section className="bg-white rounded-3xl p-6 shadow-3xl ">
          <h3 className="text-2xl font-semibold mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            {/* To Upload and check face data */}
            <div>
              <p className="font-semibold">Face Recognition Status</p>
              {profileData.face_embedding ? (
                <p className="text-green-600 font-semibold">✓ Enrolled</p>
              ) : (
                <button
                  onClick={() => setShowFaceRegister(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Register Face
                </button>
              )}

              {showFaceRegister && (
                <FaceRegister studentId={73} onClose={() => setShowFaceRegister(false)} />
              )}
            </div>
            <div>
              <p className="font-semibold">Last Profile Update</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Account Status</p>
              <p className="text-green-600 font-semibold">Active</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 