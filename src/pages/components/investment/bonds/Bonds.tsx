import { Link } from 'react-router-dom';
import Breadcrumbs from '../../../navigation/Breadcrumbs';

function Bonds() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Bonds</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Learn about bonds and fixed income investments.</p>
        <div className="mt-4 sm:mt-6">
          <p className="text-sm sm:text-base text-gray-700 mb-4">This is a placeholder for bonds information.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/investment/bonds/before-starting"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              Before Starting Bond Checklist
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/investment/bonds/checklist"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              Bond Checklist
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bonds;