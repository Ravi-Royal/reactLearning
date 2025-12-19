import { Link } from 'react-router-dom';
import Breadcrumbs from '../../../navigation/Breadcrumbs';

function Bonds() {
  return (
    <div className="p-6">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-gray-800">Bonds</h1>
      <p className="text-gray-600 mt-2">Learn about bonds and fixed income investments.</p>
      <div className="mt-4">
        <p>This is a placeholder for bonds information.</p>
        <Link
          to="/investment/bonds/before-starting"
          className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mt-4 mr-4"
        >
                    Before Starting Bond Checklist
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          to="/investment/bonds/checklist"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-4"
        >
                    Bond Checklist
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default Bonds;