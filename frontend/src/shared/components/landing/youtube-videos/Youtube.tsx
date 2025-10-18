const Youtube = () => {
  return (
    <section className="py-16 bg-gradient-to-tr from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Experience Classroom in Action</h2>
           <p className="text-lg text-gray-600 mb-10 text-center">
            Drive student agency with tools that meet students where they are – and build skills for their future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
           
            <div className="rounded-xl overflow-hidden shadow-lg max-w-md mx-auto">
              <iframe
                src="https://www.youtube.com/embed/_naHzmRVr5A"
                title="Classroom Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-56"
              ></iframe>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg max-w-md mx-auto">
              <iframe
                src="https://www.youtube.com/embed/_naHzmRVr5A"
                title="Feature Highlights"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-56"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Youtube