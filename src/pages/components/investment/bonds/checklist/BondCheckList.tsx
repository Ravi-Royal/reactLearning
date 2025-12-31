import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import ProgressBar from '../../../ProgressBar';
import { copyAllChecklistItems, copyChecklistCategory } from '../../helpers/checklistCopy.helper';
import { CopyAllIcon, CopyIcon } from '../../helpers/CopyIcons';
import { Button, CategoryBadge, PageHeader, SelectionModal } from '../../../common';
import { useChecklist } from '../../../common/hooks/useChecklist';
import { RESPONSIVE_PATTERNS } from '../../../../../constants/responsive.constants';
import { CHECKLIST_CATEGORIES, MY_BOND_LIST, type MyBondItem } from './bondChecklist.constants';
import { useState } from 'react';

const INITIAL_CHECKLIST_ITEMS = [
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
];

function BondCheckList() {
  const {
    toggleItem,
    uncheckAll,
    uncheckCategory,
    getCategoryItems,
    getCategoryStats,
    totalChecked,
    totalItems,
  } = useChecklist(INITIAL_CHECKLIST_ITEMS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState<MyBondItem | null>(null);

  const aiItems = getCategoryItems(CHECKLIST_CATEGORIES.AI);
  const personalItems = getCategoryItems(CHECKLIST_CATEGORIES.PERSONAL);

  const aiStats = getCategoryStats(CHECKLIST_CATEGORIES.AI);
  const personalStats = getCategoryStats(CHECKLIST_CATEGORIES.PERSONAL);

  const handleCopyChecklist = (category: string) => {
    const items = getCategoryItems(category);
    const stats = getCategoryStats(category);
    copyChecklistCategory(items, category, stats.checked, stats.total);
  };

  const handleCopyAll = () => {
    copyAllChecklistItems(
      'Bond Investment Checklist',
      [
        { name: 'Personal Criteria', items: personalItems, checkedCount: personalStats.checked },
        { name: 'AI Criteria', items: aiItems, checkedCount: aiStats.checked },
      ],
      totalChecked,
      totalItems,
    );
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSelectBond = (bond: MyBondItem) => {
    setSelectedBond(bond);
    setIsModalOpen(false);
  };

  return (
    <div className={RESPONSIVE_PATTERNS.padding.page}>
      <Breadcrumbs />

      <PageHeader
        title="Bond Investment Checklist"
        subtitle="Use this checklist to evaluate potential bond investments systematically."
        actions={
          <Button onClick={handleCopyAll} variant="secondary" icon={<CopyAllIcon />}>
            Copy All
          </Button>
        }
      />

      <div className={`flex flex-wrap ${RESPONSIVE_PATTERNS.gap.sm} ${RESPONSIVE_PATTERNS.margin.element} text-xs`}>
        <div className={`flex items-center ${RESPONSIVE_PATTERNS.gap.xs}`}>
          <CategoryBadge category={CHECKLIST_CATEGORIES.AI} variant="compact" />
          <span className="text-gray-600 text-[10px] sm:text-xs">AI-recommended criteria</span>
        </div>
        <div className={`flex items-center ${RESPONSIVE_PATTERNS.gap.xs}`}>
          <CategoryBadge category={CHECKLIST_CATEGORIES.PERSONAL} variant="compact" />
          <span className="text-gray-600 text-[10px] sm:text-xs">Personal investment criteria</span>
        </div>
      </div>

      <div className={`${RESPONSIVE_PATTERNS.padding.card} bg-blue-50 rounded-lg ${RESPONSIVE_PATTERNS.margin.section}`}>
        {selectedBond && (
          <div className={`${RESPONSIVE_PATTERNS.margin.element} p-3 sm:p-4 bg-green-100 rounded-lg border border-green-200`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <div>
                <span className="text-sm font-medium text-green-800">Evaluating: {selectedBond.name}</span>
                {selectedBond.symbol && (
                  <div className="text-xs text-green-600 mt-1">
                    Symbol: {selectedBond.symbol}
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium self-start sm:self-auto ${
                selectedBond.category === 'Good Bond' ? 'bg-green-600 text-white' :
                  selectedBond.category === 'Check Bond' ? 'bg-yellow-600 text-white' :
                    'bg-red-600 text-white'
              }`}>
                {selectedBond.category}
              </span>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <ProgressBar label="AI Criteria" completed={aiStats.checked} total={aiStats.total} colorClass="bg-blue-600" />
          <ProgressBar label="Personal Criteria" completed={personalStats.checked} total={personalStats.total} colorClass="bg-purple-600" />
        </div>
      </div>

      <div className={`${RESPONSIVE_PATTERNS.margin.section} flex flex-wrap ${RESPONSIVE_PATTERNS.gap.sm}`}>
        <Button onClick={handleOpenModal} variant="primary">
          Select Bond
        </Button>
        <Button onClick={uncheckAll} variant="danger">
          Uncheck All
        </Button>
        <Button onClick={() => uncheckCategory(CHECKLIST_CATEGORIES.AI)} variant="info">
          Uncheck AI
        </Button>
        <Button onClick={() => uncheckCategory(CHECKLIST_CATEGORIES.PERSONAL)} variant="primary">
          Uncheck Personal
        </Button>
        <span className="text-xs sm:text-sm text-gray-500 flex items-center">
          {totalChecked > 0 ? `${totalChecked} item${totalChecked > 1 ? 's' : ''} selected` : 'No items selected'}
        </span>
      </div>

      <div className={`border border-gray-200 rounded-lg ${RESPONSIVE_PATTERNS.padding.card} bg-gray-50`}>
        <div className={`grid md:grid-cols-2 ${RESPONSIVE_PATTERNS.gap.lg}`}>
          {/* Personal Criteria Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <h3 className="text-lg font-semibold text-purple-800">
                Personal Criteria ({personalStats.checked}/{personalStats.total})
              </h3>
              <Button
                onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.PERSONAL)}
                variant="secondary"
                size="sm"
                icon={<CopyIcon />}
              >
                Copy
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {personalItems.map((item) => (
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

          {/* AI Criteria Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-blue-200 pb-2">
              <h3 className="text-lg font-semibold text-blue-800">
                AI Criteria ({aiStats.checked}/{aiStats.total})
              </h3>
              <Button
                onClick={() => handleCopyChecklist(CHECKLIST_CATEGORIES.AI)}
                variant="secondary"
                size="sm"
                icon={<CopyIcon />}
              >
                Copy
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {aiItems.map((item) => (
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

      <div className={`${RESPONSIVE_PATTERNS.margin.section} ${RESPONSIVE_PATTERNS.padding.card} bg-gray-50 rounded-lg`}>
        <h3 className="font-semibold text-gray-800 mb-2">Investment Readiness</h3>
        <div className="text-sm text-gray-600">
          {totalChecked === totalItems && (
            <p className="text-green-600 font-medium">🎉 Excellent! This bond meets all key criteria for investment consideration.</p>
          )}
          {totalChecked >= totalItems * 0.75 && totalChecked < totalItems && (
            <p className="text-blue-600 font-medium">👍 Good candidate. Meets most criteria - conduct further due diligence.</p>
          )}
          {totalChecked >= totalItems * 0.5 && totalChecked < totalItems * 0.75 && (
            <p className="text-yellow-600 font-medium">⚠️ Moderate risk. Some concerns - additional research recommended.</p>
          )}
          {totalChecked < totalItems * 0.5 && (
            <p className="text-red-600 font-medium">❌ High risk. Significant concerns - reconsider investment.</p>
          )}
        </div>
      </div>

      {/* Bond Selection Modal */}
      <SelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectBond}
        items={MY_BOND_LIST}
        title="Select Bond"
      />
    </div>
  );
}

export default BondCheckList;