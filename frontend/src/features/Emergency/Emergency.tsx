import Header from '../../shared/components/header/Header';
import PageList from '../../shared/components/sidebar/PageList';
import axios from 'axios';
import { useState, useEffect } from "react";

const Emergency = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [customMessage, setCustomMessage] = useState('');

 // Get teacher ID from your authentication system
  const getTeacherId = () => {
    // Depending on how you store auth info, use one of these:
    
    // Option 1: From cookies (if you store teacher ID in cookies)
    // const cookies = document.cookie.split(';');
    // const teacherCookie = cookies.find(cookie => cookie.trim().startsWith('teacherId='));
    // if (teacherCookie) return teacherCookie.split('=')[1];
    
    // Option 2: From localStorage (if you store it there)
    // return localStorage.getItem('teacherId');
    
    // Option 3: From your auth context/state management
    // return authState.user?.id;
    
    // Option 4: From API that returns current user info
    // You might need to create an API endpoint that returns current user info
    
    // For now, return a placeholder - you'll need to implement this based on your auth system
    return 1; // Replace with actual implementation
  };

  // Fetch teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const teacherId = getTeacherId();
        const response = await axios.get(`/api/emergency/classes/${teacherId}`);
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        setMessage('Failed to load classes');
      }
    };
    
    fetchClasses();
  }, []);

  const handleEmergency = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const teacherId = getTeacherId();
      const payload = {
        teacherId: teacherId,
        message: customMessage || 'Emergency alert from your teacher! Please check your messages immediately.'
      };
      
      // Include classId if a specific class is selected
      if (selectedClass) {
        payload.classId = selectedClass;
      }
      
      const resp = await axios.post('/api/emergency', payload);
      setMessage(resp.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || err.message || 'Failed to send emergency notification.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex">
        <aside className="w-64">
          <PageList />
        </aside>

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Emergency Notification</h1>
          
          {classes.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Class (optional - leave empty for all classes):
              </label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name} {cls.section && `(${cls.section})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Custom Message (optional):
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter custom emergency message"
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          <button
            onClick={handleEmergency}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Sending Emergency Alerts...' : 'Send Emergency Notification'}
          </button>

          {message && (
            <div className="mt-4 p-3 border rounded bg-gray-50">
              {message}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Emergency;