import { useState, useEffect, useRef } from 'react';
import { searchStocks } from '../service';
import type { StockSearchResult } from '../types';

interface StockSearchProps {
  onStockSelected: (symbol: string) => void;
}

const POPULAR_STOCKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd.' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.' },
];

export default function StockSearch({ onStockSelected }: StockSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<StockSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced API search yielder
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      return;
    }

    const debounceTimer = setTimeout(async () => {
      const results = await searchStocks(searchQuery);
      setSuggestions(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Click outside listener to hide dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    onStockSelected(symbol);
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6 flex flex-col gap-3" ref={dropdownRef}>
      <div className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition duration-150">
        <span className="pl-4 pr-2 text-gray-400 select-none">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            const val = e.target.value;
            setSearchQuery(val);
            setShowDropdown(true);
            if (val.trim().length < 2) {
              setSuggestions([]);
              setIsLoading(false);
            } else {
              setIsLoading(true);
            }
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search by Symbol (e.g. TCS, INFY) or Company Name..."
          className="w-full py-3.5 pr-4 text-sm text-gray-800 bg-transparent outline-none placeholder-gray-400"
        />
        {isLoading && (
          <div className="pr-4 flex items-center">
            <div className="w-5 h-5 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (suggestions.length > 0 || (searchQuery.trim().length >= 2 && isLoading)) && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">
          {isLoading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">Searching markets...</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">No stocks found matching query.</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {suggestions.map((suggestion) => (
                <li key={suggestion.symbol}>
                  <button
                    type="button"
                    onClick={() => handleSelect(suggestion.symbol)}
                    className="w-full text-left p-3 hover:bg-gray-50 cursor-pointer flex flex-col gap-1 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">{suggestion.symbol}</span>
                      <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        {suggestion.exchDisp}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 truncate">{suggestion.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Popular quick tags */}
      <div className="flex items-center flex-wrap gap-2 text-xs">
        <span className="text-gray-500 font-medium">Popular Indian Stocks:</span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_STOCKS.map((item) => (
            <button
              key={item.symbol}
              onClick={() => handleSelect(item.symbol)}
              type="button"
              className="bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-semibold hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
            >
              {item.symbol.split('.')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
