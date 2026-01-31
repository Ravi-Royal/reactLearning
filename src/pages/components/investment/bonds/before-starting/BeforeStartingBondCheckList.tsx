import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import ProgressBar from '../../../ProgressBar';
import { Button, CategoryBadge, PageHeader, useChecklist } from '../../../common';
import { copyAllChecklistItems, copyChecklistCategory } from '../../helpers/checklistCopy.helper';
import { CopyAllIcon, CopyIcon } from '../../helpers/CopyIcons';
import { 
  CHECKLIST_CATEGORIES, 
  BEFORE_STARTING_BOND_PAGE_HEADER,
  INITIAL_CHECKLIST_ITEMS 
} from './beforeStartingBondChecklist.constants';
import { RESPONSIVE_PATTERNS } from '../../../../../constants/responsive.constants';

function BeforeStartingBondCheckList() {
  const {
    items: checklistItems,
    toggleItem,
    uncheckAll,
    uncheckCategory,
    getCategoryItems,
    getCategoryStats,
    totalChecked,
    totalItems,
  } = useChecklist(INITIAL_CHECKLIST_ITEMS);

  const educationItems = getCategoryItems(CHECKLIST_CATEGORIES.EDUCATION);
  const preparationItems = getCategoryItems(CHECKLIST_CATEGORIES.PREPARATION);
  const mineItems = getCategoryItems(CHECKLIST_CATEGORIES.MINE);

  const educationStats = getCategoryStats(CHECKLIST_CATEGORIES.EDUCATION);
  const preparationStats = getCategoryStats(CHECKLIST_CATEGORIES.PREPARATION);
  const mineStats = getCategoryStats(CHECKLIST_CATEGORIES.MINE);

  const handleCopyChecklist = (category: string) => {
    copyChecklistCategory('Before Starting Bond Checklist', category, checklistItems);
  };

  const handleCopyAll = () => {
    copyAllChecklistItems(
      'Before Starting Bond Checklist',
      [
        { name: 'Mine', items: mineItems, checkedCount: mineStats.checked },
        { name: 'Education', items: educationItems, checkedCount: educationStats.checked },
        { name: 'Preparation', items: preparationItems, checkedCount: preparationStats.checked },
      ],
      totalChecked,
      totalItems,
    );
  };

  return (
    <div className={RESPONSIVE_PATTERNS.padding.page}>
      <Breadcrumbs />

      <PageHeader
        title={BEFORE_STARTING_BOND_PAGE_HEADER.TITLE}
        subtitle={BEFORE_STARTING_BOND_PAGE_HEADER.SUBTITLE}
        actions={
          <Button onClick={handleCopyAll} variant="secondary" icon={<CopyAllIcon />}>
            Copy All
          </Button>
        }
      />

      <div className={`flex flex-wrap ${RESPONSIVE_PATTERNS.gap.sm} ${RESPONSIVE_PATTERNS.margin.element} text-xs`}>
        <div className={`flex items-center ${RESPONSIVE_PATTERNS.gap.xs}`}>
          <CategoryBadge category={CHECKLIST_CATEGORIES.EDUCATION} variant="compact" />
          <span className="text-gray-600 text-[10px] sm:text-xs">Education criteria</span>
        </div>
        <div className={`flex items-center ${RESPONSIVE_PATTERNS.gap.xs}`}>
          <CategoryBadge category={CHECKLIST_CATEGORIES.PREPARATION} variant="compact" />
          <span className="text-gray-600 text-[10px] sm:text-xs">Preparation criteria</span>
        </div>
        <div className={`flex items-center ${RESPONSIVE_PATTERNS.gap.xs}`}>
          <CategoryBadge category={CHECKLIST_CATEGORIES.MINE} variant="compact" />
          <span className="text-gray-600 text-[10px] sm:text-xs">Mine criteria</span>
        </div>
      </div>

      <div className={`${RESPONSIVE_PATTERNS.padding.card} bg-blue-50 rounded-lg ${RESPONSIVE_PATTERNS.margin.section}`}>
        <div className="space-y-3">
          <ProgressBar label="Education" completed={educationStats.checked} total={educationStats.total} colorClass="bg-orange-600" />
          <ProgressBar label="Preparation" completed={preparationStats.checked} total={preparationStats.total} colorClass="bg-purple-600" />
          <ProgressBar label="Mine" completed={mineStats.checked} total={mineStats.total} colorClass="bg-pink-600" />
        </div>
      </div>

      <div className={`${RESPONSIVE_PATTERNS.margin.section} flex flex-wrap ${RESPONSIVE_PATTERNS.gap.sm}`}>
        <Button onClick={uncheckAll} variant="danger">
          Uncheck All
        </Button>
        <Button onClick={() => uncheckCategory(CHECKLIST_CATEGORIES.EDUCATION)} variant="warning">
          Uncheck Education
        </Button>
        <Button onClick={() => uncheckCategory(CHECKLIST_CATEGORIES.PREPARATION)} variant="primary">
          Uncheck Preparation
        </Button>
        <Button onClick={() => uncheckCategory(CHECKLIST_CATEGORIES.MINE)} variant="primary">
          Uncheck Mine
        </Button>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${RESPONSIVE_PATTERNS.gap.lg}`}>
        {/* Left Section: Mine */}
        <div className={`bg-white ${RESPONSIVE_PATTERNS.padding.card} rounded-lg shadow-sm border border-gray-200`}>
          <div className={`flex items-center justify-between ${RESPONSIVE_PATTERNS.margin.element}`}>
            <h2 className={RESPONSIVE_PATTERNS.text.heading}>Mine</h2>
            <Button
              onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.MINE)}
              variant="secondary"
              size="sm"
              icon={<CopyIcon />}
            >
              Copy
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {mineItems.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  item.checked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <label
                    className={`text-sm font-medium cursor-pointer flex-1 ${
                      item.checked ? 'text-green-800' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </label>
                  {item.checked && (
                    <svg className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Education & Preparation */}
        <div className={`bg-white ${RESPONSIVE_PATTERNS.padding.card} rounded-lg shadow-sm border border-gray-200`}>
          <div className="max-h-80 overflow-y-auto space-y-6">
            <div>
              <div className={`flex items-center justify-between ${RESPONSIVE_PATTERNS.margin.element}`}>
                <h2 className={RESPONSIVE_PATTERNS.text.heading}>Education</h2>
                <Button
                  onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.EDUCATION)}
                  variant="secondary"
                  size="sm"
                  icon={<CopyIcon />}
                >
                  Copy
                </Button>
              </div>
              <div className="space-y-3">
                {educationItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      item.checked
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                      <label
                        className={`text-sm font-medium cursor-pointer flex-1 ${
                          item.checked ? 'text-green-800' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </label>
                      {item.checked && (
                        <svg className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={`flex items-center justify-between ${RESPONSIVE_PATTERNS.margin.element}`}>
                <h2 className={RESPONSIVE_PATTERNS.text.heading}>Preparation</h2>
                <Button
                  onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.PREPARATION)}
                  variant="secondary"
                  size="sm"
                  icon={<CopyIcon />}
                >
                  Copy
                </Button>
              </div>
              <div className="space-y-3">
                {preparationItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      item.checked
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                      <label
                        className={`text-sm font-medium cursor-pointer flex-1 ${
                          item.checked ? 'text-green-800' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </label>
                      {item.checked && (
                        <svg className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeforeStartingBondCheckList;