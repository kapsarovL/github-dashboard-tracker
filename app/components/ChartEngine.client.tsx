"use client";

import React, { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export type ChartType = "area" | "bar" | "line";

export interface ChartKey {
  key: string;
  color: string;
  label?: string;
  icon?: React.ReactNode;
}

export interface ChartEngineProps {
  data: Record<string, unknown>[];
  type?: ChartType;
  xKey: string;
  yKeys: ChartKey[];
  height?: number | string;
  className?: string;
  showGrid?: boolean;
  showAverage?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { dataKey: string; color: string; value: number }[];
  label?: string;
  yKeys: ChartKey[];
}

function CustomTooltip({ active, payload, label, yKeys }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="border-border/50 bg-popover/98 min-w-[200px] rounded-2xl border p-4 shadow-2xl shadow-black/10 backdrop-blur-xl">
      {/* Header with label */}
      <div className="border-border/50 mb-3 border-b pb-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {label}
        </p>
      </div>

      {/* Values */}
      <div className="space-y-2.5">
        {payload.map((item) => {
          const yKey = yKeys.find((yk) => yk.key === item.dataKey);
          const color = yKey?.color || item.color;
          const value = item.value;

          return (
            <div
              key={item.dataKey}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full shadow-sm"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}40`,
                  }}
                />
                <span className="text-muted-foreground text-xs font-medium capitalize">
                  {yKey?.label || item.dataKey}
                </span>
              </div>
              <span className="text-foreground text-sm font-bold tabular-nums">
                {typeof value === "number" ? value.toLocaleString() : value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartEngine({
  data,
  type = "area",
  xKey,
  yKeys,
  height = 300,
  className = "",
  showGrid = false,
  showAverage = false,
}: ChartEngineProps) {
  const uniqueId = useId();

  // Calculate averages for each key
  const averages = yKeys.reduce(
    (acc, yKey) => {
      const values = data.map((d) => d[yKey.key] as number);
      const sum = values.reduce((a, b) => a + b, 0);
      acc[yKey.key] = Math.round(sum / values.length);
      return acc;
    },
    {} as Record<string, number>,
  );

  const renderAreaChart = () => (
    <AreaChart data={data} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
      <defs>
        {yKeys.map((yConfig, index) => {
          const gradientId = `gradient-${type}-${uniqueId}-${index}`;
          const glowId = `glow-${type}-${uniqueId}-${index}`;
          return (
            <g key={gradientId}>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={yConfig.color} stopOpacity={0.4} />
                <stop
                  offset="25%"
                  stopColor={yConfig.color}
                  stopOpacity={0.25}
                />
                <stop
                  offset="50%"
                  stopColor={yConfig.color}
                  stopOpacity={0.12}
                />
                <stop
                  offset="75%"
                  stopColor={yConfig.color}
                  stopOpacity={0.05}
                />
                <stop
                  offset="100%"
                  stopColor={yConfig.color}
                  stopOpacity={0.02}
                />
              </linearGradient>
              <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </g>
          );
        })}
      </defs>

      {showGrid && (
        <CartesianGrid
          strokeDasharray="4 4"
          vertical={false}
          stroke="hsl(var(--border))"
          opacity={0.35}
        />
      )}

      {showAverage &&
        yKeys.map((yKey) => (
          <ReferenceLine
            key={`avg-${yKey.key}`}
            y={averages[yKey.key]}
            stroke={yKey.color}
            strokeDasharray="3 3"
            opacity={0.4}
            ifOverflow="extendDomain"
          />
        ))}

      <XAxis
        dataKey={xKey}
        stroke="hsl(var(--muted-foreground))"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        minTickGap={30}
        dy={12}
        tick={{ fontWeight: 500 }}
      />
      <YAxis
        stroke="hsl(var(--muted-foreground))"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `${value}`}
        dx={-4}
        tick={{ fontWeight: 500 }}
      />
      <Tooltip
        content={
          <CustomTooltip
            yKeys={yKeys}
            active={undefined}
            payload={undefined}
            label={undefined}
          />
        }
        cursor={{
          stroke: "hsl(var(--muted-foreground))",
          strokeWidth: 1,
          strokeDasharray: "4 4",
          opacity: 0.4,
        }}
      />
      {yKeys.map((yConfig, index) => {
        const gradientId = `gradient-${type}-${uniqueId}-${index}`;
        const glowId = `glow-${type}-${uniqueId}-${index}`;
        return (
          <Area
            key={yConfig.key}
            type="monotone"
            dataKey={yConfig.key}
            stroke={yConfig.color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            animationDuration={1200}
            activeDot={{
              r: 6,
              strokeWidth: 0,
              fill: yConfig.color,
              fillOpacity: 1,
              filter: `url(#${glowId})`,
            }}
            dot={false}
          />
        );
      })}
    </AreaChart>
  );

  const renderBarChart = () => (
    <BarChart
      data={data}
      margin={{ top: 16, right: 16, left: -8, bottom: 8 }}
      barSize={32}
    >
      <defs>
        {yKeys.map((yConfig, i) => (
          <linearGradient
            key={`barGradient-${i}`}
            id={`barGradient-${yConfig.key}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={yConfig.color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={yConfig.color} stopOpacity={0.6} />
          </linearGradient>
        ))}
      </defs>

      {showGrid && (
        <CartesianGrid
          strokeDasharray="4 4"
          vertical={false}
          stroke="hsl(var(--border))"
          opacity={0.35}
        />
      )}

      {showAverage &&
        yKeys.map((yKey) => (
          <ReferenceLine
            key={`avg-${yKey.key}`}
            y={averages[yKey.key]}
            stroke={yKey.color}
            strokeDasharray="3 3"
            opacity={0.4}
            ifOverflow="extendDomain"
          />
        ))}

      <XAxis
        dataKey={xKey}
        stroke="hsl(var(--muted-foreground))"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        minTickGap={30}
        dy={12}
        tick={{ fontWeight: 500 }}
      />
      <YAxis
        stroke="hsl(var(--muted-foreground))"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `${value}`}
        dx={-4}
        tick={{ fontWeight: 500 }}
      />
      <Tooltip
        content={<CustomTooltip yKeys={yKeys} />}
        cursor={{
          fill: "hsl(var(--muted))",
          opacity: 0.3,
        }}
      />
      {yKeys.map((yConfig) => (
        <Bar
          key={yConfig.key}
          dataKey={yConfig.key}
          fill={`url(#barGradient-${yConfig.key})`}
          radius={[8, 8, 0, 0]}
          animationDuration={1000}
        />
      ))}
    </BarChart>
  );

  const renderLineChart = () => (
    <LineChart data={data} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
      <defs>
        {yKeys.map((yConfig, index) => {
          const glowId = `glow-line-${uniqueId}-${index}`;
          return (
            <filter
              key={glowId}
              id={glowId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          );
        })}
      </defs>

      {showGrid && (
        <CartesianGrid
          strokeDasharray="4 4"
          vertical={false}
          stroke="hsl(var(--border))"
          opacity={0.35}
        />
      )}

      {showAverage &&
        yKeys.map((yKey) => (
          <ReferenceLine
            key={`avg-${yKey.key}`}
            y={averages[yKey.key]}
            stroke={yKey.color}
            strokeDasharray="3 3"
            opacity={0.4}
            ifOverflow="extendDomain"
          />
        ))}

      <XAxis
        dataKey={xKey}
        stroke="hsl(var(--muted-foreground))"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        minTickGap={30}
        dy={12}
        tick={{ fontWeight: 500 }}
      />
      <YAxis
        stroke="hsl(var(--muted-foreground))"
        fontSize={10}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `${value}`}
        dx={-4}
        tick={{ fontWeight: 500 }}
      />
      <Tooltip
        content={
          <CustomTooltip
            yKeys={yKeys}
            active={undefined}
            payload={undefined}
            label={undefined}
          />
        }
        cursor={{
          stroke: "hsl(var(--muted-foreground))",
          strokeWidth: 1,
          strokeDasharray: "4 4",
          opacity: 0.4,
        }}
      />
      {yKeys.map((yConfig, index) => {
        const glowId = `glow-line-${uniqueId}-${index}`;
        return (
          <Line
            key={yConfig.key}
            type="monotone"
            dataKey={yConfig.key}
            stroke={yConfig.color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 6,
              strokeWidth: 0,
              fill: yConfig.color,
              fillOpacity: 1,
              filter: `url(#${glowId})`,
            }}
            animationDuration={1200}
          />
        );
      })}
    </LineChart>
  );

  const renderChart = () => {
    switch (type) {
      case "bar":
        return renderBarChart();
      case "line":
        return renderLineChart();
      case "area":
      default:
        return renderAreaChart();
    }
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
