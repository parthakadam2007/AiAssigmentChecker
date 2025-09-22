export function AssignmentStatus() {
  const assignments = [
    { title: "History Essay", dueDate: "2024-11-10", status: "Overdue" },
    { title: "Chemistry Project", dueDate: "2024-11-25", status: "Pending" },
    { title: "Physics Lab Report", dueDate: "2024-11-15", status: "Overdue" },
    { title: "Literature Review", dueDate: "2024-11-30", status: "Pending" },
  ]

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Assignment Submission Status</h3>
      <div className="space-y-1">
        <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 pb-2 border-b">
          <span>Title</span>
          <span>Due Date</span>
          <span>Status</span>
        </div>
        {assignments.map((assignment, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 py-2 text-sm">
            <span className="text-gray-900 truncate">{assignment.title}</span>
            <span className="text-gray-600">{assignment.dueDate}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              assignment.status === "Overdue"
                ? "bg-red-100 text-red-800"
                : "bg-orange-100 text-orange-800"
            }`}>
              {assignment.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}