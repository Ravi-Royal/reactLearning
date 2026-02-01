import { useState } from 'react';
import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import { useGoldSilverPrices } from './hooks/useGoldSilverPrices';
import { useUsdToInr } from './hooks/useUsdToInr';
import {
  HISTORICAL_CONTEXT,
  INVESTMENT_GUIDELINES,
  GOLD_SILVER_TEXTS,
  ANALYSIS_MESSAGES,
  RECOMMENDATION_TYPES,
  STRENGTH_TYPES,
} from './constants/goldSilver.constants';
import type { RatioAnalysis } from './types';
import { LivePriceTable } from './components/LivePriceTable';

// Conversion constant: 1 troy ounce = 31.1035 grams
const GRAMS_PER_OUNCE = 31.1035;

type Unit = 'ounce' | 'gram';

function GoldVsSilverRatio() {
  const {
    goldPrice,
    setGoldPrice,
    silverPrice,
    setSilverPrice,
    isLoading,
    lastUpdated,
    error,
    priceDetails,
    fetchLivePrices,
  } = useGoldSilverPrices();

  const {
    exchangeRate,
    isLoading: isLoadingInr,
    error: inrError,
    lastUpdated: inrLastUpdated,
    source: inrSource,
    fetchExchangeRate,
  } = useUsdToInr();

  const [unit, setUnit] = useState<Unit>('ounce');

  // Convert price based on selected unit
  const getConvertedPrice = (pricePerOunce: string): number => {
    const price = parseFloat(pricePerOunce) || 0;
    return unit === 'gram' ? price / GRAMS_PER_OUNCE : price;
  };

  const getUnitLabel = (): string => {
    return unit === 'ounce' ? '/oz' : '/g';
  };

  const getUnitFullName = (): string => {
    return unit === 'ounce' ? 'per troy ounce' : 'per gram';
  };

  const calculateRatio = (): number => {
    const gold = parseFloat(goldPrice) || 0;
    const silver = parseFloat(silverPrice) || 1;
    return gold / silver;
  };

  const analyzeRatio = (): RatioAnalysis => {
    const ratio = calculateRatio();

    if (ratio >= 90) {
      return {
        ratio,
        recommendation: RECOMMENDATION_TYPES.BUY_SILVER,
        strength: STRENGTH_TYPES.STRONG,
        message: ANALYSIS_MESSAGES.STRONG_BUY_SILVER,
      };
    } else if (ratio >= 80) {
      return {
        ratio,
        recommendation: RECOMMENDATION_TYPES.BUY_SILVER,
        strength: STRENGTH_TYPES.MODERATE,
        message: ANALYSIS_MESSAGES.MODERATE_BUY_SILVER,
      };
    } else if (ratio >= 70) {
      return {
        ratio,
        recommendation: RECOMMENDATION_TYPES.BUY_SILVER,
        strength: STRENGTH_TYPES.WEAK,
        message: ANALYSIS_MESSAGES.WEAK_BUY_SILVER,
      };
    } else if (ratio >= 60) {
      return {
        ratio,
        recommendation: RECOMMENDATION_TYPES.NEUTRAL,
        strength: STRENGTH_TYPES.WEAK,
        message: ANALYSIS_MESSAGES.NEUTRAL,
      };
    } else if (ratio >= 50) {
      return {
        ratio,
        recommendation: RECOMMENDATION_TYPES.BUY_GOLD,
        strength: STRENGTH_TYPES.WEAK,
        message: ANALYSIS_MESSAGES.WEAK_BUY_GOLD,
      };
    } else if (ratio >= 40) {
      return {
        ratio,
        recommendation: RECOMMENDATION_TYPES.BUY_GOLD,
        strength: STRENGTH_TYPES.MODERATE,
        message: ANALYSIS_MESSAGES.MODERATE_BUY_GOLD,
      };
    } else {
      return {
        ratio,
        recommendation: RECOMMENDATION_TYPES.BUY_GOLD,
        strength: STRENGTH_TYPES.STRONG,
        message: ANALYSIS_MESSAGES.STRONG_BUY_GOLD,
      };
    }
  };

  const analysis = analyzeRatio();

  const getRecommendationColor = (recommendation: string): string => {
    switch (recommendation) {
      case RECOMMENDATION_TYPES.BUY_GOLD:
        return 'text-yellow-600';
      case RECOMMENDATION_TYPES.BUY_SILVER:
        return 'text-gray-600';
      case RECOMMENDATION_TYPES.NEUTRAL:
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRecommendationBg = (recommendation: string): string => {
    switch (recommendation) {
      case RECOMMENDATION_TYPES.BUY_GOLD:
        return 'bg-yellow-50 border-yellow-200';
      case RECOMMENDATION_TYPES.BUY_SILVER:
        return 'bg-gray-50 border-gray-300';
      case RECOMMENDATION_TYPES.NEUTRAL:
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{GOLD_SILVER_TEXTS.TITLE}</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">{GOLD_SILVER_TEXTS.SUBTITLE}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500">
            {lastUpdated && (
              <span className="text-green-600 font-medium">
                {GOLD_SILVER_TEXTS.UPDATED_LABEL} {lastUpdated}
              </span>
            )}
            {error && <span className="text-red-500">{error}</span>}
            {!lastUpdated && !error && GOLD_SILVER_TEXTS.MANUAL_ENTRY_TEXT}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-300 shadow-sm">
              <label htmlFor="unit-selector" className="text-sm font-medium text-gray-700">
                Unit:
              </label>
              <select
                id="unit-selector"
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="text-sm font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer"
              >
                <option value="ounce">Troy Ounce (oz)</option>
                <option value="gram">Gram (g)</option>
              </select>
            </div>

            <button
              onClick={fetchLivePrices}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {GOLD_SILVER_TEXTS.FETCH_BUTTON.LOADING}
                </>
              ) : (
                <>{GOLD_SILVER_TEXTS.FETCH_BUTTON.DEFAULT}</>
              )}
            </button>
          </div>
        </div>
      </div>

      <LivePriceTable priceDetails={priceDetails} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{GOLD_SILVER_TEXTS.INPUT_SECTION.TITLE}</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gold Price (USD {getUnitLabel()})</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={unit === 'ounce' ? '2000' : '64.30'}
                  step="0.01"
                  disabled
                  title="Base price per ounce - use unit selector to view per gram"
                />
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {unit === 'gram'
                  ? `≈ $${getConvertedPrice(goldPrice).toFixed(2)}/g (from $${goldPrice}/oz)`
                  : `Price ${getUnitFullName()}`}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Silver Price (USD {getUnitLabel()})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={silverPrice}
                  onChange={(e) => setSilverPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder={unit === 'ounce' ? '25' : '0.80'}
                  step="0.01"
                  disabled
                  title="Base price per ounce - use unit selector to view per gram"
                />
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {unit === 'gram'
                  ? `≈ $${getConvertedPrice(silverPrice).toFixed(2)}/g (from $${silverPrice}/oz)`
                  : `Price ${getUnitFullName()}`}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{GOLD_SILVER_TEXTS.INPUT_SECTION.RATIO_TITLE}</div>
              <div className="text-3xl font-bold text-gray-800">{analysis.ratio.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {GOLD_SILVER_TEXTS.INPUT_SECTION.RATIO_SUBTITLE}
                <br />
                <span className="text-blue-600 font-medium">
                  Viewing: {unit === 'ounce' ? 'Troy Ounce' : 'Gram'} prices
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className={`rounded-lg shadow-md p-6 border-2 ${getRecommendationBg(analysis.recommendation)}`}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{GOLD_SILVER_TEXTS.ANALYSIS_SECTION.TITLE}</h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {GOLD_SILVER_TEXTS.ANALYSIS_SECTION.RECOMMENDATION_LABEL}
              </div>
              <div className={`text-2xl font-bold ${getRecommendationColor(analysis.recommendation)} uppercase`}>
                {analysis.recommendation === RECOMMENDATION_TYPES.BUY_GOLD &&
                  GOLD_SILVER_TEXTS.ANALYSIS_SECTION.BUY_GOLD}
                {analysis.recommendation === RECOMMENDATION_TYPES.BUY_SILVER &&
                  GOLD_SILVER_TEXTS.ANALYSIS_SECTION.BUY_SILVER}
                {analysis.recommendation === RECOMMENDATION_TYPES.NEUTRAL && GOLD_SILVER_TEXTS.ANALYSIS_SECTION.NEUTRAL}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">{GOLD_SILVER_TEXTS.ANALYSIS_SECTION.STRENGTH_LABEL}</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold text-gray-800 capitalize">{analysis.strength}</div>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-6 rounded ${
                        i <
                        (analysis.strength === STRENGTH_TYPES.STRONG
                          ? 3
                          : analysis.strength === STRENGTH_TYPES.MODERATE
                            ? 2
                            : 1)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-300">
              <div className="text-sm text-gray-600 mb-2">
                {GOLD_SILVER_TEXTS.ANALYSIS_SECTION.INTERPRETATION_LABEL}
              </div>
              <p className="text-gray-800">{analysis.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* INR Conversion Section */}
      <div className="mt-6 bg-gradient-to-br from-gray-100 via-gray-50 to-white rounded-lg shadow-md p-6 border-2 border-gray-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">💱 Convert to Indian Rupees (INR)</h2>
          <button
            onClick={fetchExchangeRate}
            disabled={isLoadingInr}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              isLoadingInr
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 transform hover:scale-105'
            }`}
            style={{
              boxShadow: isLoadingInr ? 'none' : '0 4px 6px rgba(107, 114, 128, 0.3)',
            }}
          >
            {isLoadingInr ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Fetching Rate...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Get INR Rate
              </>
            )}
          </button>
        </div>

        {inrError && (
          <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded border border-red-200">{inrError}</div>
        )}

        {exchangeRate && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Exchange Rate (USD → INR)</span>
                <span className="text-xs text-gray-500">{inrSource}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">₹ {exchangeRate.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">Updated: {inrLastUpdated}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-300 shadow-sm">
                <div className="text-sm text-yellow-800 mb-1 font-medium">🥇 Gold Price (INR{getUnitLabel()})</div>
                <div className="text-xl font-bold text-yellow-900">
                  ₹{' '}
                  {(getConvertedPrice(goldPrice) * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-yellow-700 mt-1">
                  ${getConvertedPrice(goldPrice).toFixed(2)}
                  {getUnitLabel()} × ₹{exchangeRate.toFixed(2)}
                  {unit === 'gram' && <span className="block mt-1 text-yellow-600">(1 oz = {GRAMS_PER_OUNCE}g)</span>}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg p-4 border-2 border-gray-400 shadow-sm">
                <div className="text-sm text-gray-800 mb-1 font-medium">🥈 Silver Price (INR{getUnitLabel()})</div>
                <div className="text-xl font-bold text-gray-900">
                  ₹{' '}
                  {(getConvertedPrice(silverPrice) * exchangeRate).toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  ${getConvertedPrice(silverPrice).toFixed(2)}
                  {getUnitLabel()} × ₹{exchangeRate.toFixed(2)}
                  {unit === 'gram' && <span className="block mt-1 text-gray-600">(1 oz = {GRAMS_PER_OUNCE}g)</span>}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-800 mb-2 font-medium">💰 Investment Calculator (INR)</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {unit === 'ounce' ? (
                  <>
                    <div>
                      <div className="text-blue-700 mb-1">1 oz Gold:</div>
                      <div className="font-semibold text-blue-900">
                        ₹ {(parseFloat(goldPrice) * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-700 mb-1">1 oz Silver:</div>
                      <div className="font-semibold text-blue-900">
                        ₹{' '}
                        {(parseFloat(silverPrice) * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-700 mb-1">10 oz Gold:</div>
                      <div className="font-semibold text-blue-900">
                        ₹{' '}
                        {(parseFloat(goldPrice) * exchangeRate * 10).toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-700 mb-1">100 oz Silver:</div>
                      <div className="font-semibold text-blue-900">
                        ₹{' '}
                        {(parseFloat(silverPrice) * exchangeRate * 100).toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-blue-700 mb-1">1g Gold:</div>
                      <div className="font-semibold text-blue-900">
                        ₹{' '}
                        {(getConvertedPrice(goldPrice) * exchangeRate).toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-700 mb-1">1g Silver:</div>
                      <div className="font-semibold text-blue-900">
                        ₹{' '}
                        {(getConvertedPrice(silverPrice) * exchangeRate).toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-700 mb-1">10g Gold:</div>
                      <div className="font-semibold text-blue-900">
                        ₹{' '}
                        {(getConvertedPrice(goldPrice) * exchangeRate * 10).toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-700 mb-1">100g Silver:</div>
                      <div className="font-semibold text-blue-900">
                        ₹{' '}
                        {(getConvertedPrice(silverPrice) * exchangeRate * 100).toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-blue-200">
                      <div className="text-blue-700 mb-1">1 oz Gold (31.1035g):</div>
                      <div className="font-semibold text-blue-900">
                        ₹ {(parseFloat(goldPrice) * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="col-span-2 border-t border-blue-200 pt-2">
                      <div className="text-blue-700 mb-1">1 oz Silver (31.1035g):</div>
                      <div className="font-semibold text-blue-900">
                        ₹{' '}
                        {(parseFloat(silverPrice) * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!exchangeRate && !inrError && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">Click the silver button above to fetch the USD to INR exchange rate</p>
            <p className="text-xs mt-1">Live prices will be converted to Indian Rupees</p>
          </div>
        )}
      </div>

      {/* Historical Context & Guidelines using Constants */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{GOLD_SILVER_TEXTS.HISTORICAL.TITLE}</h2>
          <div className="space-y-3 text-sm">
            {HISTORICAL_CONTEXT.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{GOLD_SILVER_TEXTS.GUIDELINES.TITLE}</h2>
          <div className="space-y-3">
            {INVESTMENT_GUIDELINES.map((item, idx) => (
              <div key={idx} className={`border-l-4 ${item.borderColor} pl-3`}>
                <div className="font-semibold text-gray-800">{item.condition}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">{GOLD_SILVER_TEXTS.INFO_SECTION.TITLE}</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>
            <strong>{GOLD_SILVER_TEXTS.INFO_SECTION.MEANING.LABEL}</strong>{' '}
            {GOLD_SILVER_TEXTS.INFO_SECTION.MEANING.TEXT}
          </p>
          <p>
            <strong>{GOLD_SILVER_TEXTS.INFO_SECTION.USAGE.LABEL}</strong> {GOLD_SILVER_TEXTS.INFO_SECTION.USAGE.TEXT}
          </p>
          <p>
            <strong>{GOLD_SILVER_TEXTS.INFO_SECTION.STRATEGY.LABEL}</strong>{' '}
            {GOLD_SILVER_TEXTS.INFO_SECTION.STRATEGY.TEXT}
          </p>
          <p>
            <strong>{GOLD_SILVER_TEXTS.INFO_SECTION.NOTE.LABEL}</strong> {GOLD_SILVER_TEXTS.INFO_SECTION.NOTE.TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoldVsSilverRatio;
