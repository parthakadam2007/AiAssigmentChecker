import React from 'react';
import useFetch from '../../../../shared/hooks/UseFetch';
import { useNavigate } from 'react-router-dom';
import AnimatedLoader from '../../../../shared/components/loaders/DefaultLoader';
interface Assignment {
  assignment_id: number;
  title: string;
  duedate: string | null;
  description: string;
  points: number;
  class_name: string;
  submission_id: number | null; 
  attachmentcount: string;
  hasattachment: boolean;
  status: string;
  first_name: string;
  last_name: string;
}

const StudentSubmission: React.FC<{ class_id: string|undefined; student_id: string |undefined}> = ({ class_id, student_id }) => {
  const navigate = useNavigate();
  const {
    data: assignments,
    error,
    status, 
    refetch,
  } = useFetch<Assignment[]>({
    method: 'GET',
    url: `${import.meta.env.VITE_BACKEND_URL}/teacher/class/submissions/${class_id}/student/${student_id}`,
  });
  
  const {
    data: studentData,
    status: studentStatus,
  } = useFetch<Assignment>({
    method: 'GET',
    url: `${import.meta.env.VITE_BACKEND_URL}/teacher/student/${student_id}`,
  });

  const isLoading = studentStatus === 'loading' || studentStatus === 'idle';
  const isError = status === 'error';
  const isSuccess = status === 'success';

  return (
    <div style={{ padding: '20px', width: '800px', marginLeft:' 30px' }}>
      {/* Header Section - Matches the photo */}
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-amber-900 rounded-full flex items-center justify-center mr-4">
            <span className="text-white text-3xl font-bold">
              {studentData?.first_name?.charAt(0) || ''}
              {studentData?.last_name?.charAt(0) || ''}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {studentData?.first_name} {studentData?.last_name}
          </h2>
        </div>
        <div className="border-b border-gray-300 mb-4"></div>
      </div>

      {/* Filter Section */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', }}>All</h3>
      </div>

      {/* Conditional Rendering based on hook status */}
          {isLoading && <p style={{ textAlign: 'center', color: '#666' }}>
          <div className='mt-[300px]'>
            <AnimatedLoader />
          </div>
      </p>}
      {isError && (
        <p style={{ textAlign: 'center', color: 'red' }}>
          Error: {error?.message || 'Failed to load assignments.'}
          <button 
            onClick={refetch} 
            style={{ 
              marginLeft: '8px', 
              padding: '4px 8px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </p>
      )}

      {isSuccess && (!assignments || assignments.length === 0) && (
        <p style={{ textAlign: 'center', color: '#666' }}>No assignments found for this student.</p>
      )}

      {isSuccess && assignments && assignments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assignments.map((assignment) => (
            <div
              key={assignment.assignment_id}
             className="flex justify-between items-center p-3   border-b-red-300  cursor-pointer bg-white  hover:shadow-md transition-shadow hover:bg-gray-50"
              onClick={() => assignment.submission_id && navigate(`/teacher/student/${student_id}/submission/${assignment.submission_id}`)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '500' }}>{assignment.title}</span>
                  <span style={{ color: '#666' }}>
                    {assignment.duedate ? new Date(assignment.duedate).toLocaleDateString() : 'No due date'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {assignment.status === 'Assigned' ? (
                      <strong>Assigned</strong>
                    ) : (
                      assignment.status
                    )}
                  </span>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {/* {assignment.points !== null ? `${assignment.points}/100` : '--/100'} */}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSubmission;