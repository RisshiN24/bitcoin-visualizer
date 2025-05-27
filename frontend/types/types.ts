type NewsItem = {
  title: string;
  description: string;
  url: string;
  image: string;
};

type PricePoint = {
  time: string;
  price: number;
};

export type { NewsItem, PricePoint };