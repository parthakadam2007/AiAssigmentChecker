import React from "react";
import useFetch from "../../../../shared/hooks/UseFetch";
import wordIcon from "../../../../assets/word-document-svgrepo-com.svg";
import pptIcon from "../../../../assets/powerpoint-svgrepo-com (1).svg";
import pdfIcon from "../../../../assets/pdf-file-svgrepo-com.svg";
import fileIcon from "../../../../assets/file-svgrepo-com.svg";
import feedbackIcon from "../../../../assets/Robot_2.svg";
// import correctionIcon from "../../../../assets/edit_24dp_2854C5_FILL0_wght400_GRAD0_opsz24.png";
import suggestionIcon from "../../../../assets/Analytics.svg";
import weaknessIcon from "../../../../assets/delete.png";
import improvementIcon from "../../../../assets/improvement.svg";
import AnimatedLoader from "../../../../shared/components/loaders/DefaultLoader";
import Pen from "../../../../assets/pen.svg";
const AssignmentCheck: React.FC<{
  submission_id: string | undefined;
  student_id: string | undefined;
}> = ({ submission_id, student_id }) => {
  const {
    data: assignmentsMetadata,
    error: assignmentsMetadataError,
    status: assignmentsMetadataStatus,
  } = useFetch<any[]>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/teacher/submission/${submission_id}/student/${student_id}`,
  });

  const getFileIcon = (fileName: string) => {
    if (!fileName) return fileIcon;
    if (fileName.endsWith(".pdf")) return pdfIcon;
    if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) return wordIcon;
    if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) return pptIcon;
    return fileIcon;
  };

  const getFileTypeLabel = (fileName: string) => {
    if (!fileName) return "File";
    if (fileName.endsWith(".pdf")) return "PDF Document";
    if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) return "Word Document";
    if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) return "PowerPoint Presentation";
    return "File";
  };

  if (assignmentsMetadataStatus === "loading")
    return (
      <div className="flex justify-center items-center h-[80vh] ml-[50%]">
        <AnimatedLoader />
      </div>
    );

  if (assignmentsMetadataError) return <p className="text-red-600 text-center mt-10">Error fetching data.</p>;
  if (!assignmentsMetadata || assignmentsMetadata.length === 0)
    return <p className="text-gray-600 text-center mt-10">No data found.</p>;

  const data = assignmentsMetadata[0];
  const fileIconSrc = getFileIcon(data.file_original_name);
  const fileTypeLabel = getFileTypeLabel(data.file_original_name);

  let aiDetection: any = null;
  let plagiarism: any = null;

  try {
    aiDetection = data.aitextdetection ? JSON.parse(data.aitextdetection) : null;
  } catch (e) {
    console.error("Error parsing aitextdetection:", e);
  }

  try {
    plagiarism = data.plagiarism ? JSON.parse(data.plagiarism) : null;
  } catch (e) {
    console.error("Error parsing plagiarism:", e);
  }

  return (
    <div className="bg-white rounded-2xl  p-8 mx-auto max-w-6xl h-[80vh] overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center  pb-4">
        <h2 className="text-2xl font-bold text-blue-700">
          {data.first_name} {data.last_name}
        </h2>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg shadow-sm">
          <span className="text-gray-600 font-medium">Grade:</span>
          <span className="font-semibold text-blue-700 text-lg">{data.obtained_grade}/10</span>
        </div>
      </div>

      {/* File & Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Info */}
        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <img src={fileIconSrc} alt="File" className="w-12 h-12 object-contain" />
          <div>
            <a
              href={data.file_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline"
            >
              {data.file_original_name}
            </a>
            <p className="text-gray-500 text-sm">{fileTypeLabel}</p>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-gray-50 p-4 rounded-xl flex gap-3 items-start shadow-sm">
          <img src={feedbackIcon} alt="Feedback" className="w-7 h-7" />
          <div>
            <h4 className=" font-semibold mb-1">Feedback</h4>
            <p className="text-gray-700 whitespace-pre-wrap">
              {data.feedback || "No feedback provided yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Corrections */}
      {data.corrections && (
        <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <img src={Pen} alt="Corrections" className="w-6 h-6" />
          <div>
            <h4 className="font-semibold mb-1">Corrections</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{data.corrections}</p>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions && (
        <div className="bg-yellow-50 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <img src={suggestionIcon} alt="Suggestions" className="w-6 h-6" />
          <div>
            <h4 className=" font-semibold mb-1">Suggestions</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{data.suggestions}</p>
          </div>
        </div>
      )}

      {/* Weakness & Improvement */}
      {(data.weaknesses || data.improvementareas) && (
        <div className="grid md:grid-cols-2 gap-6">
          {data.weaknesses && (
            <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3 shadow-sm">
              <img src={weaknessIcon} alt="Weaknesses" className="w-6 h-6" />
              <div>
                <h4 className="Weaknesses font-semibold mb-1">Weaknesses</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{data.weaknesses}</p>
              </div>
            </div>
          )}
          {data.improvementareas && (
            <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3 shadow-sm">
              <img src={improvementIcon} alt="Improvement Areas" className="w-6 h-6" />
              <div>
                <h4 className="Weaknesses font-semibold mb-1">Improvement Areas</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{data.improvementareas}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Text Detection */}
      {aiDetection && (
        <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
          <h4 className="text-blue-700 font-semibold mb-2">AI Text Detection</h4>
          <p className="text-gray-700 text-sm">
            <b>Score:</b> {aiDetection.score?.toFixed(2)}% <br />
            <b>Text Length:</b> {aiDetection.length} words <br />
            <b>Readability Score:</b> {aiDetection.readability_score}
          </p>
        </div>
      )}

      {/* Plagiarism */}
      {plagiarism && (
        <div className="bg-green-50 p-4 rounded-xl shadow-sm">
          <h4 className="text-green-700 font-semibold mb-2">Plagiarism Report</h4>
          <p className="text-gray-700 text-sm">
            <b>Score:</b> {plagiarism.result?.score}% <br />
            <b>Total Sources:</b> {plagiarism.result?.sourceCounts} <br />
            <b>Plagiarized Words:</b> {plagiarism.result?.totalPlagiarismWords} /{" "}
            {plagiarism.result?.textWordCounts}
          </p>

          {plagiarism.sources && plagiarism.sources.length > 0 && (
            <div className="mt-2">
              <b>Top Sources:</b>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
                {plagiarism.sources.slice(0, 3).map((src: any, i: number) => (
                  <li key={i}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {src.title || src.source}
                    </a>{" "}
                    — {src.score}% match
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentCheck;
