import React, { useState } from "react";
import useFetch from "../../../../shared/hooks/UseFetch";

interface ClassFeedbackSummary {
  class_id: number;
  class_name: string;
  subject: string;
  total_students: number;
  total_submissions: number;
  graded_submissions: number;
  feedback_count: number;
  avg_grade: number;
  common_weaknesses: string;
  improvement_areas: string;
}

const StudentProgramsParticipation: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassFeedbackSummary | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: classFeedback, status } = useFetch<ClassFeedbackSummary[]>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/teacher/analytics/class-feedback`,
  });

  const handleReadMore = (classItem: ClassFeedbackSummary) => {
    setSelectedClass(classItem);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const generateDescription = (classItem: ClassFeedbackSummary) => {
    const weaknesses = classItem.common_weaknesses
      ? classItem.common_weaknesses.split("|").slice(0, 2).join(", ")
      : "";
    const improvements = classItem.improvement_areas
      ? classItem.improvement_areas.split("|").slice(0, 2).join(", ")
      : "";

    let description = `Average grade: ${classItem.avg_grade}%. `;
    if (weaknesses) description += `Common issues: ${weaknesses}. `;
    if (improvements) description += `Focus areas: ${improvements}.`;
    if (!weaknesses && !improvements)
      description = `${classItem.feedback_count} feedback entries. ${classItem.graded_submissions} assignments graded.`;

    return description.length > 150 ? description.substring(0, 147) + "..." : description;
  };

  const getColorScheme = (index: number) => {
    const schemes = [
      { color: "text-indigo-600", bgColor: "bg-indigo-50" },
      { color: "text-green-600", bgColor: "bg-green-50" },
      { color: "text-purple-600", bgColor: "bg-purple-50" },
      { color: "text-yellow-600", bgColor: "bg-yellow-50" },
      { color: "text-blue-600", bgColor: "bg-blue-50" },
      { color: "text-red-600", bgColor: "bg-red-50" },
    ];
    return schemes[index % schemes.length];
  };

  // ========================= LOADING STATE =========================
  if (status === "loading") {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Class Performance Feedback</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-gray-200 shadow-sm p-6 animate-pulse min-h-[220px] flex flex-col justify-between"
            >
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-8"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ========================= ERROR STATE =========================
  if (status === "error") {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Class Performance Feedback</h2>
        <div className="text-center py-8 text-red-500">
          Failed to load class feedback data
        </div>
      </div>
    );
  }

  // ========================= EMPTY STATE =========================
  if (!classFeedback || classFeedback.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Class Performance Feedback</h2>
        <div className="text-center py-8 text-gray-500">
          No feedback data available yet. Grade some assignments to see insights.
        </div>
      </div>
    );
  }

  // ========================= MAIN CONTENT =========================
  return (
    <>
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Class Performance Feedback</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-8">
          {classFeedback.slice(0, 4).map((classItem, index) => {
            const { color, bgColor } = getColorScheme(index);
            const description = generateDescription(classItem);

            return (
              <div
                key={classItem.class_id}
                className={`${bgColor} rounded-2xl border border-gray-200 shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all duration-300 min-h-[220px] flex flex-col justify-between`}
                title={`${classItem.class_name} - ${classItem.subject}`}
              >
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold text-gray-700">
                      {classItem.class_name.length > 15
                        ? classItem.class_name.substring(0, 12) + "..."
                        : classItem.class_name}
                    </span>
                    <span className={`font-extrabold text-xl select-none ${color}`}>
                      {classItem.avg_grade || 0}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{classItem.subject}</div>
                  <p className="font-medium text-sm select-none text-gray-600 leading-snug">
                    {description}
                  </p>
                </div>

                <button
                  onClick={() => handleReadMore(classItem)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-3 self-start"
                >
                  Read feedback →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================= MODAL ========================= */}
      {showModal && selectedClass && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedClass.class_name}
                  </h2>
                  <p className="text-gray-600">{selectedClass.subject}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-1">Total Students</h3>
                  <p className="text-2xl font-bold text-blue-600">{selectedClass.total_students}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-700 mb-1">Avg Grade</h3>
                  <p className="text-2xl font-bold text-green-600">{selectedClass.avg_grade}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-700 mb-1">Feedback Given</h3>
                  <p className="text-2xl font-bold text-purple-600">{selectedClass.feedback_count}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-700 mb-1">Submissions</h3>
                  <p className="text-2xl font-bold text-yellow-600">{selectedClass.total_submissions}</p>
                </div>
              </div>

              {selectedClass.common_weaknesses && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Common Issues Identified</h3>
                  <div className="bg-red-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap break-words">
                      {selectedClass.common_weaknesses}
                    </p>
                  </div>
                </div>
              )}

              {selectedClass.improvement_areas && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Suggested Improvement Areas</h3>
                  <div className="bg-green-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap break-words">
                      {selectedClass.improvement_areas}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentProgramsParticipation;
