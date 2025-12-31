import { useState } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import ProgressBar from '../../../ProgressBar';
import { copyAllChecklistItems, copyChecklistCategory } from '../../helpers/checklistCopy.helper';
import { CopyAllIcon, CopyIcon } from '../../helpers/CopyIcons';
import { Button, CategoryBadge, PageHeader, SelectionModal } from '../../../common';
import { useChecklist } from '../../../common/hooks/useChecklist';
import { RESPONSIVE_PATTERNS } from '../../../../../constants/responsive.constants';
import { CHECKLIST_CATEGORIES, MY_STOCK_LIST, type MyStockItem } from './stockChecklist.constants';

const INITIAL_CHECKLIST_ITEMS = [
  { id: 'debt', label: 'Low debt-to-equity ratio (<1.0)', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'yearOveryearDebt', label: 'Decreasing debt over the past 3 years', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'yearOnyearSales', label: 'Increasing year-on-year sales', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'netProfit', label: 'Positive net profit in last 5 years', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'ROE', label: 'Return on Equity (ROE) > 20%', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'netproitYearOnyear', label: 'Increasing net profit year-on-year', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'revenue', label: 'Consistent revenue growth (>10% YoY)', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'pedata', label: 'Less PE (<10)', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'PBratio', label: 'Less price to book', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'PEAdPBratio', label: 'Lower PE and lower Price to Book is for sure better stock', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'profit', label: 'Strong profit margins (>15%)', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'pe', label: 'Reasonable P/E ratio (<25)', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'dividend', label: 'Consistent dividend payments', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'competition', label: 'Strong competitive advantage', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'management', label: 'Experienced management team', checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'growth', label: 'Clear growth strategy', checked: false, category: CHECKLIST_CATEGORIES.AI },
];

function StockCheckList() {
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
  const [selectedStock, setSelectedStock] = useState<MyStockItem | null>(null);

  const aiItems = getCategoryItems(CHECKLIST_CATEGORIES.AI);
  const personalItems = getCategoryItems(CHECKLIST_CATEGORIES.PERSONAL);

  const aiStats = getCategoryStats(CHECKLIST_CATEGORIES.AI);
  const personalStats = getCategoryStats(CHECKLIST_CATEGORIES.PERSONAL);

  const handleCopyChecklist = (category: string) => {
    copyChecklistCategory('Stock Investment Checklist', category, checklistItems);
  };

  const handleCopyAll = () => {
    copyAllChecklistItems(
      'Stock Investment Checklist',
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
  const handleSelectStock = (stock: MyStockItem) => {
    setSelectedStock(stock);
    setIsModalOpen(false);
  };

  return (
    <div className={RESPONSIVE_PATTERNS.padding.page}>
      <Breadcrumbs />

      <PageHeader
        title="Stock Investment Checklist"
        subtitle="Use this checklist to evaluate potential stock investments systematically."
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
        {selectedStock && (
          <div className={`${RESPONSIVE_PATTERNS.margin.element} p-3 sm:p-4 bg-green-100 rounded-lg border border-green-200`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <div>
                <span className="text-sm font-medium text-green-800">Evaluating: {selectedStock.name}</span>
                {selectedStock.symbol && (
                  <div className="text-xs text-green-600 mt-1">
                    Symbol: {selectedStock.symbol}
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium self-start sm:self-auto ${
                selectedStock.category === 'Good Stock' ? 'bg-green-600 text-white' :
                  selectedStock.category === 'Check Stock' ? 'bg-yellow-600 text-white' :
                    'bg-red-600 text-white'
              }`}>
                {selectedStock.category}
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
          Select Stock
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
            <p className="text-green-600 font-medium">🎉 Excellent! This stock meets all key criteria for investment consideration.</p>
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

      {/* Stock Selection Modal */}
      <SelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectStock}
        items={MY_STOCK_LIST}
        title="Select Stock"
      />
    </div>
  );
}

export default StockCheckList;