import { Link } from 'react-router-dom';
import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import { RESPONSIVE_PATTERNS } from '@constants/responsive.constants';

function Analysis() {
  return (
    <div className={RESPONSIVE_PATTERNS.padding.cardLg}>
      <Breadcrumbs />

      <div className={RESPONSIVE_PATTERNS.margin.section}>
        <h1 className={`${RESPONSIVE_PATTERNS.text['2xl']} font-bold text-gray-800`}>P&L Analysis</h1>
        <p className={`${RESPONSIVE_PATTERNS.text.base} text-gray-600 mt-1`}>
          Choose a source to analyze your portfolio P&L.
        </p>
      </div>
      <div className={`bg-white rounded-lg shadow-md ${RESPONSIVE_PATTERNS.padding.cardLg} border border-gray-200`}>
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${RESPONSIVE_PATTERNS.gap.md}`}>
          <div>
            <h2 className={`${RESPONSIVE_PATTERNS.text.lg} font-semibold text-gray-800`}>Zerodha</h2>
            <p className={`text-gray-600 ${RESPONSIVE_PATTERNS.text.sm} mt-1`}>
              Excel-based import and P&L calculations.
            </p>
          </div>

          <Link
            to="zerodha"
            className={`inline-flex items-center justify-center ${RESPONSIVE_PATTERNS.button.sm} rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700`}
          >
            Open Zerodha
            <svg
              className={`${RESPONSIVE_PATTERNS.icon.sm} ml-2`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
