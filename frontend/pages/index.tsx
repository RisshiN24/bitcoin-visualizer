import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CogIcon } from "@heroicons/react/24/outline";
import LineChartComponent from "../components/LineChartComponent";
import NewsColumnComponent from "../components/NewsColumnComponent";
import { fetchPriceData, fetchNews } from "../lib/api";
import { PricePoint, NewsItem } from "../types/types";

// Coin logo component with fallback
const CoinLogo = ({ symbol }: { symbol: string }) => {
  const [imageError, setImageError] = useState(false);
  
  const getColorClasses = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return 'bg-orange-400 border-orange-300';
      case 'ETH': return 'bg-purple-400 border-purple-300';
      case 'DOGE': return 'bg-yellow-400 border-yellow-300';
      case 'SHIB': return 'bg-red-400 border-red-300';
      case 'SOL': return 'bg-green-400 border-green-300';
      default: return 'bg-blue-400 border-blue-300';
    }
  };

  if (imageError) {
    return (
      <div className={`w-[60px] h-[60px] rounded-full border-2 flex items-center justify-center text-white font-bold text-xl ${getColorClasses(symbol)}`}>
        {symbol}
      </div>
    );
  }

  return (
    <Image 
      src={`/${symbol}.png`} 
      alt={`${symbol} logo`} 
      width={60} 
      height={60}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
};

function IndexPage() {
  const [price, setPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  
  const [minutes, setMinutes] = useState<number>(60);
  const [symbol, setSymbol] = useState<string>('BTC');

  const [news, setNews] = useState<{ [key: string]: NewsItem }>({});
  
  // Feature visibility controls
  const [showChart, setShowChart] = useState<boolean>(true);
  const [showNews, setShowNews] = useState<boolean>(true);
  
  // Settings panel visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

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
    <div className="h-screen bg-gray-950 text-white font-sans px-6 py-6 flex flex-col relative">
      {/* Header with title & subtitle */}
      <div className="mb-6 flex-shrink-0 relative">
        {/* Gear icon for settings */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <CogIcon className="w-8 h-8" />
        </button>

        {/* Logo + Title + Price */}
        <div>
          <div className="flex items-center gap-4 mb-2">
            <CoinLogo symbol={symbol} />
            <h1 className={`text-6xl font-bold tracking-tight whitespace-nowrap ${
              symbol === 'BTC' ? 'text-orange-400' : 
              symbol === 'ETH' ? 'text-purple-400' :
              symbol === 'DOGE' ? 'text-yellow-400' :
              symbol === 'SHIB' ? 'text-red-400' :
              symbol === 'SOL' ? 'text-green-400' : 'text-blue-400'
            }`}>
              {symbol} Dashboard
            </h1>
          </div>
          
          {/* Price as subtitle - inline */}
          <div className="ml-16 flex items-baseline gap-3">
            <p className="text-sm text-gray-400 italic">Live Price:</p>
            <p className="text-xl font-semibold text-green-400">
              {price ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} USD` : "Loading price..."}
            </p>
          </div>
        </div>

        {/* Collapsible Settings Panel */}
        {isSettingsOpen && (
          <div className="absolute top-12 right-0 w-[380px] bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg z-10">
            <div className="grid grid-cols-2 gap-4">
              {/* Column 1: Symbol & Minutes */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="symbol" className="block text-gray-400 text-xs mb-1">
                    Symbol
                  </label>
                  <select
                    id="symbol"
                    className="w-full bg-gray-800 text-white rounded-md p-2 text-sm"
                    value={symbol.toString()}
                    onChange={handleSymbolChange}
                  >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="DOGE">DOGE</option>
                    <option value="SHIB">SHIB</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="minutes" className="block text-gray-400 text-xs mb-1">
                    Minutes
                  </label>
                  <select
                    id="minutes"
                    className="w-full bg-gray-800 text-white rounded-md p-2 text-sm"
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

              {/* Column 2: Feature Checkboxes */}
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-2">Features</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showChart}
                        onChange={(e) => setShowChart(e.target.checked)}
                        className="rounded bg-gray-800 border-gray-600"
                      />
                      Show Chart
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showNews}
                        onChange={(e) => setShowNews(e.target.checked)}
                        className="rounded bg-gray-800 border-gray-600"
                      />
                      Show News
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Fills remaining space */}
      <div className="flex-1 min-h-0">
        {!showChart && !showNews ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-600 text-2xl">Waiting to add features...</p>
          </div>
        ) : (
          <div className="h-full flex flex-col lg:flex-row gap-8">
            {/* Left: Chart */}
            {showChart && (
              <div className="flex-1 min-h-0">
                <div className="h-full bg-gray-800 rounded-xl p-4 flex flex-col">
                  <h3 className="text-xl text-gray-300 mb-4 flex-shrink-0">Last {minutes} Minutes</h3>
                  <div className="flex-1 min-h-0">
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
            )}

            {/* Right: News */}
            {showNews && (
              <div className="w-full lg:w-[380px] h-full overflow-y-auto bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col">
                <NewsColumnComponent news={news} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default IndexPage;
