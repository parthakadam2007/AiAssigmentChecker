export function TeachingTips() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-2">AI-Powered Teaching Tips</h3>
      <p className="text-sm text-gray-600 mb-4">Personalized insights to enhance your teaching effectiveness.</p>
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 text-sm mb-1">Targeted Intervention</h4>
            <p className="text-xs text-blue-700">
              Identify students struggling with specific concepts and provide tailored resources or one-on-one
              support sessions.
            </p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 text-sm mb-1">Engagement Boosters</h4>
            <p className="text-xs text-green-700">
              Incorporate interactive activities or group projects where student participation is currently low.
            </p>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 text-sm mb-1">Content Review</h4>
            <p className="text-xs text-purple-700">
              Review specific lesson materials that correlate with lower class performance and consider
              alternative teaching methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}