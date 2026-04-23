import { useState, useCallback } from 'react';
import { logApiFailure } from '@utils/logger';

interface ExchangeRateResult {
  rate: number;
  source: string;
  lastUpdated: string;
}

export const useUsdToInr = () => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [source, setSource] = useState<string>('');

  const tryExchangeRateApi = useCallback(async (): Promise<ExchangeRateResult | null> => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!res.ok) {
        throw new Error('ExchangeRate-API Status Error');
      }
      const data = await res.json();
      if (!data.rates?.INR) {
        throw new Error('INR rate not found');
      }
      return {
        rate: data.rates.INR,
        source: 'ExchangeRate-API',
        lastUpdated: new Date(data.time_last_updated || Date.now()).toLocaleString(),
      };
    } catch (error) {
      logApiFailure('ExchangeRate-API', error);
      return null;
    }
  }, []);

  const tryFreeCurrencyApi = useCallback(async (): Promise<ExchangeRateResult | null> => {
    try {
      const res = await fetch(
        'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_your_api_key&base_currency=USD&currencies=INR',
      );
      if (!res.ok) {
        throw new Error('FreeCurrencyAPI Status Error');
      }
      const data = await res.json();
      if (!data.data?.INR) {
        throw new Error('INR rate not found');
      }
      return {
        rate: data.data.INR,
        source: 'FreeCurrencyAPI',
        lastUpdated: new Date().toLocaleString(),
      };
    } catch (error) {
      logApiFailure('FreeCurrencyAPI', error);
      return null;
    }
  }, []);

  const tryCurrencyApi = useCallback(async (): Promise<ExchangeRateResult | null> => {
    try {
      const res = await fetch('https://latest.currency-api.pages.dev/v1/currencies/usd.json');
      if (!res.ok) {
        throw new Error('CurrencyAPI Status Error');
      }
      const data = await res.json();
      if (!data.usd?.inr) {
        throw new Error('INR rate not found');
      }
      return {
        rate: data.usd.inr,
        source: 'CurrencyAPI',
        lastUpdated: data.date || new Date().toLocaleDateString(),
      };
    } catch (error) {
      logApiFailure('CurrencyAPI', error);
      return null;
    }
  }, []);

  const fetchExchangeRate = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Run all APIs in parallel — use whichever responds successfully first.
      // Previously these were sequential (await one, then next on failure),
      // which meant slow/down APIs caused the user to wait for each timeout.
      const result = await Promise.any([tryExchangeRateApi(), tryCurrencyApi(), tryFreeCurrencyApi()]);

      if (result) {
        setExchangeRate(result.rate);
        setSource(result.source);
        setLastUpdated(result.lastUpdated);
      } else {
        throw new Error('All exchange rate APIs returned no data');
      }
    } catch (err) {
      console.error('Exchange rate fetch error:', err);
      setError('Unable to fetch USD to INR exchange rate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [tryExchangeRateApi, tryCurrencyApi, tryFreeCurrencyApi]);

  return {
    exchangeRate,
    isLoading,
    error,
    lastUpdated,
    source,
    fetchExchangeRate,
  };
};
