import React, { useEffect, useState } from "react";
import Image from "next/image";

function IndexPage() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/price")
      .then((response) => response.json())
      .then((data) => JSON.parse(data))
      .then((data) => setPrice(data["Bitcoin"]["usd"]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Image src="/bitcoin.png" alt="Bitcoin logo" width={60} height={60} />
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-orange-400">
          Bitcoin Dashboard
        </h1>
      </div>

      {/* Price Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg max-w-md">
        <h2 className="text-xl text-gray-400 mb-2">Live Price (USD)</h2>
        <p className="text-4xl font-semibold text-green-400">
          {price ? `$${price.toLocaleString()}` : "Loading..."}
        </p>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-12">
        <h3 className="text-2xl text-gray-300 mb-4">Last 60 Minutes</h3>
        <div className="w-full h-80 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
          {/* Replace this div with your line chart */}
          <span>Line graph coming soon...</span>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
