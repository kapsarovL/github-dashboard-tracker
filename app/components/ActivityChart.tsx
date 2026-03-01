"use client";

import React, { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Button } from "@/app/ui/Primitives/ui/Button";
import {
  TrendingUp,
  GitCommit,
  CircleAlert,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

interface ActivityChartProps {
  data: {
    date: string;
    commits: number;
    issues: number;
  }[];
}

type ViewMode = "commits" | "issues";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  mode: ViewMode;
}

function CustomTooltip({ active, payload, label, mode }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0].value;
  const isCommits = mode === "commits";

  // Format the date nicely with better visibility
  const formattedDate = label
    ? new Date(label).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="border-border/50 bg-popover/98 min-w-[200px] rounded-2xl border p-4 shadow-2xl shadow-black/10 backdrop-blur-xl">
      {/* Header with date - enhanced visibility */}
      <div className="bg-muted/50 mb-3 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg">
            <Calendar className="text-primary h-4 w-4" />
          </div>
          <span className="text-foreground text-sm font-bold">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Value display */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg ${
            isCommits
              ? "from-primary to-primary/80 text-primary-foreground bg-linear-to-br"
              : "bg-linear-to-br from-emerald-500 to-emerald-600 text-white"
          }`}
        >
          {isCommits ? (
            <GitCommit className="h-5 w-5" />
          ) : (
            <CircleAlert className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-foreground text-2xl leading-none font-bold">
            {value.toLocaleString()}
          </p>
          <p className="text-muted-foreground mt-1 text-xs font-medium">
            {isCommits ? "commits made" : "issues created"}
          </p>
        </div>
      </div>

      {/* Trend indicator */}
      <div className="mt-3 flex items-center gap-1.5 text-emerald-500">
        <ArrowUpRight className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold">Active period</span>
      </div>
    </div>
  );
}

export function ActivityChart({ data }: ActivityChartProps) {
  const [mode, setMode] = useState<ViewMode>("commits");
  const uniqueId = React.useId();

  // Refined colors from design system
  const strokeColor = mode === "commits" ? "#2563eb" : "#16a34a"; // primary (blue-600) / success (green-600)
  const gradientId = `gradient-${mode}-${uniqueId}`;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
        <div className="max-w-[280px] px-4 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
            <TrendingUp className="text-muted-foreground/60 h-7 w-7" />
          </div>
          <h3 className="text-foreground text-sm font-semibold">
            No activity yet
          </h3>
          <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
            Activity data will appear here once the repository has commits or
            issues tracked
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCommits = data.reduce((sum, d) => sum + d.commits, 0);
  const totalIssues = data.reduce((sum, d) => sum + d.issues, 0);
  const currentData = mode === "commits" ? totalCommits : totalIssues;
  const maxValue = Math.max(
    ...data.map((d) => (mode === "commits" ? d.commits : d.issues)),
  );

  // Find best and worst days
  const bestDay = data.reduce((max, d) =>
    (mode === "commits" ? d.commits : d.issues) >
    (mode === "commits" ? max.commits : max.issues)
      ? d
      : max,
  );

  return (
    <div className="flex h-full flex-col">
      {/* Enhanced Stats Header */}
      <div className="bg-muted/50 mb-6 rounded-xl p-4 border border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Mode Toggle */}
          <div className="bg-muted flex items-center gap-1.5 rounded-lg p-1">
            <Button
              variant={mode === "commits" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("commits")}
              className={`h-8 rounded-md px-3 text-xs font-semibold transition-all ${
                mode === "commits"
                  ? "shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitCommit className="mr-1.5 h-3.5 w-3.5" />
              Commits
            </Button>
            <Button
              variant={mode === "issues" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("issues")}
              className={`h-8 rounded-md px-3 text-xs font-semibold transition-all ${
                mode === "issues"
                  ? "bg-success text-success-foreground shadow-sm hover:opacity-90"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CircleAlert className="mr-1.5 h-3.5 w-3.5" />
              Issues
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-card flex items-center gap-2 rounded-lg px-3 py-2 border border-border shadow-xs">
              <div className="text-right">
                <p className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                  Total
                </p>
                <p className="text-foreground text-sm font-bold">
                  {currentData.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-card flex items-center gap-2 rounded-lg px-3 py-2 border border-border shadow-xs">
              <div className="text-right">
                <p className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                  Peak
                </p>
                <p className="text-foreground text-sm font-bold">
                  {maxValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1" style={{ minHeight: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              left: -8,
              bottom: 4,
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="hsl(var(--border))"
              strokeDasharray="4 4"
              vertical={false}
              opacity={0.4}
            />

            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={Math.ceil(data.length / 8)}
              dy={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              dx={-4}
            />
            <Tooltip
              content={
                <CustomTooltip
                  mode={mode}
                  active={undefined}
                  payload={undefined}
                  label={undefined}
                />
              }
              cursor={{
                stroke: strokeColor,
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey={mode}
              stroke={strokeColor}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              animationDuration={1000}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "hsl(var(--background))",
                fill: strokeColor,
              }}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer with best day info */}
      <div className="mt-4 flex items-center justify-center rounded-xl bg-muted/50 border border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground shadow-sm">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Best Day:
          </span>
          <span className="text-foreground text-sm font-bold">
            {new Date(bestDay.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-muted-foreground/40 text-xs">•</span>
          <span className="text-primary text-sm font-bold">
            {mode === "commits" ? bestDay.commits : bestDay.issues}
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            {mode === "commits" ? "commits" : "issues"}
          </span>
        </div>
      </div>
    </div>
  );
}
