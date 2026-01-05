import { useState } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import ProgressBar from '../../../ProgressBar';
import { Button, CategoryBadge, PageHeader, SelectionModal } from '../../../common';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { copyAllChecklistItems, copyChecklistCategory } from '../../helpers/checklistCopy.helper';
import { CopyAllIcon, CopyIcon } from '../../helpers/CopyIcons';
import { useChecklist } from '../../../common/hooks/useChecklist';
import { RESPONSIVE_PATTERNS } from '../../../../../constants/responsive.constants';
import { CHECKLIST_CATEGORIES, MUTUAL_FUND_LIST, type MutualFundItem } from './mutualFundChecklist.constants';

const CHECKLIST_INFO = {
  sharpeRatiomine: {
    title: 'Sharpe Ratio',
    info: 'Measures risk-adjusted return. >2 is excellent, 1-2 is good, <1 is poor.',
  },
  alpha: {
    title: 'Alpha',
    info: 'Measures excess return over benchmark. Positive alpha (>0) is good, negative is bad.',
  },
  beta: {
    title: 'Beta',
    info: 'Measures volatility vs market. <1 is less volatile (good for conservative), >1 is more volatile.',
  },
  expenseRatio: {
    title: 'Expense Ratio',
    info: 'Annual fund management cost. <1% for equity, <0.5% for index funds is good. Lower is better.',
  },
  aum: {
    title: 'AUM',
    info: 'Assets Under Management. >₹1000 crores is considered stable.',
  },
  fundHouse: {
    title: 'Fund House',
    info: 'Reputed, established fund houses are preferred for stability and governance.',
  },
  returns5y: {
    title: '5Y Returns',
    info: 'Consistent returns over 5 years show good performance. Compare with peers/benchmark.',
  },
  manager: {
    title: 'Fund Manager',
    info: 'Experienced manager (>5 years) is a positive sign.',
  },
  category: {
    title: 'Fund Category',
    info: 'Should match your investment goal (e.g., equity for growth, debt for safety).',
  },
  risk: {
    title: 'Risk Level',
    info: 'Should match your risk profile. High risk for aggressive, low for conservative.',
  },
  exitLoad: {
    title: 'Exit Load',
    info: 'Fee for early withdrawal. Lower or zero exit load is better.',
  },
  rating: {
    title: 'Fund Rating',
    info: '4-star or 5-star by CRISIL/Morningstar is good. Lower ratings indicate higher risk.',
  },
  consistency: {
    title: 'Consistency',
    info: 'Fund should beat its benchmark regularly, not just in one year.',
  },
  portfolio: {
    title: 'Portfolio Diversification',
    info: 'More than 30 stocks is well-diversified. Less is riskier.',
  },
  volatility: {
    title: 'Volatility',
    info: 'Lower volatility than peers is preferred for stability.',
  },
  sharpeRatio: {
    title: 'Sharpe Ratio',
    info: 'Risk-adjusted return. >1.5 is good, <1 is poor.',
  },
  downside: {
    title: 'Downside Capture',
    info: 'Lower downside capture ratio means less loss in market falls. <100% is good.',
  },
};

const INITIAL_CHECKLIST_ITEMS = [
  { id: 'sharpeRatiomine', label: 'Good Sharpe ratio (>2)', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'alpha', label: 'Positive alpha', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'beta', label: 'Low beta (<1)', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'expenseRatio', label: 'Low expense ratio (<1% for equity, <0.5% for index)', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'aum', label: 'Adequate AUM (>₹1000 crores)', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'fundHouse', label: 'Reputed and established fund house', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'returns5y', label: 'Consistent returns over 5 years', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'manager', label: 'Experienced fund manager (>5 years)', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'category', label: 'Fund category matches investment goal', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'risk', label: 'Risk level suitable for my profile', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'exitLoad', label: 'Reasonable exit load structure', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'rating', label: '4-star or 5-star rating by CRISIL/Morningstar', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'consistency', label: 'Beats benchmark consistently', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'portfolio', label: 'Well-diversified portfolio (>30 stocks)', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'volatility', label: 'Lower volatility than peers', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'sharpeRatio', label: 'Good Sharpe ratio (>1.5)', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'downside', label: 'Limited downside capture ratio', checked: false, category: CHECKLIST_CATEGORIES.AI },
];

function MutualFundChecklist() {
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
  const [selectedFund, setSelectedFund] = useState<MutualFundItem | null>(null);

  const aiItems = getCategoryItems(CHECKLIST_CATEGORIES.AI);
  const personalItems = getCategoryItems(CHECKLIST_CATEGORIES.PERSONAL);

  const aiStats = getCategoryStats(CHECKLIST_CATEGORIES.AI);
  const personalStats = getCategoryStats(CHECKLIST_CATEGORIES.PERSONAL);

  // Copy handlers
  const handleCopyChecklist = (category: string) => {
    copyChecklistCategory('Mutual Fund Investment Checklist', category, [...personalItems, ...aiItems]);
  };

  const handleCopyAll = () => {
    copyAllChecklistItems(
      'Mutual Fund Investment Checklist',
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
  const handleSelectFund = (fund: MutualFundItem) => {
    setSelectedFund(fund);
    setIsModalOpen(false);
  };

  return (
    <div className={RESPONSIVE_PATTERNS.padding.page}>
      <Breadcrumbs />

      <PageHeader
        title="Mutual Fund Investment Checklist"
        subtitle="Use this checklist to evaluate potential mutual fund investments systematically."
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
        {selectedFund && (
          <div className={`${RESPONSIVE_PATTERNS.margin.element} p-3 sm:p-4 bg-green-100 rounded-lg border border-green-200`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <div>
                <span className="text-sm font-medium text-green-800">Evaluating: {selectedFund.name}</span>
                {selectedFund.code && (
                  <div className="text-xs text-green-600 mt-1">
                    Code: {selectedFund.code}
                  </div>
                )}
                {selectedFund.fundHouse && (
                  <div className="text-xs text-green-600 mt-1">
                    Fund House: {selectedFund.fundHouse}
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium self-start sm:self-auto ${
                selectedFund.category === 'Index Fund' ? 'bg-blue-600 text-white' :
                  selectedFund.category === 'Equity Fund' ? 'bg-green-600 text-white' :
                    selectedFund.category === 'Hybrid Fund' ? 'bg-purple-600 text-white' :
                      'bg-orange-600 text-white'
              }`}>
                {selectedFund.category}
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
          Select Fund
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
                      className={`text-sm font-medium cursor-pointer flex-1 ${item.checked ? 'text-green-800' : 'text-gray-700'}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {item.label}
                      <span title={CHECKLIST_INFO[item.id as keyof typeof CHECKLIST_INFO]?.info || ''} style={{ marginLeft: 4, cursor: 'pointer' }}>
                        <AiOutlineInfoCircle style={{ display: 'inline', color: '#6366f1' }} />
                      </span>
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
            <p className="text-green-600 font-medium">🎉 Excellent! This fund meets all key criteria for investment consideration.</p>
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

      {/* Fund Selection Modal */}
      <SelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectFund}
        items={MUTUAL_FUND_LIST}
        title="Select Mutual Fund"
      />
    </div>
  );
}

export default MutualFundChecklist;
