import { InsightResponse } from "@/app/backend/types/Insight";
import React from "react";

interface InsightCardProps {
  insight: InsightResponse;
}

interface InsightCardsGroupProps {
  insights: InsightResponse[]; // array of insight objects
}

// Style helpers
const borderColorForLevel = (level: number) => {
  switch (level) {
    case 3:
      return "border-red-400 bg-red-50";
    case 2:
      return "border-yellow-400 bg-yellow-50";
    case 1:
      return "border-blue-400 bg-blue-50";
    default:
      return "border-green-400 bg-green-50";
  }
};

const iconForType = (type: number) => {
  switch (type) {
    case 2:
      return "⚠️";
    case 1:
      return "ℹ️";
    default:
      return "✅";
  }
};

const categoryLabel = (type: number) => {
  switch (type) {
    case 1:
      return "Inflow Insight";
    case 2:
      return "Outflow Insight";
    case 3:
      return "Asset Insight";
    case 4:
      return "Liability Insight";
    default:
      return "General Insight";
  }
};

// Single Card
export function InsightCard({ insight }: InsightCardProps) {
  return (
    <div
      className={`shadow-md rounded-lg p-5 border-l-4 flex items-start gap-3 ${borderColorForLevel(
        insight.warningLevel
      )}`}
    >
      <div className="text-2xl mt-0.5">{iconForType(insight.type)}</div>
      <div>
        <p className="font-semibold text-gray-700 mb-1">{insight.message}</p>
        <p className="text-m text-gray-400">{`Severity: ${insight.warningLevel}`}</p>
      </div>
    </div>
  );
}

// Cards group for an array
export function InsightCardsGroup({ insights }: InsightCardsGroupProps) {
  // Optionally group by category/type
  const grouped = insights.reduce((acc: { [key: number]: InsightResponse[] }, cur) => {
    acc[cur.type] = acc[cur.type] ?? [];
    acc[cur.type].push(cur);
    return acc;
  }, {});

  return (
    <div className="p-4">

    <div className="grid grid-cols-1 gap-6">
      {Object.entries(grouped).map(([type, group]) => (
        <div key={type}>
          <h2 className="text-lg font-bold mb-2">{categoryLabel(Number(type))}</h2>
          <div className="flex flex-col gap-3">
            {group.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} />
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>

  );
}
