import React from 'react';
import type { InvestmentType } from '../types/MutualFundCalculator.types';

interface InvestmentInputFormProps {
  investmentType: InvestmentType;
  setInvestmentType: (type: InvestmentType) => void;
  sipAmount: string;
  setSipAmount: (amount: string) => void;
  lumpsumAmount: string;
  setLumpsumAmount: (amount: string) => void;
  annualReturn: string;
  setAnnualReturn: (rate: string) => void;
  investmentPeriod: string;
  setInvestmentPeriod: (period: string) => void;
  swpAmount: string;
  setSwpAmount: (amount: string) => void;
  swpPeriod: string;
  setSwpPeriod: (period: string) => void;
  handleReset: () => void;
}

export const InvestmentInputForm: React.FC<InvestmentInputFormProps> = ({
  investmentType,
  setInvestmentType,
  sipAmount,
  setSipAmount,
  lumpsumAmount,
  setLumpsumAmount,
  annualReturn,
  setAnnualReturn,
  investmentPeriod,
  setInvestmentPeriod,
  swpAmount,
  setSwpAmount,
  swpPeriod,
  setSwpPeriod,
  handleReset,
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-lg shadow-lg p-4 sm:p-6 border-2 border-purple-200">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
        💰 Investment Details
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-purple-700 mb-2">
          Investment Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="sip"
              checked={investmentType === 'sip'}
              onChange={(e) => setInvestmentType(e.target.value as InvestmentType)}
              className="mr-2"
            />
            <span className="text-sm">SIP (Monthly)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="lumpsum"
              checked={investmentType === 'lumpsum'}
              onChange={(e) => setInvestmentType(e.target.value as InvestmentType)}
              className="mr-2"
            />
            <span className="text-sm">Lumpsum</span>
          </label>
        </div>
      </div>

      {investmentType === 'sip' ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-purple-700 mb-2">
            💵 Monthly SIP Amount (₹)
          </label>
          <input
            type="number"
            value={sipAmount}
            onChange={(e) => setSipAmount(e.target.value)}
            placeholder="e.g., 10000"
            step="1"
            className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-purple-700 mb-2">
            💰 Lumpsum Amount (₹)
          </label>
          <input
            type="number"
            value={lumpsumAmount}
            onChange={(e) => setLumpsumAmount(e.target.value)}
            placeholder="e.g., 100000"
            step="1"
            className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-purple-700 mb-2">
          📈 Expected Annual Return (%)
        </label>
        <input
          type="number"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(e.target.value)}
          placeholder="e.g., 12"
          step="1"
          className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-purple-700 mb-2">
          ⏱️ Investment Period (Years)
        </label>
        <input
          type="number"
          value={investmentPeriod}
          onChange={(e) => setInvestmentPeriod(e.target.value)}
          placeholder="e.g., 10"
          step="1"
          className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
      </div>

      <div className="border-t-2 border-orange-200 pt-4 mt-4 bg-orange-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-lg">
        <h3 className="text-md font-semibold text-orange-700 mb-3">
          💸 Systematic Withdrawal Plan (SWP) - Optional
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-orange-700 mb-2">
            Monthly SWP Amount (₹)
          </label>
          <input
            type="number"
            value={swpAmount}
            onChange={(e) => setSwpAmount(e.target.value)}
            placeholder="e.g., 20000"
            step="1"
            className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-orange-700 mb-2">
            SWP Period (Years)
          </label>
          <input
            type="number"
            value={swpPeriod}
            onChange={(e) => setSwpPeriod(e.target.value)}
            placeholder="e.g., 20"
            step="1"
            className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium shadow-md hover:shadow-lg"
        >
          🔄 Reset All
        </button>
      </div>
    </div>
  );
};
