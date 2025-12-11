import { useState } from 'react';
import type { MyStockItem } from './StockCheckList.constants';
import { CHECKLIST_CATEGORIES, MY_STOCK_LIST } from './StockCheckList.constants';

function StockCheckList() {
    const [checklistItems, setChecklistItems] = useState([
        { id: 'debt', label: 'Low debt-to-equity ratio (<1.0)', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
        { id: 'yearOveryearDebt', label: 'Decreasing debt over the past 3 years', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
        { id: 'yearOnyearSales', label: 'Increasing year-on-year sales', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
        { id: 'netProfit', label: 'Positive net profit in last 5 years', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
        { id: 'netproitYearOnyear', label: 'Increasing net profit year-on-year', checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
        { id: 'revenue', label: 'Consistent revenue growth (>10% YoY)', checked: false, category: CHECKLIST_CATEGORIES.AI },
        { id: 'profit', label: 'Strong profit margins (>15%)', checked: false, category: CHECKLIST_CATEGORIES.AI },
        { id: 'pe', label: 'Reasonable P/E ratio (<25)', checked: false, category: CHECKLIST_CATEGORIES.AI },
        { id: 'dividend', label: 'Consistent dividend payments', checked: false, category: CHECKLIST_CATEGORIES.AI },
        { id: 'competition', label: 'Strong competitive advantage', checked: false, category: CHECKLIST_CATEGORIES.AI },
        { id: 'management', label: 'Experienced management team', checked: false, category: CHECKLIST_CATEGORIES.AI },
        { id: 'growth', label: 'Clear growth strategy', checked: false, category: CHECKLIST_CATEGORIES.AI }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<MyStockItem | null>(null);

    const handleCheckChange = (id: string) => {
        setChecklistItems(items =>
            items.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleUncheckAll = () => {
        setChecklistItems(items =>
            items.map(item => ({ ...item, checked: false }))
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

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Stock Investment Checklist</h1>
                <p className="text-gray-600 mb-4">Use this checklist to evaluate potential stock investments systematically.</p>

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
                    {selectedStock && (
                        <div className="mb-4 p-4 bg-green-100 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <span className="text-sm font-medium text-green-800">Evaluating: {selectedStock.name}</span>
                                    {selectedStock.symbol && (
                                        <div className="text-xs text-green-600 mt-1">
                                            Symbol: {selectedStock.symbol}
                                        </div>
                                    )}
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${selectedStock.catagery === 'Good Stock' ? 'bg-green-600 text-white' :
                                    selectedStock.catagery === 'Check Stock' ? 'bg-yellow-600 text-white' :
                                        'bg-red-600 text-white'
                                    }`}>
                                    {selectedStock.catagery}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Progress:</span>
                        <span className="text-sm font-bold text-blue-600">{checkedCount}/{totalCount} criteria met</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(checkedCount / totalCount) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleOpenModal}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Select Stock
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
                    <span className="text-sm text-gray-500">
                        {checkedCount > 0 ? `${checkedCount} item${checkedCount > 1 ? 's' : ''} selected` : 'No items selected'}
                    </span>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid gap-4">
                    {checklistItems.map((item) => (
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
                                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                />
                                <label
                                    className={`text-sm font-medium cursor-pointer ${item.checked ? 'text-green-800' : 'text-gray-700'
                                        }`}
                                >
                                    {item.label} <span className={`text-xs px-2 py-1 rounded-full ${item.category === CHECKLIST_CATEGORIES.AI
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        ({item.category})
                                    </span>
                                </label>
                                {item.checked && (
                                    <svg className="w-5 h-5 text-green-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Investment Readiness</h3>
                <div className="text-sm text-gray-600">
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
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Select Stock</h2>
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
                                {MY_STOCK_LIST.map((stock: MyStockItem, index: number) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSelectStock(stock)}
                                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-gray-800">{stock.name}</span>
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${stock.catagery === 'Good Stock' ? 'bg-green-100 text-green-700' :
                                                stock.catagery === 'Check Stock' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {stock.catagery}
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

export default StockCheckList;