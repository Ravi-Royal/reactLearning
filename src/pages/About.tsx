import Breadcrumbs from './navigation/Breadcrumbs';

function AboutPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs />
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          About Us
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
          This page contains information about our application and team.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;