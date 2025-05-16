// components/LineChartComponent.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type PricePoint = {
  time: string;
  price: number;
};

type Props = {
  data: PricePoint[];
};

const LineChartComponent: React.FC<Props> = ({ data }) => {
  const formattedData = data.map((point) => ({
    time: new Date(point.time).toLocaleTimeString("en-US", { // Date object converts from UTC to local time of client
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: point.price,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#333" strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fill: "#ccc", fontSize: 12 }} />
        <YAxis
          dataKey="price"
          domain={["auto", "auto"]}
          tick={{ fill: "#ccc", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#222", borderColor: "#555" }}
          labelStyle={{ color: "#fff" }}
          formatter={(value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#10b981" // Tailwind green-400
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;