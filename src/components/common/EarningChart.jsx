import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Custom Tooltip component to match the UI precisely
const CustomTooltip = ({ active, payload, currency = '₦', growthRate = '0%' }) => {
  if (active && payload && payload.length) {
    const rawVal = payload[0].value;
    const formatted = typeof rawVal === 'number'
      ? rawVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
      : rawVal;

    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 bg-white px-3 py-1.5 shadow-md">
        <span className="text-xs font-semibold text-gray-800">
          {currency}{formatted}
        </span>
        <span className="rounded bg-black px-1 py-0.5 text-[10px] font-medium text-white">
          {growthRate}
        </span>
      </div>
    );
  }
  return null;
};

export default function EarningsChart({
  title = 'Earning',
  totalEarnings = '0',
  currency = '₦',
  growthRate = '0%',
  data = [],
  isLoading = false,
  isError = false,
  errorMessage = '',
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

      {/* Chart Content / Loading / Error / Empty */}
      {isLoading ? (
        <div className="h-64 w-full flex items-center justify-center space-x-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-xs font-medium">Loading analytics data...</span>
        </div>
      ) : isError ? (
        <div className="h-64 w-full flex flex-col items-center justify-center text-center p-4">
          <p className="text-xs text-rejected font-semibold">Failed to load analytics</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            {errorMessage || 'Unable to retrieve chart data from server.'}
          </p>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="h-64 w-full flex items-center justify-center text-xs text-slate-400">
          No analytics data recorded yet.
        </div>
      ) : (
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
              domain={[0, (dataMax) => (dataMax > 0 ? Math.ceil(dataMax * 1.25) : 250)]}
              tickCount={6}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                if (value === 0) return '0';
                if (value >= 1_000_000) return `${currency}${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${currency}${(value / 1_000).toFixed(0)}k`;
                return `${currency}${value}`;
              }}
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
              content={<CustomTooltip currency={currency} growthRate={growthRate} />}
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
    )}
  </div>
);
}