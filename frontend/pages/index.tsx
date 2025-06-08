import React, { useEffect, useState, useRef } from "react";
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

  // High/Low toggle state
  const [showHigh, setShowHigh] = useState<boolean>(true);

  // Ref for settings panel to detect outside clicks
  const settingsRef = useRef<HTMLDivElement>(null);

  const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSymbol(event.target.value);
  };
  const handleMinutesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMinutes(+event.target.value);
  };

  // Calculate RSI (14-period)
  const calculateRSI = (prices: number[], period: number = 14) => {
    if (prices.length < period + 1) return 50; // Default to neutral if not enough data
    
    const gains: number[] = [];
    const losses: number[] = [];
    
    // Calculate gains and losses
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    // Calculate average gains and losses over the period
    let avgGain = 0;
    let avgLoss = 0;
    
    // Initial averages (simple average for first period)
    for (let i = 0; i < period; i++) {
      avgGain += gains[i];
      avgLoss += losses[i];
    }
    avgGain /= period;
    avgLoss /= period;
    
    // Calculate RSI for the most recent period using smoothed averages
    for (let i = period; i < gains.length; i++) {
      avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
      avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
    }
    
    if (avgLoss === 0) return 100; // Avoid division by zero
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  // Calculate Volatility (Standard Deviation of Returns)
  const calculateVolatility = (prices: number[]) => {
    if (prices.length < 2) return 0; // Need at least 2 prices for returns
    
    // Calculate returns (percentage changes)
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      const returnPct = ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100;
      returns.push(returnPct);
    }
    
    if (returns.length === 0) return 0;
    
    // Calculate mean return
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    
    // Calculate variance
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    
    // Return standard deviation (volatility)
    return Math.sqrt(variance);
  };

  // Calculate metrics from price history
  const getMetrics = () => {
    if (priceHistory.length === 0) return { percentChange: 0, high: 0, low: 0, rsi: 50, volatility: 0 };
    
    const prices = priceHistory.map(point => point.price);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
    const rsi = calculateRSI(prices);
    const volatility = calculateVolatility(prices);
    
    return { percentChange, high, low, rsi, volatility };
  };

  const { percentChange, high, low, rsi, volatility } = getMetrics();

  // Handle clicking outside settings to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

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
      <div className="mb-6 flex-shrink-0">
        {/* Top row: Logo + Title + Widgets + Gear */}
        <div className="flex items-center gap-4 mb-2 pr-12">
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
          
          {/* Metric Widgets - Fill remaining space */}
          <div className="flex-1 flex gap-3 ml-8 mr-4">
            {/* Percent Change Widget */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex-1">
              <div className="text-xs text-gray-400 mb-1">% Change</div>
              <div className={`text-sm font-semibold ${percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500">Last {minutes}min</div>
            </div>

            {/* High/Low Toggle Widget */}
            <div 
              className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex-1 cursor-pointer hover:bg-gray-750 transition-colors"
              onClick={() => setShowHigh(!showHigh)}
            >
              <div className="text-xs text-gray-400 mb-1">{showHigh ? 'High' : 'Low'}</div>
              <div className={`text-sm font-semibold ${showHigh ? 'text-green-400' : 'text-red-400'}`}>
                ${(showHigh ? high : low).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-500">Last {minutes}min</div>
            </div>

            {/* RSI Widget */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex-1">
              <div className="text-xs text-gray-400 mb-1">RSI (14)</div>
              <div className={`text-sm font-semibold ${
                rsi > 70 ? 'text-red-400' : 
                rsi < 30 ? 'text-green-400' : 
                'text-yellow-400'
              }`}>
                {rsi.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Last {minutes}min</div>
            </div>

            {/* Volatility Widget */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex-1">
              <div className="text-xs text-gray-400 mb-1">Volatility</div>
              <div className={`text-sm font-semibold ${
                volatility > 3 ? 'text-red-400' : 
                volatility > 1 ? 'text-yellow-400' : 
                'text-green-400'
              }`}>
                {volatility.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500">Last {minutes}min</div>
            </div>
          </div>

          {/* Gear icon for settings */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <CogIcon className="w-8 h-8" />
          </button>
        </div>
        
        {/* Price as subtitle - inline */}
        <div className="ml-16 flex items-baseline gap-3">
          <p className="text-sm text-gray-400 italic">Live Price:</p>
          <p className="text-xl font-semibold text-green-400">
            {price ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} USD` : "Loading price..."}
          </p>
        </div>

        {/* Collapsible Settings Panel */}
        {isSettingsOpen && (
          <div 
            ref={settingsRef}
            className="absolute top-12 right-0 w-[380px] bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg z-10"
          >
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
                        className="appearance-none w-4 h-4 rounded bg-gray-700 border-2 border-gray-600 checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:top-0 checked:after:left-0 checked:after:w-full checked:after:h-full checked:after:flex checked:after:items-center checked:after:justify-center"
                      />
                      Show Chart
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showNews}
                        onChange={(e) => setShowNews(e.target.checked)}
                        className="appearance-none w-4 h-4 rounded bg-gray-700 border-2 border-gray-600 checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:top-0 checked:after:left-0 checked:after:w-full checked:after:h-full checked:after:flex checked:after:items-center checked:after:justify-center"
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
              <div className={`h-full overflow-y-auto bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col ${
                showChart ? 'w-full lg:w-[380px]' : 'flex-1'
              }`}>
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
