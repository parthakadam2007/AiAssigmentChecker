import { Calendar, Target, BookOpenCheck } from "lucide-react"

export function ActionsReminders() {
  const actionsReminders = [
    { icon: Calendar, text: "Schedule 1-on-1s for Prashik" },
    { icon: BookOpenCheck, text: "Review lesson on Quadratic Equations" },
    { icon: Target, text: "Plan next class discussion topics" },
  ]

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Actions & Reminders</h3>
      <div className="space-y-4">
        {actionsReminders.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <item.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}