import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import { useGoldSilverPrices } from './hooks/useGoldSilverPrices';
import { 
  HISTORICAL_CONTEXT, 
  INVESTMENT_GUIDELINES, 
  GOLD_SILVER_TEXTS, 
  ANALYSIS_MESSAGES,
  RECOMMENDATION_TYPES,
  STRENGTH_TYPES
} from './constants/goldSilver.constants';
import type { RatioAnalysis } from './types';
import { LivePriceTable } from './components/LivePriceTable';

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
    case RECOMMENDATION_TYPES.BUY_GOLD: return 'text-yellow-600';
    case RECOMMENDATION_TYPES.BUY_SILVER: return 'text-gray-600';
    case RECOMMENDATION_TYPES.NEUTRAL: return 'text-blue-600';
    default: return 'text-gray-600';
    }
  };

  const getRecommendationBg = (recommendation: string): string => {
    switch (recommendation) {
    case RECOMMENDATION_TYPES.BUY_GOLD: return 'bg-yellow-50 border-yellow-200';
    case RECOMMENDATION_TYPES.BUY_SILVER: return 'bg-gray-50 border-gray-300';
    case RECOMMENDATION_TYPES.NEUTRAL: return 'bg-blue-50 border-blue-200';
    default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{GOLD_SILVER_TEXTS.TITLE}</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {GOLD_SILVER_TEXTS.SUBTITLE}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500">
            {lastUpdated && <span className="text-green-600 font-medium">{GOLD_SILVER_TEXTS.UPDATED_LABEL} {lastUpdated}</span>}
            {error && <span className="text-red-500">{error}</span>}
            {!lastUpdated && !error && GOLD_SILVER_TEXTS.MANUAL_ENTRY_TEXT}
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {GOLD_SILVER_TEXTS.FETCH_BUTTON.LOADING}
              </>
            ) : (
              <>
                {GOLD_SILVER_TEXTS.FETCH_BUTTON.DEFAULT}
              </>
            )}
          </button>
        </div>
      </div>

      <LivePriceTable priceDetails={priceDetails} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{GOLD_SILVER_TEXTS.INPUT_SECTION.TITLE}</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {GOLD_SILVER_TEXTS.INPUT_SECTION.GOLD_LABEL}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="2000"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {GOLD_SILVER_TEXTS.INPUT_SECTION.SILVER_LABEL}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={silverPrice}
                  onChange={(e) => setSilverPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="25"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{GOLD_SILVER_TEXTS.INPUT_SECTION.RATIO_TITLE}</div>
              <div className="text-3xl font-bold text-gray-800">{analysis.ratio.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">{GOLD_SILVER_TEXTS.INPUT_SECTION.RATIO_SUBTITLE}</div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className={`rounded-lg shadow-md p-6 border-2 ${getRecommendationBg(analysis.recommendation)}`}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{GOLD_SILVER_TEXTS.ANALYSIS_SECTION.TITLE}</h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">{GOLD_SILVER_TEXTS.ANALYSIS_SECTION.RECOMMENDATION_LABEL}</div>
              <div className={`text-2xl font-bold ${getRecommendationColor(analysis.recommendation)} uppercase`}>
                {analysis.recommendation === RECOMMENDATION_TYPES.BUY_GOLD && GOLD_SILVER_TEXTS.ANALYSIS_SECTION.BUY_GOLD}
                {analysis.recommendation === RECOMMENDATION_TYPES.BUY_SILVER && GOLD_SILVER_TEXTS.ANALYSIS_SECTION.BUY_SILVER}
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
                        i < (analysis.strength === STRENGTH_TYPES.STRONG ? 3 : analysis.strength === STRENGTH_TYPES.MODERATE ? 2 : 1)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-300">
              <div className="text-sm text-gray-600 mb-2">{GOLD_SILVER_TEXTS.ANALYSIS_SECTION.INTERPRETATION_LABEL}</div>
              <p className="text-gray-800">{analysis.message}</p>
            </div>
          </div>
        </div>
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
            <strong>{GOLD_SILVER_TEXTS.INFO_SECTION.MEANING.LABEL}</strong> {GOLD_SILVER_TEXTS.INFO_SECTION.MEANING.TEXT}
          </p>
          <p>
            <strong>{GOLD_SILVER_TEXTS.INFO_SECTION.USAGE.LABEL}</strong> {GOLD_SILVER_TEXTS.INFO_SECTION.USAGE.TEXT}
          </p>
          <p>
            <strong>{GOLD_SILVER_TEXTS.INFO_SECTION.STRATEGY.LABEL}</strong> {GOLD_SILVER_TEXTS.INFO_SECTION.STRATEGY.TEXT}
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
