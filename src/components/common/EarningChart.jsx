import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Sample mock data matching the chart timeline
const DEFAULT_DATA = [
  { name: 'Jan', value: 75 },
  { name: 'Feb', value: 70 },
  { name: 'Mar', value: 115 },
  { name: 'Apr', value: 110 },
  { name: 'May', value: 80 },
  { name: 'Jun', value: 85 },
  { name: 'Jul', value: 70 },
  { name: 'Aug', value: 95 },
  { name: 'Sep', value: 100 },
  { name: 'Oct', value: 95 },
  { name: 'Nov', value: 92 },
  { name: 'Dec', value: 102 },
];

// Custom Tooltip component to match the UI precisely
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 bg-white px-3 py-1.5 shadow-md">
        <span className="text-xs font-semibold text-gray-800">
          {/* Formats the raw numeric value into the exact decimal structure seen in the UI */}
          {Number(payload[0].value * 2592.26).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <span className="rounded bg-black px-1 py-0.5 text-[10px] font-medium text-white">
          -3.4%
        </span>
      </div>
    );
  }
  return null;
};

export default function EarningsChart({
  title = 'Earning',
  totalEarnings = '3,445',
  currency = '₦',
  data = DEFAULT_DATA,
  className = '',
}) {
  return (
    <div className={`w-full rounded-2xl bg-white p-6 shadow-xs border border-gray-100 ${className}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <span className="text-xl font-bold text-gray-900 flex items-center">
          <span className="font-sans mr-0.5">{currency}</span>{totalEarnings}
        </span>
      </div>

      {/* Chart Wrapper Container */}
      <div className="h-64 w-full text-[11px] font-medium text-gray-400">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 5, left: -25, bottom: 0 }}
          >
            {/* Grid Line configurations */}
            <CartesianGrid 
              vertical={false} 
              stroke="#F3F4F6" 
              strokeDasharray="0" 
            />

            {/* Y Axis Formatting */}
            <YAxis
              domain={[0, 250]}
              tickCount={6}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => (value === 0 ? '0' : `₦${value}`)}
              className="font-medium fill-gray-400"
            />

            {/* X Axis Formatting */}
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              dy={12}
              className="font-medium fill-gray-400"
              // Highlight the targeted active month dynamically
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  {payload.value === 'Jul' ? (
                    <g>
                      <rect x={-12} y={-2} width={24} height={18} rx={4} fill="black" />
                      <text x={0} y={10} textAnchor="middle" fill="white" className="text-[10px] font-bold">
                        {payload.value}
                      </text>
                    </g>
                  ) : (
                    <text x={0} y={10} textAnchor="middle" fill="#9CA3AF">
                      {payload.value}
                    </text>
                  )}
                </g>
              )}
            />

            {/* Interactive Tooltip Configuration */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              position={{ y: -5 }} 
              // Active coordinate forces tooltip open on July if needed natively
              defaultIndex={6} 
            />

            {/* Smooth Line Curve (Using Area with 0 opacity fill to perfectly replicate line behavior) */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#111827"
              strokeWidth={1.5}
              fillOpacity={0}
              activeDot={{
                r: 3,
                stroke: '#111827',
                strokeWidth: 1,
                fill: '#111827'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}