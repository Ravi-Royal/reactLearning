import { useState } from 'react';
import { CHECKLIST_CATEGORIES } from './StockCheckList.constants';

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
        </div>
    );
}

export default StockCheckList;