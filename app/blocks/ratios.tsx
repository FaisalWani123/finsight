"use client"

import React from "react";
import { Finances } from "../backend/types/Finances";

interface RatiosProps {
  inflowTotal: number;
  inflows: Finances[];
  outflowTotal: number;
  outflows: Finances[];
  assetsTotal: number;
  assets: Finances[];
  liabilitiesTotal: number;
  liabilities: Finances[];
  profileCurrency: number;
}

interface RatioCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

function RatioCard({ title, value, subtitle, color = "bg-white" }: RatioCardProps) {
  return (
    <div className={`shadow-lg rounded-xl p-6 flex flex-col justify-between ${color}`}>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

// Helper to map numeric currency to symbol
function currencySymbol(currencyId: number) {
  switch (currencyId) {
    case 1:
      return "$"; // USD
    case 2:
      return "€"; // EUR
    case 3:
      return "Ft"; // HUF
    default:
      return "";
  }
}

export default function Ratios({
  inflowTotal,
  outflowTotal,
  assetsTotal,
  liabilitiesTotal,
  profileCurrency,
}: RatiosProps) {
  const symbol = currencySymbol(profileCurrency);

  // Prevent division by zero
  const savingsRatio = inflowTotal ? ((inflowTotal - outflowTotal) / inflowTotal) * 100 : 0;
  const debtToAsset = assetsTotal ? (liabilitiesTotal / assetsTotal) * 100 : 0;
  const liquidityRatio = inflowTotal ? ((assetsTotal - liabilitiesTotal) / inflowTotal) * 100 : 0;
  const netWorth = assetsTotal - liabilitiesTotal;

  // Simple health score weighted by ratios
  const healthScore = Math.max(
    0,
    Math.min(
      100,
      savingsRatio * 0.4 + (100 - debtToAsset) * 0.3 + liquidityRatio * 0.3
    )
  );

  // Optional: color coding for good/bad ratios
  const colorForRatio = (ratio: number) =>
    ratio >= 70 ? "bg-green-100" : ratio >= 40 ? "bg-yellow-100" : "bg-red-100";

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RatioCard
        title="Total Inflow"
        value={`${symbol}${inflowTotal.toFixed(2)}`}
        subtitle="All incomes"
      />
      <RatioCard
        title="Total Outflow"
        value={`${symbol}${outflowTotal.toFixed(2)}`}
        subtitle="All expenses"
      />
      <RatioCard
        title="Net Worth"
        value={`${symbol}${netWorth.toFixed(2)}`}
        subtitle="Assets minus Liabilities"
      />
      <RatioCard
        title="Savings Ratio"
        value={`${savingsRatio.toFixed(1)}%`}
        subtitle="Inflow vs Outflow"
        color={colorForRatio(savingsRatio)}
      />
      <RatioCard
        title="Debt-to-Asset Ratio"
        value={`${debtToAsset.toFixed(1)}%`}
        subtitle="Liabilities / Assets"
        color={colorForRatio(100 - debtToAsset)}
      />
      <RatioCard
        title="Liquidity Ratio"
        value={`${liquidityRatio.toFixed(1)}%`}
        subtitle="Liquidity vs Inflow"
        color={colorForRatio(liquidityRatio)}
      />
      <RatioCard
        title="Financial Health Score"
        value={`${healthScore.toFixed(0)}/100`}
        subtitle="Overall score"
        color={colorForRatio(healthScore)}
      />
    </div>
  );
}
