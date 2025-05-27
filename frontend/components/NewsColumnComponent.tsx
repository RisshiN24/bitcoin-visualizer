import React from "react";
import NewsItemComponent from "./NewsItemComponent";
import { NewsItem } from "../types/types";

const NewsColumnComponent: React.FC<{ news: { [key: string]: NewsItem } }> = ({ news }) => {
    const newsArray = Object.values(news); // Convert dict → array

    return (
        <div className="flex flex-col gap-4">
            {newsArray.map((item, index) => (
                <NewsItemComponent key={index} news={item} />
            ))}
        </div>
    );
};

export default NewsColumnComponent;
