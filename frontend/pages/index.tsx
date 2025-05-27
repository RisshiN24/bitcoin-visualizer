import React, { useEffect, useState } from "react";
import Image from "next/image";
import LineChartComponent from "../components/LineChartComponent";
import NewsColumnComponent from "../components/NewsColumnComponent";
import { fetchPriceData, fetchNews } from "../lib/api";
import { PricePoint, NewsItem } from "../types/types";

function IndexPage() {
  const [price, setPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  
  const [minutes, setMinutes] = useState<number>(60);
  const [symbol, setSymbol] = useState<string>('BTC');

  const [news, setNews] = useState<{ [key: string]: NewsItem }>({});

  const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSymbol(event.target.value);
  };
  const handleMinutesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMinutes(+event.target.value);
  };

  useEffect(() => {
    fetchPriceData(symbol, minutes, setPriceHistory, setPrice); // initial fetch
    fetchNews(symbol, setNews); // initial news fetch
    console.log("Fetching news for", symbol);

    const interval = setInterval(() => {
      fetchPriceData(symbol, minutes, setPriceHistory, setPrice); // repeat every 10 seconds
    }, 10 * 1000);

    return () => clearInterval(interval); // correct cleanup
  }, [symbol, minutes]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Image src={`/${symbol}.png`} alt={`${symbol} logo`} width={60} height={60} />
        <h1 className={`text-4xl sm:text-6xl font-bold tracking-tight ${symbol === 'BTC' ? 'text-orange-400' : 'text-purple-400'}`}>
          {symbol} Dashboard
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Price + Chart */}
        <div className="flex-1">
          {/* Price Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg mb-8 max-w-md">
            <h2 className="text-xl text-gray-400 mb-2">Live Price (USD)</h2>
            <p className="text-4xl font-semibold text-green-400">
              {price ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}` : "Loading..."}
            </p>
          </div>

          {/* Chart */}
          <div>
            <h3 className="text-2xl text-gray-300 mb-4">Last {minutes} Minutes</h3>
            <div className="w-full h-80 bg-gray-800 rounded-xl p-4">
              {priceHistory.length > 0 ? (
                <LineChartComponent data={priceHistory} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Loading chart data...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: News */}
        <div className="w-full lg:w-[400px] h-[540px] overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg">
          <NewsColumnComponent news={news} />
        </div>
      </div>

      {/* Settings */}
      <div className="mt-12">
        <h3 className="text-2xl text-gray-300 mb-4">Settings</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="symbol" className="text-gray-400">
              Symbol:
            </label>
            <select
              id="symbol"
              className="bg-gray-800 text-white rounded-md p-2"
              value={symbol.toString()}
              onChange={handleSymbolChange}
            >
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="minutes" className="text-gray-400">
              Minutes:
            </label>
            <select
              id="minutes"
              className="bg-gray-800 text-white rounded-md p-2"
              value={minutes}
              onChange={handleMinutesChange}
            >
              <option value={5}>5</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value={120}>120</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
