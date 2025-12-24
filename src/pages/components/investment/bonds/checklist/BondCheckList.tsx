import { useState } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import ProgressBar from '../../../ProgressBar';
import { copyAllChecklistItems, CopyAllIcon, copyChecklistCategory, CopyIcon } from '../../helpers/checklistCopy.helper';
import { CHECKLIST_CATEGORIES, MY_BOND_LIST, type MyBondItem } from './bondChecklist.constants';

function BondCheckList() {
  const [checklistItems, setChecklistItems] = useState([
    { id: 'repaymentPriority', label: 'Repayment Priority - senior', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
    { id: 'creditRating', label: 'Investment grade credit rating', checked: false, category: CHECKLIST_CATEGORIES.AI },
    { id: 'issuer', label: 'Reputable issuer', checked: false, category: CHECKLIST_CATEGORIES.AI },
    { id: 'maturity', label: 'Suitable maturity period', checked: false, category: CHECKLIST_CATEGORIES.AI },
    { id: 'coupon', label: 'Attractive coupon rate', checked: false, category: CHECKLIST_CATEGORIES.AI },
    { id: 'liquidity', label: 'Good liquidity', checked: false, category: CHECKLIST_CATEGORIES.AI },
    { id: 'tax', label: 'Tax efficiency', checked: false, category: CHECKLIST_CATEGORIES.AI },
    { id: 'personalRisk', label: 'Matches my risk tolerance', checked: false, category: CHECKLIST_CATEGORIES.AI },
    { id: 'personalDuration', label: 'Fits my investment timeline', checked: false, category: CHECKLIST_CATEGORIES.AI },
    { id: 'personalIncome', label: 'Provides desired income stream', checked: false, category: CHECKLIST_CATEGORIES.AI },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState<MyBondItem | null>(null);

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

  const handleUncheckAI = () => {
    setChecklistItems(items =>
      items.map(item =>
        item.category === CHECKLIST_CATEGORIES.AI
          ? { ...item, checked: false }
          : item,
      ),
    );
  };

  const handleUncheckPersonal = () => {
    setChecklistItems(items =>
      items.map(item =>
        item.category === CHECKLIST_CATEGORIES.PERSONAL
          ? { ...item, checked: false }
          : item,
      ),
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectBond = (bond: MyBondItem) => {
    setSelectedBond(bond);
    setIsModalOpen(false);
  };

  const checkedCount = checklistItems.filter(item => item.checked).length;
  const totalCount = checklistItems.length;

  const aiItems = checklistItems.filter(item => item.category === CHECKLIST_CATEGORIES.AI);
  const personalItems = checklistItems.filter(item => item.category === CHECKLIST_CATEGORIES.PERSONAL);

  const aiCheckedCount = aiItems.filter(item => item.checked).length;
  const personalCheckedCount = personalItems.filter(item => item.checked).length;

  const handleCopyChecklist = (category: string) => {
    copyChecklistCategory('Bond Investment Checklist', category, checklistItems);
  };

  const handleCopyAll = () => {
    copyAllChecklistItems(
      'Bond Investment Checklist',
      [
        { name: 'Personal Criteria', items: personalItems, checkedCount: personalCheckedCount },
        { name: 'AI Criteria', items: aiItems, checkedCount: aiCheckedCount },
      ],
      checkedCount,
      totalCount,
    );
  };

  return (
    <div className="p-6">
      <Breadcrumbs />
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Bond Investment Checklist</h1>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title="Copy all checklist items"
          >
            <CopyAllIcon />
            Copy All
          </button>
        </div>
        <p className="text-gray-600 mb-4">Use this checklist to evaluate potential bond investments systematically.</p>

        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">({CHECKLIST_CATEGORIES.AI})</span>
            <span className="text-gray-600">AI-recommended criteria</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">({CHECKLIST_CATEGORIES.PERSONAL})</span>
            <span className="text-gray-600">Personal investment criteria</span>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          {selectedBond && (
            <div className="mb-4 p-4 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-green-800">Evaluating: {selectedBond.name}</span>
                  {selectedBond.symbol && (
                    <div className="text-xs text-green-600 mt-1">
                      Symbol: {selectedBond.symbol}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${selectedBond.category === 'Good Bond' ? 'bg-green-600 text-white' :
                  selectedBond.category === 'Check Bond' ? 'bg-yellow-600 text-white' :
                    'bg-red-600 text-white'
                }`}>
                  {selectedBond.category}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <ProgressBar label="AI Criteria" completed={aiCheckedCount} total={aiItems.length} colorClass="bg-blue-600" />
            <ProgressBar label="Personal Criteria" completed={personalCheckedCount} total={personalItems.length} colorClass="bg-purple-600" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Select Bond
            </button>
            <button
              onClick={handleUncheckAll}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Uncheck All
            </button>
            <button
              onClick={handleUncheckAI}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Uncheck AI
            </button>
            <button
              onClick={handleUncheckPersonal}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Uncheck Personal
            </button>
            <span className="text-sm text-gray-500">
              {checkedCount > 0 ? `${checkedCount} item${checkedCount > 1 ? 's' : ''} selected` : 'No items selected'}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Criteria Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <h3 className="text-lg font-semibold text-purple-800">
                Personal Criteria ({personalCheckedCount}/{personalItems.length})
              </h3>
              <button
                onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.PERSONAL)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
                title="Copy Personal criteria"
              >
                <CopyIcon />
                Copy
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {personalItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${item.checked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCheckChange(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckChange(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      className={`text-sm font-medium cursor-pointer flex-1 ${item.checked ? 'text-green-800' : 'text-gray-700'
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

          {/* AI Criteria Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-blue-200 pb-2">
              <h3 className="text-lg font-semibold text-blue-800">
                AI Criteria ({aiCheckedCount}/{aiItems.length})
              </h3>
              <button
                onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.AI)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                title="Copy AI criteria"
              >
                <CopyIcon />
                Copy
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {aiItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${item.checked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCheckChange(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckChange(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      className={`text-sm font-medium cursor-pointer flex-1 ${item.checked ? 'text-green-800' : 'text-gray-700'
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

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Investment Readiness</h3>
        <div className="text-sm text-gray-600">
          {checkedCount === totalCount && (
            <p className="text-green-600 font-medium">🎉 Excellent! This bond meets all key criteria for investment consideration.</p>
          )}
          {checkedCount >= totalCount * 0.75 && checkedCount < totalCount && (
            <p className="text-blue-600 font-medium">👍 Good candidate. Meets most criteria - conduct further due diligence.</p>
          )}
          {checkedCount >= totalCount * 0.5 && checkedCount < totalCount * 0.75 && (
            <p className="text-yellow-600 font-medium">⚠️ Moderate risk. Some concerns - additional research recommended.</p>
          )}
          {checkedCount < totalCount * 0.5 && (
            <p className="text-red-600 font-medium">❌ High risk. Significant concerns - reconsider investment.</p>
          )}
        </div>
      </div>

      {/* Bond Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Select Bond</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 group"
                >
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {MY_BOND_LIST.map((bond: MyBondItem, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleSelectBond(bond)}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">{bond.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${bond.category === 'Good Bond' ? 'bg-green-100 text-green-700' :
                        bond.category === 'Check Bond' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                        {bond.category}
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BondCheckList;