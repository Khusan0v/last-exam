import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CoinsContext } from '../../context/CoinsContext';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function SinglePage() {
  const { coinId } = useParams();
  const { currency } = useContext(CoinsContext); 
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('1'); 
  const [fetchError, setFetchError] = useState(''); 

  useEffect(() => {
    async function fetchCoinData() {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch coin data');
        }
        const data = await response.json();
        setCoinData(data);
        setFetchError('');
      } catch (error) {
        setFetchError('Error fetching coin data: ' + error.message); 
      }
    }

    async function fetchChartData() {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.toLowerCase()}&days=${timeframe}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();
        setChartData(data);
        setFetchError('');
      } catch (error) {
        setFetchError('Error fetching chart data: ' + error.message); 
      }
    }

    fetchCoinData();
    fetchChartData();
  }, [coinId, timeframe, currency]);

  if (fetchError) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-2xl">{fetchError}</p>
      </div>
    ); 
  }

  if (!coinData) {
    return <div className="text-center text-white">Loading data...</div>;
  }

  const chartOptions = {
    labels: chartData?.prices.map((price) =>
      new Date(price[0]).toLocaleTimeString()
    ),
    datasets: [
      {
        label: `Price (${currency})`,
        data: chartData?.prices.map((price) => price[1]),
        borderColor: '#42A5F5',
        backgroundColor: '#42A5F5',
        fill: false,
      },
    ],
  };

  const getPrice = () => {
    return coinData?.market_data?.current_price[currency.toLowerCase()];
  };

  const getMarketCap = () => {
    return coinData?.market_data?.market_cap[currency.toLowerCase()];
  };

  const getPriceDisplay = (price) => {
    if (!price) return 'N/A';
    switch (currency) {
      case 'USD':
        return `$${price.toLocaleString()}`;
      case 'EUR':
        return `€${price.toLocaleString()}`;
      case 'RUB':
        return `₽${price.toLocaleString()}`;
      default:
        return `${price.toLocaleString()} ${currency}`;
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      <div className="flex flex-row justify-between w-full max-w-[1280px] space-x-6">
        <div className="flex flex-col items-start space-y-4 w-1/3 border-r border-gray-600 pr-6 mt-5">
          <div className="flex flex-col items-center">
            <img
              src={coinData.image.large}
              alt={coinData.name}
              className="w-32 h-32 mb-4"
            />
            <h1 className="text-4xl font-bold">{coinData.name}</h1>
            <p className="text-lg text-gray-400 mt-2 text-[16px]">
              {coinData.description.en.split('. ')[0]}.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <p className="text-2xl">
              Rank:{' '}
              <span className="font-bold text-yellow-400">
                #{coinData.market_cap_rank}
              </span>
            </p>
            <p className="text-xl">
              Current Price:{' '}
              <span className="font-semibold text-green-500">
                {getPriceDisplay(getPrice())}
              </span>
            </p>
            <p className="text-xl">
              Market Cap:{' '}
              <span className="font-semibold">
                {getPriceDisplay(getMarketCap())}
              </span>
            </p>
          </div>
        </div>

        <div className="w-2/3 h-[600px]">
          {chartData ? (
            <Line
              data={chartOptions}
              options={{
                maintainAspectRatio: false,
                responsive: true,
              }}
              height={600}
              width={900}
            />
          ) : (
            <p className="text-white">Loading chart...</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => setTimeframe('1')}
          className={`px-4 py-2 rounded ${
            timeframe === '1' ? 'bg-blue-500' : 'bg-gray-800'
          } text-white`}
        >
          24 Hours
        </button>
        <button
          onClick={() => setTimeframe('30')}
          className={`px-4 py-2 rounded ${
            timeframe === '30' ? 'bg-blue-500' : 'bg-gray-800'
          } text-white`}
        >
          30 Days
        </button>
        <button
          onClick={() => setTimeframe('90')}
          className={`px-4 py-2 rounded ${
            timeframe === '90' ? 'bg-blue-500' : 'bg-gray-800'
          } text-white`}
        >
          3 Months
        </button>
        <button
          onClick={() => setTimeframe('365')}
          className={`px-4 py-2 rounded ${
            timeframe === '365' ? 'bg-blue-500' : 'bg-gray-800'
          } text-white`}
        >
          1 Year
        </button>
      </div>
    </div>
  );
}
