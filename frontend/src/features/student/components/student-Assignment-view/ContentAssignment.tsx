import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from "../../../../shared/hooks/UseFetch"; // Assuming this path is correct
import { useNavigate } from 'react-router-dom';
// Placeholder for FileText icon
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
  </svg>
);

// Placeholder for MoreVertical icon
const MoreVerticalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
);

// Placeholder for file icon based on type (simplified)
const FileIcon = ({ fileName }: { fileName: string }) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  let iconPath = ''; // This would typically be a more robust icon mapping

  if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
    iconPath = 'https://placehold.co/40x40/e0e0e0/333333?text=IMG'; // Generic image icon placeholder
  } else if (extension === 'docx' || extension === 'doc') {
    iconPath = 'https://placehold.co/40x40/e0e0e0/333333?text=DOC'; // Generic document icon placeholder
  } else if (extension === 'pdf') {
    iconPath = 'https://placehold.co/40x40/e0e0e0/333333?text=PDF'; // Generic PDF icon placeholder
  } else {
    iconPath = 'https://placehold.co/40x40/e0e0e0/333333?text=FILE'; // Generic file icon placeholder
  }

  return <img src={iconPath} alt="file icon" className="w-10 h-10 rounded-md object-cover" />;
};


type Assignment = {
  title?: any;
  assignment_id?: any;
  created_date?: any;
  points?: any;
  description?: any;
  // add other properties as needed
};

const ContentAssignment: React.FC = () => {
  const { assignment_id } = useParams();

  // Fetch assignment details data
  const { data: dataAssignment } = useFetch<Assignment>({
    method: 'GET',
    url: `${import.meta.env.VITE_BACKEND_URL}/student/class/assignment/${assignment_id}`,
  });

  // Fetch assignment attachments data
  const {
    data: dataAssignmentAttachments = [],
  } = useFetch<any[]>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/student/class/assignment/attachment/${assignment_id}`
  });

  // Format the assignment creation date
  const formattedDate = dataAssignment?.created_date
    ? new Date(dataAssignment.created_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';
    const navigate = useNavigate();

  return (

    <div className="p-4 sm:p-6 lg:p-4 font-sans w-150 rounded-tl-4xl">
      <div className="w-3xl mx-auto rounded-[30px] overflow-hidden">
      {/* Right Column: Assignment Details */}
      <div className="flex-1 p-6 pt-10 sm:p-8 sm:pt-12 lg:p-6 lg:pt-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
        <FileTextIcon />
        </div>
        <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
        {dataAssignment?.title || 'Assignment Title'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
        Teacher • {formattedDate}
        </p>
        </div>
      </div>
      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <MoreVerticalIcon />
      </button>
        </div>

        {/* Points */}
        <p className="text-lg text-gray-700 mb-6 border-b border-gray-200 pb-4">
      {dataAssignment?.points || 0} points
        </p>

        {/* Description/Instructions */}
        <div className="mb-8">
      <p className="text-base text-gray-700 leading-relaxed">
        {dataAssignment?.description || 'No description provided.'}
      </p>
        </div>

        {/* --- */}
        {/* Assignment Attachments Section */}
        <div className="border-t border-gray-200 pt-6 mb-8">
      {/* <h3 className="text-lg font-medium text-gray-800 mb-3">Attachments</h3> */}
      {dataAssignmentAttachments && dataAssignmentAttachments.length > 0 ? (
        dataAssignmentAttachments.map((attachment: any) => (
        <a
        key={attachment.upload_id}
        href={attachment.file_link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer mb-2"
        >
        <FileIcon fileName={attachment.file_original_name} />
        <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">
          {attachment.file_original_name}
        </p>
        <p className="text-xs text-gray-500">
          {attachment.file_original_name.split('.').pop()?.toUpperCase()}
        </p>
        </div>
        </a>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">No attachments for this assignment.</div>
      )}
        </div>
        {/* --- */}
        <div>
          <button
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mb-4'
            onClick={() => navigate(`/student/assignment/${assignment_id}`)}
          >
            view Grades
          </button>
        </div>

        {/* Class Comments */}
        <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Class comments</h3>
      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
        Add a class comment
      </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ContentAssignment;
