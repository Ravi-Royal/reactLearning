import { Link } from 'react-router-dom';
import Breadcrumbs from '../../../navigation/Breadcrumbs';
import { RESPONSIVE_PATTERNS } from '../../../../constants/responsive.constants';

function Bonds() {
  return (
    <div className={RESPONSIVE_PATTERNS.padding.page}>
      <Breadcrumbs />
      <div className="max-w-7xl mx-auto">
        <h1 className={`${RESPONSIVE_PATTERNS.text['3xl']} font-bold text-gray-800`}>Bonds</h1>
        <p className={`${RESPONSIVE_PATTERNS.text.base} text-gray-600 mt-2`}>
          Learn about bonds and fixed income investments.
        </p>
        <div className={RESPONSIVE_PATTERNS.margin.section}>
          <p className={`${RESPONSIVE_PATTERNS.text.base} text-gray-700 mb-4`}>
            This is a placeholder for bonds information.
          </p>
          <div className={`flex flex-col sm:flex-row ${RESPONSIVE_PATTERNS.gap.md}`}>
            <Link
              to="/investment/bonds/before-starting"
              className={`inline-flex items-center justify-center ${RESPONSIVE_PATTERNS.button.md} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors`}
            >
              Before Starting Bond Checklist
              <svg
                className={`${RESPONSIVE_PATTERNS.icon.sm} ml-2`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/investment/bonds/checklist"
              className={`inline-flex items-center justify-center ${RESPONSIVE_PATTERNS.button.md} bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors`}
            >
              Bond Checklist
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
    </div>
  );
}

export default Bonds;
