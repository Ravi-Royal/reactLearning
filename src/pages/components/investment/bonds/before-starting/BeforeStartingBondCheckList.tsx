import { useState } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import ProgressBar from '../../../ProgressBar';
import { copyAllChecklistItems, copyChecklistCategory } from '../../helpers/checklistCopy.helper';
import { CopyAllIcon, CopyIcon } from '../../helpers/CopyIcons';
import { CHECKLIST_CATEGORIES } from './beforeStartingBondChecklist.constants';

function BeforeStartingBondCheckList() {
  const [checklistItems, setChecklistItems] = useState([
    { id: 'howToComeOut', label: 'How to come out ahead in bond investments', checked: false, category: CHECKLIST_CATEGORIES.MINE },
    { id: 'understandBasics', label: 'Understand bond basics (fixed income, coupons, maturity)', checked: false, category: CHECKLIST_CATEGORIES.EDUCATION },
    { id: 'riskTolerance', label: 'Assess my risk tolerance for bonds', checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
    { id: 'investmentGoals', label: 'Define investment goals and timeline', checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
    { id: 'researchIssuers', label: 'Research reputable bond issuers', checked: false, category: CHECKLIST_CATEGORIES.EDUCATION },
    { id: 'creditRatings', label: 'Learn about credit ratings and their importance', checked: false, category: CHECKLIST_CATEGORIES.EDUCATION },
    { id: 'taxImplications', label: 'Understand tax implications of bond investments', checked: false, category: CHECKLIST_CATEGORIES.EDUCATION },
    { id: 'diversification', label: 'Plan for diversification in bond portfolio', checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
    { id: 'brokerAccount', label: 'Set up or review brokerage account for bonds', checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
    { id: 'marketConditions', label: 'Review current market conditions for bonds', checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
    { id: 'professionalAdvice', label: 'Consider consulting a financial advisor', checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
  ]);

  const handleCheckChange = (id: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleUncheckAll = () => {
    setChecklistItems(items =>
      items.map(item => ({ ...item, checked: false })),
    );
  };

  const handleUncheckEducation = () => {
    setChecklistItems(items =>
      items.map(item =>
        item.category === CHECKLIST_CATEGORIES.EDUCATION
          ? { ...item, checked: false }
          : item,
      ),
    );
  };

  const handleUncheckPreparation = () => {
    setChecklistItems(items =>
      items.map(item =>
        item.category === CHECKLIST_CATEGORIES.PREPARATION
          ? { ...item, checked: false }
          : item,
      ),
    );
  };

  const handleUncheckMine = () => {
    setChecklistItems(items =>
      items.map(item =>
        item.category === CHECKLIST_CATEGORIES.MINE
          ? { ...item, checked: false }
          : item,
      ),
    );
  };

  const educationItems = checklistItems.filter(item => item.category === CHECKLIST_CATEGORIES.EDUCATION);
  const preparationItems = checklistItems.filter(item => item.category === CHECKLIST_CATEGORIES.PREPARATION);
  const mineItems = checklistItems.filter(item => item.category === CHECKLIST_CATEGORIES.MINE);

  const educationCheckedCount = educationItems.filter(item => item.checked).length;
  const preparationCheckedCount = preparationItems.filter(item => item.checked).length;
  const mineCheckedCount = mineItems.filter(item => item.checked).length;

  const handleCopyChecklist = (category: string) => {
    copyChecklistCategory('Before Starting Bond Checklist', category, checklistItems);
  };

  const handleCopyAll = () => {
    const totalChecked = checklistItems.filter(item => item.checked).length;
    copyAllChecklistItems(
      'Before Starting Bond Checklist',
      [
        { name: 'Mine', items: mineItems, checkedCount: mineCheckedCount },
        { name: 'Education', items: educationItems, checkedCount: educationCheckedCount },
        { name: 'Preparation', items: preparationItems, checkedCount: preparationCheckedCount },
      ],
      totalChecked,
      checklistItems.length,
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Before Starting Bond Checklist</h1>
        <button
          onClick={handleCopyAll}
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
          title="Copy all checklist items"
        >
          <CopyAllIcon />
          Copy All
        </button>
      </div>
      <p className="text-gray-600 mb-4">Complete this checklist before starting your bond investment journey.</p>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] sm:text-xs">({CHECKLIST_CATEGORIES.EDUCATION})</span>
          <span className="text-gray-600 text-[10px] sm:text-xs">Education criteria</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] sm:text-xs">({CHECKLIST_CATEGORIES.PREPARATION})</span>
          <span className="text-gray-600 text-[10px] sm:text-xs">Preparation criteria</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-pink-100 text-pink-700 rounded-full text-[10px] sm:text-xs">({CHECKLIST_CATEGORIES.MINE})</span>
          <span className="text-gray-600 text-[10px] sm:text-xs">Mine criteria</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <div className="space-y-3">
          <ProgressBar label="Education" completed={educationCheckedCount} total={educationItems.length} colorClass="bg-orange-600" />
          <ProgressBar label="Preparation" completed={preparationCheckedCount} total={preparationItems.length} colorClass="bg-purple-600" />
          <ProgressBar label="Mine" completed={mineCheckedCount} total={mineItems.length} colorClass="bg-pink-600" />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={handleUncheckAll}
          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
        >
          Uncheck All
        </button>
        <button
          onClick={handleUncheckEducation}
          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm"
        >
          Uncheck Education
        </button>
        <button
          onClick={handleUncheckPreparation}
          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-xs sm:text-sm"
        >
          Uncheck Preparation
        </button>
        <button
          onClick={handleUncheckMine}
          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-xs sm:text-sm"
        >
          Uncheck Mine
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section: Mine */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Mine</h2>
            <button
              onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.MINE)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 rounded transition-colors"
              title="Copy Mine criteria"
            >
              <CopyIcon />
              Copy
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {checklistItems
              .filter(item => item.category === CHECKLIST_CATEGORIES.MINE)
              .map(item => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={item.checked}
                    onChange={() => handleCheckChange(item.id)}
                    className="mr-3"
                  />
                  <label htmlFor={item.id} className="text-gray-700">{item.label}</label>
                </div>
              ))}
          </div>
        </div>

        {/* Right Section: Education & Preparation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="max-h-80 overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Education</h2>
                <button
                  onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.EDUCATION)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
                  title="Copy Education criteria"
                >
                  <CopyIcon />
                  Copy
                </button>
              </div>
              <div className="space-y-3">
                {checklistItems
                  .filter(item => item.category === CHECKLIST_CATEGORIES.EDUCATION)
                  .map(item => (
                    <div key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={item.checked}
                        onChange={() => handleCheckChange(item.id)}
                        className="mr-3"
                      />
                      <label htmlFor={item.id} className="text-gray-700">{item.label}</label>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Preparation</h2>
                <button
                  onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.PREPARATION)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
                  title="Copy Preparation criteria"
                >
                  <CopyIcon />
                  Copy
                </button>
              </div>
              <div className="space-y-3">
                {checklistItems
                  .filter(item => item.category === CHECKLIST_CATEGORIES.PREPARATION)
                  .map(item => (
                    <div key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={item.checked}
                        onChange={() => handleCheckChange(item.id)}
                        className="mr-3"
                      />
                      <label htmlFor={item.id} className="text-gray-700">{item.label}</label>
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