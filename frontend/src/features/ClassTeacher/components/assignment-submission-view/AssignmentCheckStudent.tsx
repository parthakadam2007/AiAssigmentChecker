import React from "react";
import useFetch from "../../../../shared/hooks/UseFetch";
import wordIcon from "../../../../assets/word-document-svgrepo-com.svg";
import pptIcon from "../../../../assets/powerpoint-svgrepo-com (1).svg";
import pdfIcon from "../../../../assets/pdf-file-svgrepo-com.svg";
import fileIcon from "../../../../assets/file-svgrepo-com.svg";
import feedbackIcon from "../../../../assets/Robot_2.svg";
import correctionIcon from "../../../../assets/edit_24dp_2854C5_FILL0_wght400_GRAD0_opsz24.png";
import suggestionIcon from "../../../../assets/Analytics.svg";
import weaknessIcon from "../../../../assets/delete.png";
import improvementIcon from "../../../../assets/add-svgrepo-com.svg";
import AnimatedLoader from "../../../../shared/components/loaders/DefaultLoader";

const AssignmentCheckStudent: React.FC<{
  submission_id: string | undefined;
  student_id: string | undefined;
}> = ({ submission_id, student_id }) => {
  const {
    data: assignmentsMetadata,
    error: assignmentsMetadataError,
    status: assignmentsMetadataStatus,
  } = useFetch<any[]>({
    method: "GET",
    url: `${import.meta.env.VITE_BACKEND_URL}/student/submission/${submission_id}/student/${student_id}`,
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

  if (assignmentsMetadataStatus === "loading") return <div className="mt-[250px] ml-[85vh]"><AnimatedLoader /></div>;
  if (assignmentsMetadataError) return <p>Error fetching data.</p>;
  if (!assignmentsMetadata || assignmentsMetadata.length === 0) return <p>No data found.</p>;

  const data = assignmentsMetadata[0];
  const fileIconSrc = getFileIcon(data.file_original_name);
  const fileTypeLabel = getFileTypeLabel(data.file_original_name);

	return (
			<div style={{
				padding: "2rem",
				maxWidth: "1500px",
				margin: "2rem auto",
				display: "flex",
				flexDirection: "column",
				gap: "1.5rem",
				background: "#fff",
				borderRadius: "16px",
        overflowY:"scroll",
        height: "79vh",
        marginTop:"0"
			}}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
				<h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.6rem", color: "#2854C5" }}>
					{data.first_name} {data.last_name}
				</h2>
			<div style={{
				display: "flex",
				justifyContent: "flex-end",
				alignItems: "center",
				gap: "0.7rem",
				marginTop: "1rem"
			}}>
				<span style={{ fontSize: "1rem", color: "#555", fontWeight: 500 }}>Grade:</span>
				<span style={{
					fontWeight: "bold",
					fontSize: "1.3rem",
					color: "#2854C5",
					background: "#eaf1fb",
					borderRadius: "8px",
					padding: "0.3rem 1rem"
				}}>
					{data.obtained_grade}/10
				</span>
			</div>
			</div>

			<div style={{
				display: "flex",
				gap: "2rem",
				borderTop: "1px solid #eee",
				paddingTop: "1.5rem"
			}}>
				<div style={{ flex: 1 }}>
								<div style={{
									display: "flex",
									alignItems: "center",
									gap: "1.2rem",
									padding: "1.2rem",
									borderRadius: "10px",
									background: "#f6f8fa"
								}}>
						<img
							src={fileIconSrc}
							alt="File thumbnail"
							style={{ width: "54px", height: "54px", objectFit: "contain" }}
						/>
						<div>
							<a
								href={`${data.file_link}`}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									fontWeight: "bold",
									color: "#2854C5",
									textDecoration: "none",
									fontSize: "1rem"
								}}
							>
								{data.file_original_name}
							</a>
							<p style={{ fontSize: "0.85rem", color: "#888", margin: "0.25rem 0 0 0" }}>
								{fileTypeLabel}
							</p>
						</div>
					</div>
				</div>

				<div style={{ flex: 1 }}>
								<div style={{
									padding: "1.2rem",
									borderRadius: "10px",
									background: "#f6f8fa",
									minHeight: "150px",
									display: "flex",
									alignItems: "flex-start",
									gap: "1rem"
								}}>
						<img src={feedbackIcon} alt="Feedback" style={{ width: "32px", height: "32px" }} />
						<div>
							<h4 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#2854C5" }}>Feedback</h4>
							<p style={{
								whiteSpace: "pre-wrap",
								margin: 0,
								fontSize: "0.98rem",
								color: "#333"
							}}>
								{data.feedback || "No feedback provided yet."}
							</p>
						</div>
					</div>
				</div>
			</div>

			{data.corrections && (
						<div style={{
							padding: "1.2rem",
							borderRadius: "10px",
							background: "#fff7f7",
							display: "flex",
							alignItems: "flex-start",
							gap: "1rem"
						}}>
					<img src={correctionIcon} alt="Corrections" style={{ width: "28px", height: "28px" }} />
					<div>
						<h4 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#d9534f" }}>Corrections</h4>
						<p style={{
							whiteSpace: "pre-wrap",
							margin: 0,
							fontSize: "0.98rem",
							color: "#333"
						}}>
							{data.corrections}
						</p>
					</div>
				</div>
			)}
			{data.suggestions && (
						<div style={{
							padding: "1.2rem",
							borderRadius: "10px",
							background: "#fffbe7",
							display: "flex",
							alignItems: "flex-start",
							gap: "1rem"
						}}>
					<img src={suggestionIcon} alt="Suggestions" style={{ width: "28px", height: "28px" }} />
					<div>
						<h4 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#f0ad4e" }}>Suggestions</h4>
						<p style={{
							whiteSpace: "pre-wrap",
							margin: 0,
							fontSize: "0.98rem",
							color: "#333"
						}}>
							{data.suggestions}
						</p>
					</div>
				</div>
			)}

			{(data.weaknesses || data.improvementareas) && (
				<div style={{
					display: "flex",
					gap: "2rem",
					flexDirection: "row",
					paddingTop: "0.5rem"
				}}>
					{data.weaknesses && (
									<div style={{
										flex: 1,
										padding: "1.2rem",
										borderRadius: "10px",
										background: "#f6f8fa",
										display: "flex",
										alignItems: "flex-start",
										gap: "1rem"
									}}>
							<img src={weaknessIcon} alt="Weaknesses" style={{ width: "28px", height: "28px" }} />
							<div>
								<h4 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#d9534f" }}>Weaknesses</h4>
								<p style={{
									whiteSpace: "pre-wrap",
									margin: 0,
									fontSize: "0.98rem",
									color: "#333"
								}}>
									{data.weaknesses}
								</p>
							</div>
						</div>
					)}
					{data.improvementareas && (
									<div style={{
										flex: 1,
										padding: "1.2rem",
										borderRadius: "10px",
										background: "#f6f8fa",
										display: "flex",
										alignItems: "flex-start",
										gap: "1rem"
									}}>
							<img src={improvementIcon} alt="Improvement Areas" style={{ width: "28px", height: "28px" }} />
							<div>
								<h4 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#5cb85c" }}>Improvement Areas</h4>
								<p style={{
									whiteSpace: "pre-wrap",
									margin: 0,
									fontSize: "0.98rem",
									color: "#333"
								}}>
									{data.improvementareas}
								</p>
							</div>
						</div>
					)}
				</div>
			)}


		</div>
	);

};

export default AssignmentCheckStudent;