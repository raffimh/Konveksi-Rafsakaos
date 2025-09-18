"use client";

import { useMemo } from "react";

interface DataPoint {
  value: number;
  label?: string;
}

interface MiniChartProps {
  data: DataPoint[];
  type?: "line" | "bar";
  className?: string;
  color?: string;
  height?: number;
}

export function MiniChart({
  data,
  type = "line",
  className = "",
  color = "#3b82f6",
  height = 40,
}: MiniChartProps) {
  const { points, maxValue, minValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: [], maxValue: 0, minValue: 0 };
    }

    const values = data.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    return { points: data, maxValue, minValue };
  }, [data]);

  const normalizeValue = (value: number) => {
    if (maxValue === minValue) return 0.5;
    return (value - minValue) / (maxValue - minValue);
  };

  if (type === "line") {
    const pathData = points
      .map((point, index) => {
        const x = (index / (points.length - 1)) * 100;
        const y = (1 - normalizeValue(point.value)) * 100;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Fill area */}
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#gradient)"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Points */}
          {points.map((point, index) => {
            const x = (index / (points.length - 1)) * 100;
            const y = (1 - normalizeValue(point.value)) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  // Bar chart
  return (
    <div className={`w-full flex items-end gap-1 ${className}`} style={{ height }}>
      {points.map((point, index) => {
        const barHeight = normalizeValue(point.value) * 100;
        return (
          <div
            key={index}
            className="flex-1 bg-current rounded-t-sm transition-all duration-500 ease-out"
            style={{
              height: `${barHeight}%`,
              color: color,
              opacity: 0.7,
            }}
            title={`${point.label || index}: ${point.value}`}
          />
        );
      })}
    </div>
  );
}