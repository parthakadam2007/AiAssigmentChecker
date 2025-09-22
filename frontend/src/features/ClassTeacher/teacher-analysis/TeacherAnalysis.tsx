import { ClassAttendance } from "./class-attendance/class-attendance";
import { AssignmentSummary } from "./assignment-summary/assignment-summary";
import { ClassRoster } from "./class-roster/class-roster";
import { ActionsReminders } from "./actions-reminders/actions-reminders";
import { StudentFeedback } from "./student-feedback/student-feedback";
import { ClassProgression } from "./class-progression/class-progression";
import { AssignmentStatus } from "./assignment-status/assignment-status";
import { TeachingTips } from "./teaching-tips/teaching-tips";

export default function TeacherAnalysis() {
  return (
    <div className="w-full rounded-4xl bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Analysis</h1>
          <p className="text-gray-600">Track your class's academic progress and teaching effectiveness</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* First Row - Top 4 Components */}
          <div className="bg-white rounded-xl shadow-sm">
            <ClassAttendance />
          </div>
          <div className="bg-white rounded-xl shadow-sm">
            <AssignmentSummary />
          </div>
          <div className="bg-white rounded-xl shadow-sm">
            <ClassRoster />
          </div>
          <div className="bg-white rounded-xl shadow-sm">
            <ActionsReminders />
          </div>
        </div>

        {/* Second Row - Bottom 4 Components */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm">
            <StudentFeedback />
          </div>
          <div className="bg-white rounded-xl shadow-sm">
            <ClassProgression />
          </div>
          <div className="bg-white rounded-xl shadow-sm">
            <AssignmentStatus />
          </div>
          <div className="bg-white rounded-xl shadow-sm">
            <TeachingTips />
          </div>
        </div>
      </div>
    </div>
  )
}