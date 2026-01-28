import React, { useState } from 'react';
import { Money, safeParseNumber } from '../../../../../utils/financial';

interface ProfitSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricePerStock: number;
  profitPerStock: number;
}

const ProfitSimulatorModal: React.FC<ProfitSimulatorModalProps> = ({ isOpen, onClose, pricePerStock, profitPerStock }) => {
  const [inputType, setInputType] = useState<'amount' | 'quantity'>('amount');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');


  let qty = 0;
  let usedAmount = 0;
  let unusedAmount = 0;
  
  if (inputType === 'amount') {
    const amt = safeParseNumber(amount, 0); // Don't floor - keep decimals
    qty = Math.floor(Money.divide(amt, pricePerStock)); // Only floor the quantity
    usedAmount = Money.multiply(qty, pricePerStock);
    unusedAmount = Money.subtract(amt, usedAmount);
  } else {
    qty = Math.floor(safeParseNumber(quantity, 0));
    usedAmount = Money.multiply(qty, pricePerStock);
  }
  
  const profit = Money.multiply(qty, profitPerStock);
  const result = (qty > 0) ? { invest: usedAmount, qty, profit, unusedAmount } : null;

  if (!isOpen) {return null;}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border-2 border-blue-200">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-extrabold mb-6 text-blue-800 flex items-center gap-2">
          <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /></svg>
          Profit Simulator
        </h2>
        <div className="mb-6 flex gap-4 justify-center">
          <button
            className={`px-4 py-2 rounded-full shadow ${inputType === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-700'} font-semibold transition`}
            onClick={() => setInputType('amount')}
          >By Amount</button>
          <button
            className={`px-4 py-2 rounded-full shadow ${inputType === 'quantity' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-700'} font-semibold transition`}
            onClick={() => setInputType('quantity')}
          >By Quantity</button>
        </div>
        <div className="mb-6">
          {inputType === 'amount' ? (
            <input
              type="number"
              className="w-full border-2 border-blue-200 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter amount (₹)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={0}
            />
          ) : (
            <input
              type="number"
              className="w-full border-2 border-blue-200 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min={0}
            />
          )}
        </div>
        {result && (
          <div className="bg-white/80 rounded-xl p-6 text-center shadow-lg border border-blue-100">
            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Stocks to buy</span>
                <span className="text-2xl font-bold text-blue-700">{result.qty}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Total Invested</span>
                <span className="text-2xl font-bold text-blue-700">₹{result.invest}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Estimated Profit</span>
                <span className="text-2xl font-bold text-green-600">₹{result.profit}</span>
              </div>
            </div>
            {inputType === 'amount' && result && result.unusedAmount > 0.01 && (
              <div className="text-xs text-gray-500 mt-2">Only ₹{result.invest.toFixed(2)} used, ₹{result.unusedAmount.toFixed(2)} left unused.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitSimulatorModal;
