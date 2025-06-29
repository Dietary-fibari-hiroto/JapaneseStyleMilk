import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// データの型定義（なくても動くけど、TSでは書くと安心）
type DataPoint = {
  date: string;
  value: number;
};

const data: DataPoint[] = [
  { date: "2025-06-01", value: 30 },
  { date: "2025-06-02", value: 45 },
  { date: "2025-06-03", value: 20 },
];

const Test = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          labelFormatter={(label) => `日付: ${label}`}
          formatter={(value) => [`値: ${value}`, "データ"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Test;
