// Get price data
export const fetchPriceData = (symbol: String, minutes: number, setPriceHistory: any, setPrice: any) => { 
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

export const fetchNews = (symbol: String, setNews: any) => {
    console.log("Fetching news for", symbol);
    fetch(`http://localhost:5000/api/news/${symbol}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setNews(data);  // ✅ only set if exists
          console.log("Fetched news for", symbol);
        } else {
          setNews({});             // fallback if malformed
          console.error("Malformed news data:", data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch news:", error);
        setNews([]); // prevent crash on error
      });
}