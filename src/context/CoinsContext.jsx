import React, { createContext, useState, useEffect } from 'react';

export const CoinsContext = createContext();

export const CoinsProvider = ({ children }) => {
  const [coinData, setCoinData] = useState([]);
  const [coinDetails, setCoinDetails] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=${page}&sparkline=false`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setCoinData(data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [currency, page]);

  const fetchCoinDetails = async (coinId) => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&sparkline=true`);
      const data = await response.json();
      setCoinDetails(prevDetails => ({...prevDetails, [coinId]: data}));
    } catch (error) {
      console.error(`Error fetching details for coin ${coinId}:`, error);
    }
  };

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleCoinInWatchlist = (coinId) => {
    setWatchlist(prev => {
      if (prev.includes(coinId)) {
        return prev.filter(id => id !== coinId);
      } else {
        return [...prev, coinId];
      }
    });
  };

  return (
    <CoinsContext.Provider value={{ coinData, coinDetails, loading, watchlist, toggleCoinInWatchlist, fetchCoinDetails, currency, setCurrency, page, setPage }}>
      {children}
    </CoinsContext.Provider>
  );
};
