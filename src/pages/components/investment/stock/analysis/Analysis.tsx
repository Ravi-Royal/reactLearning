import { Link } from 'react-router-dom';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';

function Analysis() {
  return (
    <div className="p-6">
      <Breadcrumbs />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">P&L Analysis</h1>
        <p className="text-gray-600 mt-1">Choose a source to analyze your portfolio P&L.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Zerodha</h2>
            <p className="text-gray-600 text-sm mt-1">Excel-based import and P&L calculations.</p>
          </div>

          <Link
            to="zerodha"
            className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
          >
                        Open Zerodha
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
