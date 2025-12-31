function HomePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          Welcome to the Home Page
        </h1>
        <p className="mt-2 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
          This is the main landing page of the application.
        </p>
      </div>
    </div>
  );
}

export default HomePage;