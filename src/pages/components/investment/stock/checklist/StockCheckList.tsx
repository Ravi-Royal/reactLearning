import { useState } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import { copyAllChecklistItems, copyChecklistCategory } from '../../helpers/checklistCopy.helper';
import { CopyAllIcon, CopyIcon } from '../../helpers/CopyIcons';
import { CHECKLIST_CATEGORIES, MY_STOCK_LIST, type MyStockItem } from './stockChecklist.constants';

function StockCheckList() {
  const [checklistItems, setChecklistItems] = useState([
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
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<MyStockItem | null>(null);

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

  const handleSelectStock = (stock: MyStockItem) => {
    setSelectedStock(stock);
    setIsModalOpen(false);
  };

  const checkedCount = checklistItems.filter(item => item.checked).length;
  const totalCount = checklistItems.length;

  const aiItems = checklistItems.filter(item => item.category === CHECKLIST_CATEGORIES.AI);
  const personalItems = checklistItems.filter(item => item.category === CHECKLIST_CATEGORIES.PERSONAL);

  const aiCheckedCount = aiItems.filter(item => item.checked).length;
  const personalCheckedCount = personalItems.filter(item => item.checked).length;

  const handleCopyChecklist = (category: string) => {
    copyChecklistCategory('Stock Investment Checklist', category, checklistItems);
  };

  const handleCopyAll = () => {
    copyAllChecklistItems(
      'Stock Investment Checklist',
      [
        { name: 'Personal Criteria', items: personalItems, checkedCount: personalCheckedCount },
        { name: 'AI Criteria', items: aiItems, checkedCount: aiCheckedCount },
      ],
      checkedCount,
      totalCount,
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Stock Investment Checklist</h1>
          <button
            onClick={handleCopyAll}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
            title="Copy all checklist items"
          >
            <CopyAllIcon />
            Copy All
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4">Use this checklist to evaluate potential stock investments systematically.</p>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] sm:text-xs">({CHECKLIST_CATEGORIES.AI})</span>
            <span className="text-gray-600 text-[10px] sm:text-xs">AI-recommended criteria</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] sm:text-xs">({CHECKLIST_CATEGORIES.PERSONAL})</span>
            <span className="text-gray-600 text-[10px] sm:text-xs">Personal investment criteria</span>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          {selectedStock && (
            <div className="mb-4 p-3 sm:p-4 bg-green-100 rounded-lg border border-green-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <div>
                  <span className="text-sm font-medium text-green-800">Evaluating: {selectedStock.name}</span>
                  {selectedStock.symbol && (
                    <div className="text-xs text-green-600 mt-1">
                      Symbol: {selectedStock.symbol}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium self-start sm:self-auto ${selectedStock.category === 'Good Stock' ? 'bg-green-600 text-white' :
                  selectedStock.category === 'Check Stock' ? 'bg-yellow-600 text-white' :
                    'bg-red-600 text-white'
                }`}>
                  {selectedStock.category}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-blue-800">AI Criteria:</span>
                <span className="text-xs sm:text-sm font-bold text-blue-600">{aiCheckedCount}/{aiItems.length} met</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${aiItems.length > 0 ? (aiCheckedCount / aiItems.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-purple-800">Personal Criteria:</span>
                <span className="text-xs sm:text-sm font-bold text-purple-600">{personalCheckedCount}/{personalItems.length} met</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${personalItems.length > 0 ? (personalCheckedCount / personalItems.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenModal}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 sm:gap-2"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden sm:inline">Select Stock</span>
            <span className="sm:hidden">Select</span>
          </button>
          <button
            onClick={handleUncheckAll}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 sm:gap-2"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Uncheck All</span>
            <span className="sm:hidden">Clear</span>
          </button>
          <button
            onClick={handleUncheckAI}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 sm:gap-2"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden sm:inline">Uncheck AI</span>
            <span className="sm:hidden">AI</span>
          </button>
          <button
            onClick={handleUncheckPersonal}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 sm:gap-2"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Uncheck Personal</span>
            <span className="sm:hidden">Personal</span>
          </button>
        </div>
        <span className="text-xs sm:text-sm text-gray-500">
          {checkedCount > 0 ? `${checkedCount} item${checkedCount > 1 ? 's' : ''} selected` : 'No items selected'}
        </span>
      </div>

      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Personal Criteria Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <h3 className="text-base sm:text-lg font-semibold text-purple-800">
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
            <div className="max-h-80 overflow-y-auto space-y-2 sm:space-y-3">
              {personalItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${item.checked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCheckChange(item.id)}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckChange(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 flex-shrink-0"
                    />
                    <label
                      className={`text-xs sm:text-sm font-medium cursor-pointer flex-1 ${item.checked ? 'text-green-800' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </label>
                    {item.checked && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h3 className="text-base sm:text-lg font-semibold text-blue-800">
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
            <div className="max-h-80 overflow-y-auto space-y-2 sm:space-y-3">
              {aiItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${item.checked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCheckChange(item.id)}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckChange(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 flex-shrink-0"
                    />
                    <label
                      className={`text-xs sm:text-sm font-medium cursor-pointer flex-1 ${item.checked ? 'text-green-800' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </label>
                    {item.checked && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Investment Readiness</h3>
        <div className="text-xs sm:text-sm text-gray-600">
          {checkedCount === totalCount && (
            <p className="text-green-600 font-medium">🎉 Excellent! This stock meets all key criteria for investment consideration.</p>
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

      {/* Stock Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Select Stock</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 group"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-8">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {MY_STOCK_LIST.map((stock: MyStockItem, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleSelectStock(stock)}
                    className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{stock.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium self-start ${stock.category === 'Good Stock' ? 'bg-green-100 text-green-700' :
                        stock.category === 'Check Stock' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                        {stock.category}
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 sm:px-8 py-3 sm:py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
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

export default StockCheckList;