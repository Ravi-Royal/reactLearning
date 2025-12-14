import { useState } from 'react';


const BOND_CHECKLIST_CATEGORIES = {
  SAFETY: 'Safety',
  RETURNS: 'Returns',
  LIQUIDITY: 'Liquidity',
  TAX: 'Tax',
} as const;

const BOND_CHECKLIST_ITEMS = [
  { id: 'creditRating', label: 'Investment grade credit rating', checked: false, category: BOND_CHECKLIST_CATEGORIES.SAFETY },
  { id: 'issuer', label: 'Reputable issuer', checked: false, category: BOND_CHECKLIST_CATEGORIES.SAFETY },
  { id: 'maturity', label: 'Suitable maturity period', checked: false, category: BOND_CHECKLIST_CATEGORIES.SAFETY },
  { id: 'coupon', label: 'Attractive coupon rate', checked: false, category: BOND_CHECKLIST_CATEGORIES.RETURNS },
  { id: 'liquidity', label: 'Good liquidity', checked: false, category: BOND_CHECKLIST_CATEGORIES.LIQUIDITY },
  { id: 'tax', label: 'Tax efficiency', checked: false, category: BOND_CHECKLIST_CATEGORIES.TAX },
];


function BondCheckList() {
  const [items, setItems] = useState(BOND_CHECKLIST_ITEMS);

  const handleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const checkedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bond Investment Checklist</h2>
        <p className="text-gray-600 mb-4">Use this checklist to evaluate potential bond investments systematically.</p>

        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">(Safety)</span>
            <span className="text-gray-600">Safety criteria</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">(Returns)</span>
            <span className="text-gray-600">Returns criteria</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">(Liquidity)</span>
            <span className="text-gray-600">Liquidity criteria</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">(Tax)</span>
            <span className="text-gray-600">Tax criteria</span>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg mb-6">
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

      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${item.checked
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => handleCheck(item.id)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheck(item.id)}
                  className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <label
                  className={`text-sm font-medium cursor-pointer ${item.checked ? 'text-green-800' : 'text-gray-700'
                    }`}
                >
                  {item.label} <span className={`text-xs px-2 py-1 rounded-full ${item.category === BOND_CHECKLIST_CATEGORIES.SAFETY
                    ? 'bg-blue-100 text-blue-700'
                    : item.category === BOND_CHECKLIST_CATEGORIES.RETURNS
                    ? 'bg-green-100 text-green-700'
                    : item.category === BOND_CHECKLIST_CATEGORIES.LIQUIDITY
                    ? 'bg-yellow-100 text-yellow-700'
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
        <h3 className="font-semibold text-gray-800 mb-2">Bond Investment Readiness</h3>
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
    </div>
  );
}

export default BondCheckList;
