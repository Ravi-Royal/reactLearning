import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import { HOME_PAGE } from '@pages/constants/page.constants';

function HomePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs />
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          {HOME_PAGE.HEADING}
        </h1>
        <p className="mt-2 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">{HOME_PAGE.DESCRIPTION}</p>
      </div>
    </div>
  );
}

export default HomePage;
