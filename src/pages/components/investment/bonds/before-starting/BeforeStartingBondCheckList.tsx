import { useState } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
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

  const checkedCount = checklistItems.filter(item => item.checked).length;
  const totalCount = checklistItems.length;

  return (
    <div className="p-6">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Before Starting Bond Checklist</h1>
      <p className="text-gray-600 mb-6">
                Complete this checklist before starting your bond investment journey. Progress: {checkedCount}/{totalCount}
      </p>

      <div className="mb-6">
        <button
          onClick={handleUncheckAll}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mr-2"
        >
                    Uncheck All
        </button>
        <button
          onClick={handleUncheckEducation}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mr-2"
        >
                    Uncheck Education
        </button>
        <button
          onClick={handleUncheckPreparation}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mr-2"
        >
                    Uncheck Preparation
        </button>
        <button
          onClick={handleUncheckMine}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
                    Uncheck Mine
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Education</h2>
          {checklistItems
            .filter(item => item.category === CHECKLIST_CATEGORIES.EDUCATION)
            .map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => handleCheckChange(item.id)}
                  className="mr-2"
                />
                <label htmlFor={item.id} className="text-gray-700">{item.label}</label>
              </div>
            ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Preparation</h2>
          {checklistItems
            .filter(item => item.category === CHECKLIST_CATEGORIES.PREPARATION)
            .map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => handleCheckChange(item.id)}
                  className="mr-2"
                />
                <label htmlFor={item.id} className="text-gray-700">{item.label}</label>
              </div>
            ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Mine</h2>
          {checklistItems
            .filter(item => item.category === CHECKLIST_CATEGORIES.MINE)
            .map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => handleCheckChange(item.id)}
                  className="mr-2"
                />
                <label htmlFor={item.id} className="text-gray-700">{item.label}</label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default BeforeStartingBondCheckList;