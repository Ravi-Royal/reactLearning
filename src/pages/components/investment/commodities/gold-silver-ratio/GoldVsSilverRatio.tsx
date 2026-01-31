import { useState, useEffect } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';

interface RatioAnalysis {
  ratio: number;
  recommendation: 'buy-gold' | 'buy-silver' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
  message: string;
}

function GoldVsSilverRatio() {
  const [goldPrice, setGoldPrice] = useState<string>('2050');
  const [silverPrice, setSilverPrice] = useState<string>('24.00');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchLivePrices = async () => {
    setIsLoading(true);
    setError('');

    let gPrice = 0;
    let sPrice = 0;
    let usedSource = '';

    const tryCoinPaprika = async () => {
      try {
        const [goldRes, silverRes] = await Promise.all([
          fetch('https://api.coinpaprika.com/v1/tickers/paxg-pax-gold'),
          fetch('https://api.coinpaprika.com/v1/tickers/kag-kinesis-silver'),
        ]);
        if (!goldRes.ok || !silverRes.ok) {throw new Error('CoinPaprika Status Error');}
        const gData = await goldRes.json();
        const sData = await silverRes.json();
        return { g: gData.quotes.USD.price, s: sData.quotes.USD.price, source: 'CoinPaprika' };
      } catch (e) { console.warn('CoinPaprika failed:', e); return null; }
    };

    const tryCoinGecko = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,kinesis-silver&vs_currencies=usd', {
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) {throw new Error('CoinGecko Status Error');}
        const data = await res.json();
        if (!data['pax-gold']?.usd || !data['kinesis-silver']?.usd) {throw new Error('Invalid format');}
        return { g: data['pax-gold'].usd, s: data['kinesis-silver'].usd, source: 'CoinGecko' };
      } catch (e) { console.warn('CoinGecko failed:', e); return null; }
    };

    const tryCurrencyApi = async () => {
      try {
        // https://github.com/fawazahmed0/currency-api
        const res = await fetch('https://latest.currency-api.pages.dev/v1/currencies/usd.json');
        if (!res.ok) {throw new Error('CurrencyAPI Status Error');}
        const data = await res.json();
        // data.usd.xau is "Amount of Gold for 1 USD". Price = 1/xau
        const goldRate = data.usd?.xau;
        const silverRate = data.usd?.xag;
        if (!goldRate || !silverRate) {throw new Error('Missing metals data');}
        return { g: 1 / goldRate, s: 1 / silverRate, source: 'CurrencyAPI' };
      } catch (e) { console.warn('CurrencyAPI failed:', e); return null; }
    };

    try {
      // Execute all fetches in parallel
      const results = await Promise.all([
        tryCoinPaprika(),
        tryCurrencyApi(),
        tryCoinGecko(),
      ]);

      // Filter out failed requests
      const validResults = results.filter((r): r is { g: number; s: number; source: string } => r !== null);

      if (validResults.length === 0) {
        throw new Error('All APIs failed');
      }

      // Helper to calculate consensus price
      const getConsensus = (prices: number[]): number => {
        if (prices.length === 0) {return 0;}
        if (prices.length === 1) {return prices[0];}
        if (prices.length === 2) {return (prices[0] + prices[1]) / 2;}

        // For 3 prices, find the pair with the smallest difference
        prices.sort((a, b) => a - b);
        const diff1 = prices[1] - prices[0];
        const diff2 = prices[2] - prices[1];

        if (diff1 < diff2) {
          // First two are closer
          return (prices[0] + prices[1]) / 2;
        } else {
          // Last two are closer (or equal diff)
          return (prices[1] + prices[2]) / 2;
        }
      };

      const goldPrices = validResults.map(r => r.g);
      const silverPrices = validResults.map(r => r.s);

      gPrice = getConsensus(goldPrices);
      sPrice = getConsensus(silverPrices);

      const sourcesList = validResults.map(r => r.source).join(', ');
      usedSource = validResults.length > 1 ? `Avg of ${validResults.length}: ${sourcesList}` : sourcesList;

      if (gPrice && sPrice) {
        setGoldPrice(gPrice.toFixed(2));
        setSilverPrice(sPrice.toFixed(2));
        setLastUpdated(`${new Date().toLocaleTimeString()} (${usedSource})`);
      } else {
        throw new Error('Data format invalid');
      }

    } catch (err) {
      console.error('Final Fetch error:', err);
      setError('Unable to auto-fetch from any source. Please enter manually.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePrices();
  }, []);

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
        recommendation: 'buy-silver',
        strength: 'strong',
        message: 'Silver is extremely undervalued relative to gold. Strong buy signal for silver.',
      };
    } else if (ratio >= 80) {
      return {
        ratio,
        recommendation: 'buy-silver',
        strength: 'moderate',
        message: 'Silver is significantly undervalued. Consider accumulating silver positions.',
      };
    } else if (ratio >= 70) {
      return {
        ratio,
        recommendation: 'buy-silver',
        strength: 'weak',
        message: 'Silver is moderately undervalued. Potential opportunity to buy silver.',
      };
    } else if (ratio >= 60) {
      return {
        ratio,
        recommendation: 'neutral',
        strength: 'weak',
        message: 'Ratio is near historical average. Monitor both metals for better entry points.',
      };
    } else if (ratio >= 50) {
      return {
        ratio,
        recommendation: 'buy-gold',
        strength: 'weak',
        message: 'Gold is starting to look relatively undervalued. Consider building gold positions.',
      };
    } else if (ratio >= 40) {
      return {
        ratio,
        recommendation: 'buy-gold',
        strength: 'moderate',
        message: 'Gold is significantly undervalued. Good opportunity to accumulate gold.',
      };
    } else {
      return {
        ratio,
        recommendation: 'buy-gold',
        strength: 'strong',
        message: 'Gold is extremely undervalued relative to silver. Strong buy signal for gold.',
      };
    }
  };

  const analysis = analyzeRatio();

  const getRecommendationColor = (recommendation: string): string => {
    switch (recommendation) {
    case 'buy-gold':
      return 'text-yellow-600';
    case 'buy-silver':
      return 'text-gray-600';
    case 'neutral':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
    }
  };

  const getRecommendationBg = (recommendation: string): string => {
    switch (recommendation) {
    case 'buy-gold':
      return 'bg-yellow-50 border-yellow-200';
    case 'buy-silver':
      return 'bg-gray-50 border-gray-300';
    case 'neutral':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Gold vs Silver Ratio Analysis</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Analyze the gold-silver ratio to identify buying opportunities
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500">
            {lastUpdated && <span className="text-green-600 font-medium">✓ Updated: {lastUpdated}</span>}
            {error && <span className="text-red-500">{error}</span>}
            {!lastUpdated && !error && 'Enter prices manually or fetch live data'}
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
                Fetching...
              </>
            ) : (
              <>
                🔄 Get Live Prices
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Prices</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gold Price (per oz)
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
                Silver Price (per oz)
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
              <div className="text-sm text-gray-600 mb-1">Current Ratio</div>
              <div className="text-3xl font-bold text-gray-800">{analysis.ratio.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">Gold ounces per Silver ounce</div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className={`rounded-lg shadow-md p-6 border-2 ${getRecommendationBg(analysis.recommendation)}`}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Analysis & Recommendation</h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Recommendation</div>
              <div className={`text-2xl font-bold ${getRecommendationColor(analysis.recommendation)} uppercase`}>
                {analysis.recommendation === 'buy-gold' && '🥇 Buy Gold'}
                {analysis.recommendation === 'buy-silver' && '🥈 Buy Silver'}
                {analysis.recommendation === 'neutral' && '⚖️ Neutral / Hold'}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Signal Strength</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold text-gray-800 capitalize">{analysis.strength}</div>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-6 rounded ${
                        i < (analysis.strength === 'strong' ? 3 : analysis.strength === 'moderate' ? 2 : 1)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-300">
              <div className="text-sm text-gray-600 mb-2">Interpretation</div>
              <p className="text-gray-800">{analysis.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Context & Guidelines */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Historical Context</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Historical Average</span>
              <span className="font-semibold text-gray-800">60-70</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">20-Year Range</span>
              <span className="font-semibold text-gray-800">30-120</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">All-Time High (2020)</span>
              <span className="font-semibold text-gray-800">~125</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Natural Ratio</span>
              <span className="font-semibold text-gray-800">15-17</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Investment Guidelines</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-500 pl-3">
              <div className="font-semibold text-gray-800">Ratio &gt; 80</div>
              <div className="text-sm text-gray-600">Silver is undervalued - Favor silver purchases</div>
            </div>
            <div className="border-l-4 border-blue-500 pl-3">
              <div className="font-semibold text-gray-800">Ratio 60-80</div>
              <div className="text-sm text-gray-600">Near average - Monitor for better entry points</div>
            </div>
            <div className="border-l-4 border-amber-500 pl-3">
              <div className="font-semibold text-gray-800">Ratio &lt; 50</div>
              <div className="text-sm text-gray-600">Gold is undervalued - Favor gold purchases</div>
            </div>
            <div className="border-l-4 border-red-500 pl-3">
              <div className="font-semibold text-gray-800">Extreme Ratios</div>
              <div className="text-sm text-gray-600">&lt;40 or &gt;90 indicate strong buying opportunities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 Understanding the Gold-Silver Ratio</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>
            <strong>What it means:</strong> The gold-silver ratio represents how many ounces of silver it takes to purchase one ounce of gold.
          </p>
          <p>
            <strong>How to use it:</strong> When the ratio is high, silver is relatively cheap compared to gold. When low, gold is relatively cheap compared to silver.
          </p>
          <p>
            <strong>Investment strategy:</strong> Investors can use this ratio to switch between gold and silver holdings, buying the relatively undervalued metal and selling the overvalued one.
          </p>
          <p>
            <strong>Important note:</strong> This ratio is just one tool among many. Always consider broader market conditions, your investment goals, and diversification strategy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoldVsSilverRatio;
