import { useState, useEffect, useCallback } from 'react';
import type { PriceResult } from '../types';
import { GOLD_SILVER_TEXTS } from '../constants/goldSilver.constants';
import { logApiFailure, logger } from '@utils/logger';

export const useGoldSilverPrices = () => {
  const [goldPrice, setGoldPrice] = useState<string>('2050');
  const [silverPrice, setSilverPrice] = useState<string>('24.00');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [priceDetails, setPriceDetails] = useState<PriceResult[]>([]);

  const formatTime = useCallback((time: string | number) => {
    try {
      const d = new Date(typeof time === 'number' ? time * 1000 : time);
      return d.toLocaleTimeString();
    } catch {
      return '';
    }
  }, []);

  const tryCoinPaprika = useCallback(async (): Promise<PriceResult | null> => {
    try {
      const [goldRes, silverRes] = await Promise.all([
        fetch('https://api.coinpaprika.com/v1/tickers/paxg-pax-gold'),
        fetch('https://api.coinpaprika.com/v1/tickers/kag-kinesis-silver'),
      ]);
      if (!goldRes.ok || !silverRes.ok) {
        throw new Error('CoinPaprika Status Error');
      }
      const gData = await goldRes.json();
      const sData = await silverRes.json();
      return {
        g: gData.quotes.USD.price,
        s: sData.quotes.USD.price,
        source: 'CoinPaprika',
        time: formatTime(gData.last_updated),
      };
    } catch (error) {
      logApiFailure('CoinPaprika', error);
      return null;
    }
  }, [formatTime]);

  const tryCoinGecko = useCallback(async (): Promise<PriceResult | null> => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,kinesis-silver&vs_currencies=usd&include_last_updated_at=true',
        {
          headers: { Accept: 'application/json' },
        },
      );
      if (!res.ok) {
        throw new Error('CoinGecko Status Error');
      }
      const data = await res.json();
      if (!data['pax-gold']?.usd || !data['kinesis-silver']?.usd) {
        throw new Error('Invalid format');
      }
      return {
        g: data['pax-gold'].usd,
        s: data['kinesis-silver'].usd,
        source: 'CoinGecko',
        time: formatTime(data['pax-gold'].last_updated_at),
      };
    } catch (error) {
      logApiFailure('CoinGecko', error);
      return null;
    }
  }, [formatTime]);

  const tryCurrencyApi = useCallback(async (): Promise<PriceResult | null> => {
    try {
      // https://github.com/fawazahmed0/currency-api
      const res = await fetch('https://latest.currency-api.pages.dev/v1/currencies/usd.json');
      if (!res.ok) {
        throw new Error('CurrencyAPI Status Error');
      }
      const data = await res.json();
      // data.usd.xau is "Amount of Gold for 1 USD". Price = 1/xau
      const goldRate = data.usd?.xau;
      const silverRate = data.usd?.xag;
      if (!goldRate || !silverRate) {
        throw new Error('Missing metals data');
      }
      return {
        g: 1 / goldRate,
        s: 1 / silverRate,
        source: 'CurrencyAPI',
        time: data.date,
      };
    } catch (error) {
      logApiFailure('CurrencyAPI', error);
      return null;
    }
  }, []);

  const getConsensus = useCallback((prices: number[]): number => {
    if (prices.length === 0) {
      return 0;
    }
    if (prices.length === 1) {
      return prices[0] ?? 0;
    }
    if (prices.length === 2) {
      return ((prices[0] ?? 0) + (prices[1] ?? 0)) / 2;
    }

    // For 3 prices, find the pair with the smallest difference
    prices.sort((a, b) => a - b);
    const diff1 = (prices[1] ?? 0) - (prices[0] ?? 0);
    const diff2 = (prices[2] ?? 0) - (prices[1] ?? 0);

    if (diff1 < diff2) {
      // First two are closer
      return ((prices[0] ?? 0) + (prices[1] ?? 0)) / 2;
    } else {
      // Last two are closer (or equal diff)
      return ((prices[1] ?? 0) + (prices[2] ?? 0)) / 2;
    }
  }, []);

  const fetchLivePrices = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Execute all fetches in parallel
      const results = await Promise.all([tryCoinPaprika(), tryCurrencyApi(), tryCoinGecko()]);

      // Filter out failed requests
      const validResults = results.filter((r): r is PriceResult => r !== null);

      if (validResults.length === 0) {
        throw new Error(GOLD_SILVER_TEXTS.ERRORS.ALL_FAILED);
      }

      const goldPrices = validResults.map((r) => r.g);
      const silverPrices = validResults.map((r) => r.s);

      const gPrice = getConsensus(goldPrices);
      const sPrice = getConsensus(silverPrices);

      const sourcesList = validResults.map((r) => r.source).join(', ');
      const usedSource =
        validResults.length > 1
          ? `${GOLD_SILVER_TEXTS.MESSAGES.AVG_OF} ${validResults.length}: ${sourcesList}`
          : sourcesList;

      if (gPrice && sPrice) {
        setGoldPrice(gPrice.toFixed(2));
        setSilverPrice(sPrice.toFixed(2));
        setPriceDetails(validResults);
        setLastUpdated(`${new Date().toLocaleTimeString()} (${usedSource})`);
      } else {
        throw new Error(GOLD_SILVER_TEXTS.ERRORS.INVALID_FORMAT);
      }
    } catch (err) {
      logger.error('Final Fetch error:', err);
      setError(GOLD_SILVER_TEXTS.ERRORS.FETCH_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [tryCoinPaprika, tryCurrencyApi, tryCoinGecko, getConsensus]);

  useEffect(() => {
    fetchLivePrices();
  }, [fetchLivePrices]);

  return {
    goldPrice,
    setGoldPrice,
    silverPrice,
    setSilverPrice,
    isLoading,
    lastUpdated,
    error,
    priceDetails,
    fetchLivePrices,
  };
};
