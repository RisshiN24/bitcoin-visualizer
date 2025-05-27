import React from "react";
import { NewsItem } from "../types/types";

interface Props {
    news: NewsItem;
}

const NewsItemComponent: React.FC<Props> = ({ news }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold">{news.title}</h2>
      <p className="text-gray-400">{news.description}</p>
      <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        Read more
      </a>
    </div>
  );
};

export default NewsItemComponent;