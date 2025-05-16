import React, { useEffect, useState } from "react";
import Image from "next/image";
import LineChartComponent from "../components/LineChartComponent";

type PricePoint = {
  time: string;
  price: number;
};

function IndexPage() {
  const [price, setPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  
  const [minutes, setMinutes] = useState<number>(60);
  const [symbol, setSymbol] = useState<string>('BTC');

  const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSymbol(event.target.value);
  };
  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(+event.target.value);
  };

  const fetchPriceData = (symbol: String, minutes: number) => {
    fetch(`http://localhost:5000/api/price/${symbol}/${minutes.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        const parsed = JSON.parse(data);
        const bars = parsed?.bars?.[`${symbol}/USD`] || [];

        if (bars.length > 0) {
          const formatted = bars.map((bar: any) => ({
            time: bar.t,
            price: bar.c,
          }));
          setPriceHistory(formatted);
          setPrice(formatted[formatted.length - 1].price);
        }
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPriceData(symbol, minutes); // repeat every 60 seconds
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
      fetchPriceData(symbol, minutes); // initial fetch
    };
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

      {/* Price Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg max-w-md">
        <h2 className="text-xl text-gray-400 mb-2">Live Price (USD)</h2>
        <p className="text-4xl font-semibold text-green-400">
          {price ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}` : "Loading..."}
        </p>
      </div>

      {/* Price Chart */}
      <div className="mt-12">
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
            <input
              type="number"
              id="minutes"
              className="bg-gray-800 text-white rounded-md p-2"
              value={minutes}
              onChange={handleMinutesChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
