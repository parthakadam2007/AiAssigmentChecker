export function AssignmentSummary() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-2">Assignment Summary</h3>
      <p className="text-sm text-gray-600 mb-4">Overview of submission statuses.</p>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Assignments</span>
          <span className="font-semibold">7</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Submitted</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">3</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Pending</span>
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">2</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Overdue</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">2</span>
        </div>

        <button className="w-full mt-6 bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
          View All Assignments
        </button>
      </div>
    </div>
  )
}